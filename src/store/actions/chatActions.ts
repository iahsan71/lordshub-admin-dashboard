import { AppDispatch } from "../index";
import {
  setChats,
  setMessages,
  addMessage,
  setLoading,
  setError,
  setUploadingImage,
  resetUnreadCount,
  Chat,
  Message,
} from "../slices/chatSlice";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { toast } from "react-toastify";

// Real-time listener for all chats (from customer side structure)
export const subscribeToChats = () => (dispatch: AppDispatch) => {
  console.log("🔍 Subscribing to chats at: chatSessions");
  const chatsRef = collection(db, "chatSessions");

  // Listen to all sessions without ordering first (to avoid index issues)
  const unsubscribe = onSnapshot(
    chatsRef,
    (snapshot) => {
      console.log(
        "📨 Received snapshot with",
        snapshot.docs.length,
        "documents"
      );

      const chats: Chat[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          console.log("📄 Chat document:", doc.id, data);
          return {
            id: doc.id,
            conversationId: data.visitorId || doc.id,
            customerName: data.visitorName || "Guest",
            lastMessage: data.lastMessage || "",
            lastMessageType: data.lastMessageType || "text",
            lastMessageImageUrl: data.lastMessageImageUrl,
            lastMessageTime: data.updatedAt || data.createdAt || null,
            unreadCount: data.unreadCount || 0,
            createdAt: data.createdAt || null,
          };
        })
        .filter((chat) => chat.lastMessageTime) // Filter out chats without timestamps
        .sort((a, b) => {
          // Sort by lastMessageTime descending (newest first)
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;
          return b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis();
        }) as Chat[];

      console.log("✅ Loaded chats:", chats.length, chats);
      dispatch(setChats(chats));
    },
    (error) => {
      console.error("❌ Error fetching chats:", error);
      dispatch(setError("Failed to load chats"));
    }
  );

  return unsubscribe;
};

// Real-time listener for messages in a specific chat (from customer side structure)
export const subscribeToMessages =
  (chatId: string) => (dispatch: AppDispatch) => {
    console.log("💬 Subscribing to messages for chat:", chatId);
    const messagesRef = collection(db, "chatSessions", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(
          "📬 Received",
          snapshot.docs.length,
          "messages for chat:",
          chatId
        );
        const messages: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("💌 Message:", doc.id, data);
          return {
            id: doc.id,
            from: data.sender === "visitor" ? "customer" : "admin",
            text: data.text || "",
            type: data.type || "text",
            imageUrl: data.imageUrl,
            timestamp: data.timestamp,
            sentVia: data.sentVia,
          };
        }) as Message[];
        console.log("✅ Dispatching", messages.length, "messages");
        dispatch(setMessages({ chatId, messages }));
      },
      (error) => {
        console.error("❌ Error fetching messages:", error);
        dispatch(setError("Failed to load messages"));
      }
    );

    return unsubscribe;
  };

// Send a text message (matching customer side structure)
export const sendMessage =
  (chatId: string, text: string, from: "admin" | "customer") =>
  async (dispatch: AppDispatch) => {
    try {
      const messagesRef = collection(db, "chatSessions", chatId, "messages");
      const chatRef = doc(db, "chatSessions", chatId);

      // Add message to subcollection with customer side structure
      await addDoc(messagesRef, {
        sender: from === "admin" ? "admin" : "visitor",
        text,
        type: "text",
        timestamp: serverTimestamp(),
        read: false,
        sentVia: "web", // Mark as sent from web to differentiate from Telegram
      });

      // Update chat's last message and timestamp
      const updateData: any = {
        lastMessage: text,
        lastMessageType: "text",
        lastMessageImageUrl: null,
        updatedAt: serverTimestamp(),
      };

      // Reset unread count when admin sends message
      if (from === "admin") {
        updateData.unreadCount = 0;
      } else {
        updateData.unreadCount = increment(1);
      }

      await updateDoc(chatRef, updateData);
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(setError("Failed to send message"));
      toast.error("Failed to send message");
      throw error;
    }
  };

// Upload and send image message (matching customer side structure)
export const sendImageMessage =
  (chatId: string, file: File, from: "admin" | "customer") =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setUploadingImage(true));

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        throw new Error("Image size must be less than 2MB");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG, GIF, and WEBP images are allowed");
      }

      // Upload image to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${chatId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `chat-images/${fileName}`);

      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Add message with image (matching customer side structure)
      const messagesRef = collection(db, "chatSessions", chatId, "messages");
      const chatRef = doc(db, "chatSessions", chatId);

      await addDoc(messagesRef, {
        sender: from === "admin" ? "admin" : "visitor",
        text: "📷 Image",
        type: "image",
        imageUrl,
        timestamp: serverTimestamp(),
        read: false,
        sentVia: "web", // Mark as sent from web to differentiate from Telegram
      });

      // Update chat's last message
      const updateData: any = {
        lastMessage: "📷 Image",
        lastMessageType: "image",
        lastMessageImageUrl: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (from === "admin") {
        updateData.unreadCount = 0;
      } else {
        updateData.unreadCount = increment(1);
      }

      await updateDoc(chatRef, updateData);

      dispatch(setUploadingImage(false));
    } catch (error) {
      console.error("Error sending image:", error);
      dispatch(setUploadingImage(false));
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to send image"
        )
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to send image"
      );
      throw error;
    }
  };

// Mark chat as read (reset unread count) - matching customer side structure
export const markChatAsRead =
  (chatId: string) => async (dispatch: AppDispatch) => {
    try {
      const chatRef = doc(db, "chatSessions", chatId);
      await updateDoc(chatRef, {
        unreadCount: 0,
      });

      // Mark all messages as read
      const messagesRef = collection(db, "chatSessions", chatId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      const batch = writeBatch(db);
      messagesSnapshot.docs.forEach((messageDoc) => {
        if (!messageDoc.data().read) {
          batch.update(messageDoc.ref, { read: true });
        }
      });
      await batch.commit();

      dispatch(resetUnreadCount(chatId));
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  };

// Create a new chat (for customer side)
export const createChat = async (
  conversationId: string,
  customerName: string = "Guest"
) => {
  try {
    const chatsRef = collection(db, "chats");
    const chatDoc = await addDoc(chatsRef, {
      conversationId,
      customerName,
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
      unreadCount: 0,
      createdAt: serverTimestamp(),
    });
    return chatDoc.id;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
};
