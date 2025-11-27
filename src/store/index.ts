import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import accountsReducer from './slices/accountsSlice';
import diamondsReducer from './slices/diamondsSlice';
import botsReducer from './slices/botsSlice';
import offersReducer from './slices/offersSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    accounts: accountsReducer,
    diamonds: diamondsReducer,
    bots: botsReducer,
    offers: offersReducer,
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
          'diamonds/setDiamonds',
          'diamonds/addDiamond',
          'diamonds/updateDiamond',
          'bots/setBots',
          'bots/addBot',
          'bots/updateBot',
          'offers/setOffers',
          'offers/addOffer',
          'offers/updateOffer',
        ],
        ignoredPaths: ['chat.chats', 'chat.messages', 'accounts.accounts', 'diamonds.diamonds', 'bots.bots', 'offers.offers'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
