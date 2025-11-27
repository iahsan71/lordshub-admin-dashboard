import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';

export interface Diamond {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface DiamondsState {
  diamonds: Diamond[];
  loading: boolean;
  error: string | null;
}

const initialState: DiamondsState = {
  diamonds: [],
  loading: false,
  error: null,
};

const diamondsSlice = createSlice({
  name: 'diamonds',
  initialState,
  reducers: {
    setDiamonds: (state, action: PayloadAction<Diamond[]>) => {
      state.diamonds = action.payload;
    },
    addDiamond: (state, action: PayloadAction<Diamond>) => {
      state.diamonds.unshift(action.payload);
    },
    updateDiamond: (state, action: PayloadAction<Diamond>) => {
      const index = state.diamonds.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.diamonds[index] = action.payload;
      }
    },
    deleteDiamond: (state, action: PayloadAction<string>) => {
      state.diamonds = state.diamonds.filter(d => d.id !== action.payload);
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
  setDiamonds,
  addDiamond,
  updateDiamond,
  deleteDiamond,
  setLoading,
  setError,
} = diamondsSlice.actions;

export default diamondsSlice.reducer;
