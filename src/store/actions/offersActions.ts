import { AppDispatch } from "../index";
import {
  setOffers,
  addOffer as addOfferToState,
  updateOffer as updateOfferInState,
  deleteOffer as deleteOfferFromState,
  setLoading,
  setError,
  Offer,
} from "../slices/offersSlice";
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
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { toast } from "react-toastify";

// Real-time listener for all offers
export const subscribeToOffers = () => (dispatch: AppDispatch) => {
  const offersRef = collection(db, "offers");
  const q = query(offersRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const offers: Offer[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Offer[];
      dispatch(setOffers(offers));
      dispatch(setLoading(false));
    },
    (error) => {
      console.error("Error fetching offers:", error);
      dispatch(setError("Failed to load offers"));
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

// Generate unique product ID
const generateProductId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `OFF${timestamp}${random}`;
};

// Upload media file to Firebase Storage
const uploadMedia = async (file: File, productId: string): Promise<string> => {
  const fileExtension = file.name.split(".").pop();
  const fileName = `offers/${productId}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// Delete media file from Firebase Storage
const deleteMedia = async (mediaUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, mediaUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting media:", error);
  }
};

// Add new offer
export const addOffer =
  (data: {
    name: string;
    description: string;
    mediaFile: File;
    mediaType: "image" | "video";
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Generate unique product ID
      const productId = generateProductId();

      // Upload media file
      const mediaUrl = await uploadMedia(data.mediaFile, productId);

      // Add offer to Firestore
      const offersRef = collection(db, "offers");
      const docRef = await addDoc(offersRef, {
        productId,
        name: data.name,
        description: data.description,
        mediaUrl,
        mediaType: data.mediaType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
      toast.success("Offer added");
      return docRef.id;
    } catch (error) {
      console.error("Error adding offer:", error);
      dispatch(setLoading(false));

      let errorMessage = "Failed to add offer";
      if (error instanceof Error) {
        if (
          error.message.includes("permission-denied") ||
          error.message.includes("Missing or insufficient permissions")
        ) {
          errorMessage =
            "Permission denied. Please ensure Firestore and Storage rules are set up correctly.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Update existing offer
export const updateOffer =
  (
    offerId: string,
    productId: string,
    data: {
      name: string;
      description: string;
      mediaFile?: File;
      mediaType: "image" | "video";
      oldMediaUrl?: string;
    }
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      let mediaUrl = data.oldMediaUrl;

      // If new media file is provided, upload it and delete old one
      if (data.mediaFile) {
        mediaUrl = await uploadMedia(data.mediaFile, productId);
        if (data.oldMediaUrl) {
          await deleteMedia(data.oldMediaUrl);
        }
      }

      // Update offer in Firestore
      const offerRef = doc(db, "offers", offerId);
      await updateDoc(offerRef, {
        name: data.name,
        description: data.description,
        mediaUrl,
        mediaType: data.mediaType,
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
      toast.success("Offer updated");
    } catch (error) {
      console.error("Error updating offer:", error);
      dispatch(setLoading(false));

      let errorMessage = "Failed to update offer";
      if (error instanceof Error) {
        if (
          error.message.includes("permission-denied") ||
          error.message.includes("Missing or insufficient permissions")
        ) {
          errorMessage =
            "Permission denied. Please ensure Firestore and Storage rules are set up correctly.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Delete offer
export const deleteOffer =
  (offerId: string, mediaUrl: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Delete media from storage
      await deleteMedia(mediaUrl);

      // Delete offer from Firestore
      const offerRef = doc(db, "offers", offerId);
      await deleteDoc(offerRef);

      dispatch(deleteOfferFromState(offerId));
      dispatch(setLoading(false));
      toast.success("Offer deleted");
    } catch (error) {
      console.error("Error deleting offer:", error);
      dispatch(setLoading(false));
      const message =
        error instanceof Error ? error.message : "Failed to delete offer";
      toast.error(message);
      dispatch(setError(message));
      throw error;
    }
  };
