import { AppDispatch } from '../index';
import {
  setDiamonds,
  addDiamond as addDiamondToState,
  updateDiamond as updateDiamondInState,
  deleteDiamond as deleteDiamondFromState,
  setLoading,
  setError,
  Diamond,
} from '../slices/diamondsSlice';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Real-time listener for all diamonds
export const subscribeToDiamonds = () => (dispatch: AppDispatch) => {
  const diamondsRef = collection(db, 'diamonds');
  const q = query(diamondsRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const diamonds: Diamond[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Diamond[];
      dispatch(setDiamonds(diamonds));
      dispatch(setLoading(false));
    },
    (error) => {
      console.error('Error fetching diamonds:', error);
      dispatch(setError('Failed to load diamonds'));
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

// Generate unique product ID
const generateProductId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DIA${timestamp}${random}`;
};

// Add new diamond
export const addDiamond =
  (data: {
    name: string;
    description: string;
    price: number;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Generate unique product ID
      const productId = generateProductId();

      // Add diamond to Firestore
      const diamondsRef = collection(db, 'diamonds');
      const docRef = await addDoc(diamondsRef, {
        productId,
        name: data.name,
        description: data.description,
        price: data.price,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding diamond:', error);
      dispatch(setLoading(false));
      
      let errorMessage = 'Failed to add diamond';
      if (error instanceof Error) {
        if (error.message.includes('permission-denied') || error.message.includes('Missing or insufficient permissions')) {
          errorMessage = 'Permission denied. Please ensure Firestore rules are set up correctly.';
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Update existing diamond
export const updateDiamond =
  (
    diamondId: string,
    productId: string,
    data: {
      name: string;
      description: string;
      price: number;
    }
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Update diamond in Firestore
      const diamondRef = doc(db, 'diamonds', diamondId);
      await updateDoc(diamondRef, {
        name: data.name,
        description: data.description,
        price: data.price,
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error updating diamond:', error);
      dispatch(setLoading(false));
      
      let errorMessage = 'Failed to update diamond';
      if (error instanceof Error) {
        if (error.message.includes('permission-denied') || error.message.includes('Missing or insufficient permissions')) {
          errorMessage = 'Permission denied. Please ensure Firestore rules are set up correctly.';
        } else {
          errorMessage = error.message;
        }
      }
      
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Delete diamond
export const deleteDiamond = (diamondId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Delete diamond from Firestore
    const diamondRef = doc(db, 'diamonds', diamondId);
    await deleteDoc(diamondRef);

    dispatch(deleteDiamondFromState(diamondId));
    dispatch(setLoading(false));
  } catch (error) {
    console.error('Error deleting diamond:', error);
    dispatch(setLoading(false));
    dispatch(setError(error instanceof Error ? error.message : 'Failed to delete diamond'));
    throw error;
  }
};
