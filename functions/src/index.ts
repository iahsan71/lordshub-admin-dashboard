import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import TelegramBot from "node-telegram-bot-api";

admin.initializeApp();

const TELEGRAM_BOT_TOKEN = "8046918233:AAFOTe15mCJZfqQY1Fj1O9AAaSX1iLnWzu0";
const ADMIN_TELEGRAM_ID = "6331413591";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// Store mapping of chatSessionId -> telegramMessageId for threading
const chatThreadMap = new Map<string, number>();

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
    const replyToMessageId = message.reply_to_message.message_id;
    
    // Find which chat session this message belongs to
    let targetChatSessionId: string | null = null;
    
    // Search through our thread map
    for (const [sessionId, messageId] of chatThreadMap.entries()) {
      if (messageId === replyToMessageId) {
        targetChatSessionId = sessionId;
        break;
      }
    }

    // If not found in memory, check message text for session ID
    if (!targetChatSessionId) {
      const replyText = message.reply_to_message.text || "";
      const match = replyText.match(/\[Session: ([^\]]+)\]/);
      if (match) {
        targetChatSessionId = match[1];
      }
    }

    if (!targetChatSessionId) {
      await bot.sendMessage(
        ADMIN_TELEGRAM_ID,
        "❌ Could not identify the chat session. Please reply to a customer message."
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
      
      // Get file URL from Telegram
      const file = await bot.getFile(fileId);
      imageUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      messageText = message.caption || "📷 Image";
      messageType = "image";
    }

    // Send message to Firestore
    const messagesRef = admin.firestore()
      .collection("chatSessions")
      .doc(targetChatSessionId)
      .collection("messages");

    await messagesRef.add({
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

    // Confirm to admin
    await bot.sendMessage(
      ADMIN_TELEGRAM_ID,
      "✅ Message sent successfully!",
      { reply_to_message_id: message.message_id }
    );

  } catch (error) {
    console.error("Error handling admin reply:", error);
    await bot.sendMessage(
      ADMIN_TELEGRAM_ID,
      `❌ Error sending message: ${error}`
    );
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
      const customerName = sessionData?.visitorName || "Guest";
      const visitorId = sessionData?.visitorId || sessionId;

      // Prepare message text
      let telegramMessage = `💬 New message from ${customerName}\n`;
      telegramMessage += `[Session: ${sessionId}]\n`;
      telegramMessage += `User ID: ${visitorId}\n\n`;

      if (message.type === "image" && message.imageUrl) {
        // Send image with caption
        const sentMessage = await bot.sendPhoto(
          ADMIN_TELEGRAM_ID,
          message.imageUrl,
          {
            caption: telegramMessage + (message.text || "📷 Image")
          }
        );
        
        // Store thread mapping
        chatThreadMap.set(sessionId, sentMessage.message_id);
      } else {
        // Send text message
        telegramMessage += message.text;
        
        const sentMessage = await bot.sendMessage(
          ADMIN_TELEGRAM_ID,
          telegramMessage
        );
        
        // Store thread mapping
        chatThreadMap.set(sessionId, sentMessage.message_id);
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

      // Get the thread message ID
      const threadMessageId = chatThreadMap.get(sessionId);
      
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
