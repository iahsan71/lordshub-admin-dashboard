import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';

export interface Offer {
  id: string;
  productId: string;
  name: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OffersState {
  offers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  loading: false,
  error: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    addOffer: (state, action: PayloadAction<Offer>) => {
      state.offers.unshift(action.payload);
    },
    updateOffer: (state, action: PayloadAction<Offer>) => {
      const index = state.offers.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
    },
    deleteOffer: (state, action: PayloadAction<string>) => {
      state.offers = state.offers.filter(o => o.id !== action.payload);
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
  setOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  setLoading,
  setError,
} = offersSlice.actions;

export default offersSlice.reducer;
