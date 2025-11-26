import { AppDispatch } from '../index';
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
} from '../slices/chatSlice';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  serverTimestamp,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/config/firebase';

// Real-time listener for all chats
export const subscribeToChats = () => (dispatch: AppDispatch) => {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, orderBy('lastMessageTime', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const chats: Chat[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
      dispatch(setChats(chats));
    },
    (error) => {
      console.error('Error fetching chats:', error);
      dispatch(setError('Failed to load chats'));
    }
  );

  return unsubscribe;
};

// Real-time listener for messages in a specific chat
export const subscribeToMessages = (chatId: string) => (dispatch: AppDispatch) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      dispatch(setMessages({ chatId, messages }));
    },
    (error) => {
      console.error('Error fetching messages:', error);
      dispatch(setError('Failed to load messages'));
    }
  );

  return unsubscribe;
};

// Send a text message
export const sendMessage =
  (chatId: string, text: string, from: 'admin' | 'customer') =>
  async (dispatch: AppDispatch) => {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const chatRef = doc(db, 'chats', chatId);

      // Add message to subcollection
      await addDoc(messagesRef, {
        from,
        text,
        type: 'text',
        timestamp: serverTimestamp(),
      });

      // Update chat's last message and timestamp
      const updateData: any = {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
      };

      // Increment unread count only for customer messages
      if (from === 'customer') {
        updateData.unreadCount = increment(1);
      }

      await updateDoc(chatRef, updateData);
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(setError('Failed to send message'));
      throw error;
    }
  };

// Upload and send image message
export const sendImageMessage =
  (chatId: string, file: File, from: 'admin' | 'customer') =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setUploadingImage(true));

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 2MB');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG, PNG, GIF, and WEBP images are allowed');
      }

      // Upload image to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${chatId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `chat-images/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Add message with image
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const chatRef = doc(db, 'chats', chatId);

      await addDoc(messagesRef, {
        from,
        text: '📷 Image',
        type: 'image',
        imageUrl,
        timestamp: serverTimestamp(),
      });

      // Update chat's last message
      const updateData: any = {
        lastMessage: '📷 Image',
        lastMessageTime: serverTimestamp(),
      };

      if (from === 'customer') {
        updateData.unreadCount = increment(1);
      }

      await updateDoc(chatRef, updateData);

      dispatch(setUploadingImage(false));
    } catch (error) {
      console.error('Error sending image:', error);
      dispatch(setUploadingImage(false));
      dispatch(setError(error instanceof Error ? error.message : 'Failed to send image'));
      throw error;
    }
  };

// Mark chat as read (reset unread count)
export const markChatAsRead = (chatId: string) => async (dispatch: AppDispatch) => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    await updateDoc(chatRef, {
      unreadCount: 0,
    });
    dispatch(resetUnreadCount(chatId));
  } catch (error) {
    console.error('Error marking chat as read:', error);
  }
};

// Create a new chat (for customer side)
export const createChat = async (conversationId: string, customerName: string = 'Guest') => {
  try {
    const chatsRef = collection(db, 'chats');
    const chatDoc = await addDoc(chatsRef, {
      conversationId,
      customerName,
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      unreadCount: 0,
      createdAt: serverTimestamp(),
    });
    return chatDoc.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};
