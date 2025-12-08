import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import TelegramBot from "node-telegram-bot-api";

admin.initializeApp();

const TELEGRAM_BOT_TOKEN = "8029311115:AAH6JOMdBGuUekWMcg0TXNQy-ngUFQ1M6I0";
const ADMIN_TELEGRAM_ID = "8249444980";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

/**
 * Get thread message ID from Firestore
 */
async function getThreadMessageId(sessionId: string): Promise<number | null> {
  try {
    const doc = await admin.firestore()
      .collection('telegramThreads')
      .doc(sessionId)
      .get();
    
    return doc.exists ? doc.data()?.messageId || null : null;
  } catch (error) {
    console.error("Error getting thread message ID:", error);
    return null;
  }
}

/**
 * Store thread message ID in Firestore
 */
async function setThreadMessageId(sessionId: string, messageId: number): Promise<void> {
  try {
    await admin.firestore()
      .collection('telegramThreads')
      .doc(sessionId)
      .set({
        messageId,
        sessionId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
  } catch (error) {
    console.error("Error setting thread message ID:", error);
  }
}

/**
 * Webhook endpoint for Telegram bot
 * Receives messages from admin and sends them to Firestore
 */
export const telegramWebhook = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const update = req.body;
    console.log("Telegram update received:", JSON.stringify(update));

    if (!update.message) {
      res.status(200).send("OK");
      return;
    }

    const message = update.message;
    const chatId = message.chat.id.toString();

    // Only process messages from admin
    if (chatId !== ADMIN_TELEGRAM_ID) {
      await bot.sendMessage(chatId, "Unauthorized. This bot is for admin use only.");
      res.status(200).send("OK");
      return;
    }

    // Handle reply to a message (threaded conversation)
    if (message.reply_to_message) {
      await handleAdminReply(message);
    } else {
      // Not a reply - send help message
      await bot.sendMessage(
        ADMIN_TELEGRAM_ID,
        "ℹ️ To reply to a customer, please use the Reply button on their message.\n\n" +
        "Don't send a new message - tap and hold (or right-click) on the customer's message and select Reply."
      );
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error in telegramWebhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * Handle admin reply from Telegram
 */
async function handleAdminReply(message: any) {
  try {
    
    // Extract session ID from replied message text
    const replyText = message.reply_to_message.text || message.reply_to_message.caption || "";
    
    const match = replyText.match(/\[Session: ([^\]]+)\]/);
    const targetChatSessionId = match ? match[1] : null;

    if (!targetChatSessionId) {
      console.error("❌ Could not extract session ID from:", replyText);
      await bot.sendMessage(
        ADMIN_TELEGRAM_ID,
        "❌ Could not identify the chat session. Please reply to a customer message that contains [Session: ...]"
      );
      return;
    }

    const sessionDoc = await admin.firestore()
      .collection("chatSessions")
      .doc(targetChatSessionId)
      .get();

    if (!sessionDoc.exists) {
      console.error("❌ Session not found:", targetChatSessionId);
      await bot.sendMessage(
        ADMIN_TELEGRAM_ID,
        `❌ Chat session not found: ${targetChatSessionId}`
      );
      return;
    }

    // Get the message content
    let messageText = message.text || "";
    let messageType = "text";
    let imageUrl = null;

    // Handle photo messages
    if (message.photo && message.photo.length > 0) {
      const photo = message.photo[message.photo.length - 1]; // Get highest resolution
      const fileId = photo.file_id;
      
      try {
        const file = await bot.getFile(fileId);
        imageUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
        messageText = message.caption || "📷 Image";
        messageType = "image";
      } catch (error) {
        console.error("Error getting photo:", error);
        await bot.sendMessage(
          ADMIN_TELEGRAM_ID,
          "❌ Failed to process image. Please try again."
        );
        return;
      }
    }

    if (!messageText.trim() && !imageUrl) {
      await bot.sendMessage(
        ADMIN_TELEGRAM_ID,
        "❌ Message cannot be empty."
      );
      return;
    }


    // Send message to Firestore
    const messagesRef = admin.firestore()
      .collection("chatSessions")
      .doc(targetChatSessionId)
      .collection("messages");

    const messageDoc = await messagesRef.add({
      sender: "admin",
      text: messageText,
      type: messageType,
      imageUrl: imageUrl,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
      sentVia: "telegram"
    });

    // Update chat session
    await admin.firestore()
      .collection("chatSessions")
      .doc(targetChatSessionId)
      .update({
        lastMessage: messageText,
        lastMessageType: messageType,
        lastMessageImageUrl: imageUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        unreadCount: 0
      });


  } catch (error) {
    console.error("❌ Error handling admin reply:", error);
  }
}

/**
 * Firestore trigger: When a new message is added by customer
 * Send notification to admin on Telegram
 */
export const onNewCustomerMessage = functions.firestore
  .document("chatSessions/{sessionId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    try {
      const message = snap.data();
      const sessionId = context.params.sessionId;

      // Only notify for customer messages
      if (message.sender !== "visitor") {
        return;
      }

      // Get session info
      const sessionDoc = await admin.firestore()
        .collection("chatSessions")
        .doc(sessionId)
        .get();

      const sessionData = sessionDoc.data();
      const visitorId = sessionData?.visitorId || sessionId;

      // Prepare message text with session ID
      let telegramMessage = `New text from visitor ${visitorId}\n`;
      telegramMessage += `[Session: ${sessionId}]\n\n`;

      // Get existing thread message ID
      const threadMessageId = await getThreadMessageId(sessionId);

      let sentMessage;

      if (message.type === "image" && message.imageUrl) {
        // Send image with caption
        const options: any = {
          caption: telegramMessage + (message.text || "📷 Image")
        };
        
        if (threadMessageId) {
          options.reply_to_message_id = threadMessageId;
        }

        sentMessage = await bot.sendPhoto(
          ADMIN_TELEGRAM_ID,
          message.imageUrl,
          options
        );
      } else {
        // Send text message
        telegramMessage += message.text;
        
        const options: any = {};
        if (threadMessageId) {
          options.reply_to_message_id = threadMessageId;
        }

        sentMessage = await bot.sendMessage(
          ADMIN_TELEGRAM_ID,
          telegramMessage,
          options
        );
      }

      // Store thread mapping if this is the first message
      if (!threadMessageId) {
        await setThreadMessageId(sessionId, sentMessage.message_id);
      }

      console.log(`Notification sent to admin for session ${sessionId}`);
    } catch (error) {
      console.error("Error in onNewCustomerMessage:", error);
    }
  });

/**
 * Firestore trigger: When admin sends message from web app
 * Update Telegram thread (optional - for visibility)
 */
export const onNewAdminMessage = functions.firestore
  .document("chatSessions/{sessionId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    try {
      const message = snap.data();
      const sessionId = context.params.sessionId;

      // Only process admin messages sent from web (not from Telegram)
      if (message.sender !== "admin" || message.sentVia === "telegram") {
        return;
      }

      // Get the thread message ID from Firestore
      const threadMessageId = await getThreadMessageId(sessionId);
      
      if (threadMessageId) {
        // Send as reply to keep thread organized
        let replyText = "✉️ You replied from web:\n\n";
        replyText += message.text;

        if (message.type === "image" && message.imageUrl) {
          await bot.sendPhoto(
            ADMIN_TELEGRAM_ID,
            message.imageUrl,
            {
              caption: replyText,
              reply_to_message_id: threadMessageId
            }
          );
        } else {
          await bot.sendMessage(
            ADMIN_TELEGRAM_ID,
            replyText,
            { reply_to_message_id: threadMessageId }
          );
        }
      }

      console.log(`Admin message from web synced to Telegram for session ${sessionId}`);
    } catch (error) {
      console.error("Error in onNewAdminMessage:", error);
    }
  });

/**
 * HTTP function to set Telegram webhook
 * Call this once to configure the webhook
 */
export const setTelegramWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const functionUrl = `https://us-central1-lordshubgaming.cloudfunctions.net/telegramWebhook`;
    
    const result = await bot.setWebHook(functionUrl);
    
    if (result) {
      res.status(200).json({
        success: true,
        message: "Webhook set successfully",
        url: functionUrl
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to set webhook"
      });
    }
  } catch (error) {
    console.error("Error setting webhook:", error);
    res.status(500).json({
      success: false,
      error: String(error)
    });
  }
});
