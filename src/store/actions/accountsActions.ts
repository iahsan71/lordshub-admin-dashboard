import { AppDispatch } from '../index';
import {
  setAccounts,
  addAccount as addAccountToState,
  updateAccount as updateAccountInState,
  deleteAccount as deleteAccountFromState,
  setLoading,
  setError,
  setUploadingImages,
  Account,
} from '../slices/accountsSlice';
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
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/config/firebase';

// Real-time listener for all accounts
export const subscribeToAccounts = () => (dispatch: AppDispatch) => {
  const accountsRef = collection(db, 'accounts');
  const q = query(accountsRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const accounts: Account[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Account[];
      dispatch(setAccounts(accounts));
      dispatch(setLoading(false));
    },
    (error) => {
      console.error('Error fetching accounts:', error);
      dispatch(setError('Failed to load accounts'));
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

// Upload multiple images to Firebase Storage
const uploadImages = async (files: File[], productId: string): Promise<string[]> => {
  const uploadPromises = files.map(async (file, index) => {
    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`Image ${file.name} is too large. Max size is 5MB`);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Image ${file.name} has invalid format. Only JPG, PNG, GIF, and WEBP are allowed`);
    }

    // Upload to Storage
    const timestamp = Date.now();
    const fileName = `${productId}_${timestamp}_${index}_${file.name}`;
    const storageRef = ref(storage, `account-images/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  });

  return Promise.all(uploadPromises);
};

// Delete images from Firebase Storage
const deleteImages = async (imageUrls: string[]) => {
  const deletePromises = imageUrls.map(async (url) => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/o/');
      if (urlParts.length > 1) {
        const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // Continue even if one image fails to delete
    }
  });

  await Promise.all(deletePromises);
};

// Generate unique product ID
const generateProductId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ACC${timestamp}${random}`;
};

// Add new account
export const addAccount =
  (data: {
    title: string;
    description: string;
    price: number;
    images: File[];
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setUploadingImages(true));

      // Generate unique product ID
      const productId = generateProductId();

      // Upload images first
      const imageUrls = data.images.length > 0 
        ? await uploadImages(data.images, productId)
        : [];

      // Add account to Firestore
      const accountsRef = collection(db, 'accounts');
      const docRef = await addDoc(accountsRef, {
        productId,
        title: data.title,
        description: data.description,
        price: data.price,
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      dispatch(setUploadingImages(false));
      dispatch(setLoading(false));
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding account:', error);
      dispatch(setUploadingImages(false));
      dispatch(setLoading(false));
      
      // Provide more specific error messages
      let errorMessage = 'Failed to add account';
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

// Update existing account
export const updateAccount =
  (
    accountId: string,
    productId: string,
    data: {
      title: string;
      description: string;
      price: number;
      newImages?: File[];
      existingImages: string[];
    }
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setUploadingImages(true));

      let imageUrls = [...data.existingImages];

      // Upload new images if provided
      if (data.newImages && data.newImages.length > 0) {
        const newImageUrls = await uploadImages(data.newImages, productId);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Update account in Firestore
      const accountRef = doc(db, 'accounts', accountId);
      await updateDoc(accountRef, {
        title: data.title,
        description: data.description,
        price: data.price,
        images: imageUrls,
        updatedAt: serverTimestamp(),
      });

      dispatch(setUploadingImages(false));
      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error updating account:', error);
      dispatch(setUploadingImages(false));
      dispatch(setLoading(false));
      
      let errorMessage = 'Failed to update account';
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

// Delete account
export const deleteAccount = (accountId: string, imageUrls: string[]) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Delete images from Storage
    if (imageUrls.length > 0) {
      await deleteImages(imageUrls);
    }

    // Delete account from Firestore
    const accountRef = doc(db, 'accounts', accountId);
    await deleteDoc(accountRef);

    dispatch(deleteAccountFromState(accountId));
    dispatch(setLoading(false));
  } catch (error) {
    console.error('Error deleting account:', error);
    dispatch(setLoading(false));
    dispatch(setError(error instanceof Error ? error.message : 'Failed to delete account'));
    throw error;
  }
};

// Remove a single image from an account
export const removeImageFromAccount =
  (accountId: string, imageUrl: string, remainingImages: string[]) =>
  async (dispatch: AppDispatch) => {
    try {
      // Delete image from Storage
      await deleteImages([imageUrl]);

      // Update account in Firestore
      const accountRef = doc(db, 'accounts', accountId);
      await updateDoc(accountRef, {
        images: remainingImages,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error removing image:', error);
      dispatch(setError(error instanceof Error ? error.message : 'Failed to remove image'));
      throw error;
    }
  };
