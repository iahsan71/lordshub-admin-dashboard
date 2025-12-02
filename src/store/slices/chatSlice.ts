import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  from: 'admin' | 'customer';
  text: string;
  type: 'text' | 'image';
  imageUrl?: string;
  timestamp: Timestamp;
  sentVia?: 'web' | 'telegram';
}

export interface Chat {
  id: string;
  conversationId: string;
  customerName: string;
  lastMessage: string;
  lastMessageType?: 'text' | 'image';
  lastMessageImageUrl?: string;
  lastMessageTime: Timestamp;
  unreadCount: number;
  createdAt: Timestamp;
}

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  selectedChatId: string | null;
  loading: boolean;
  error: string | null;
  uploadingImage: boolean;
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  selectedChatId: null,
  loading: false,
  error: null,
  uploadingImage: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      if (!state.messages[action.payload.chatId]) {
        state.messages[action.payload.chatId] = [];
      }
      state.messages[action.payload.chatId].push(action.payload.message);
    },
    setSelectedChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadingImage: (state, action: PayloadAction<boolean>) => {
      state.uploadingImage = action.payload;
    },
    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
  },
});

export const {
  setChats,
  setMessages,
  addMessage,
  setSelectedChat,
  setLoading,
  setError,
  setUploadingImage,
  resetUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
