import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';

export interface Bot {
  id: string;
  productId: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  type: 'war' | 'rein' | 'kvk' | 'farm';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface BotsState {
  bots: Bot[];
  loading: boolean;
  error: string | null;
}

const initialState: BotsState = {
  bots: [],
  loading: false,
  error: null,
};

const botsSlice = createSlice({
  name: 'bots',
  initialState,
  reducers: {
    setBots: (state, action: PayloadAction<Bot[]>) => {
      state.bots = action.payload;
    },
    addBot: (state, action: PayloadAction<Bot>) => {
      state.bots.unshift(action.payload);
    },
    updateBot: (state, action: PayloadAction<Bot>) => {
      const index = state.bots.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bots[index] = action.payload;
      }
    },
    deleteBot: (state, action: PayloadAction<string>) => {
      state.bots = state.bots.filter(b => b.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBots,
  addBot,
  updateBot,
  deleteBot,
  setLoading,
  setError,
} = botsSlice.actions;

export default botsSlice.reducer;
