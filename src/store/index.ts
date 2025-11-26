import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import accountsReducer from './slices/accountsSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    accounts: accountsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firebase Timestamp objects in actions and state
        ignoredActions: [
          'chat/setChats',
          'chat/setMessages',
          'chat/addMessage',
          'accounts/setAccounts',
          'accounts/addAccount',
          'accounts/updateAccount',
        ],
        ignoredPaths: ['chat.chats', 'chat.messages', 'accounts.accounts'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
