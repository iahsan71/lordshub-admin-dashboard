import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';

export interface Account {
  id: string;
  productId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  uploadingImages: boolean;
}

const initialState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
  uploadingImages: false,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.unshift(action.payload);
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadingImages: (state, action: PayloadAction<boolean>) => {
      state.uploadingImages = action.payload;
    },
  },
});

export const {
  setAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  setLoading,
  setError,
  setUploadingImages,
} = accountsSlice.actions;

export default accountsSlice.reducer;
