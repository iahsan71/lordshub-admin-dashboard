import { AppDispatch } from "../index";
import {
  setBots,
  addBot as addBotToState,
  updateBot as updateBotInState,
  deleteBot as deleteBotFromState,
  setLoading,
  setError,
  Bot,
} from "../slices/botsSlice";
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
import { db } from "@/config/firebase";
import { toast } from "react-toastify";

// Real-time listener for all bots
export const subscribeToBots = () => (dispatch: AppDispatch) => {
  const botsRef = collection(db, "bots");
  const q = query(botsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const bots: Bot[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bot[];
      dispatch(setBots(bots));
      dispatch(setLoading(false));
    },
    (error) => {
      console.error("Error fetching bots:", error);
      dispatch(setError("Failed to load bots"));
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

// Generate unique product ID
const generateProductId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BOT${timestamp}${random}`;
};

// Add new bot
export const addBot =
  (data: {
    name: string;
    description: string;
    features: string[];
    price: number;
    type: "war" | "rein" | "kvk" | "farm";
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Generate unique product ID
      const productId = generateProductId();

      // Add bot to Firestore
      const botsRef = collection(db, "bots");
      const docRef = await addDoc(botsRef, {
        productId,
        name: data.name,
        description: data.description,
        features: data.features,
        price: data.price,
        type: data.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
      toast.success("Bot added");
      return docRef.id;
    } catch (error) {
      console.error("Error adding bot:", error);
      dispatch(setLoading(false));

      let errorMessage = "Failed to add bot";
      if (error instanceof Error) {
        if (
          error.message.includes("permission-denied") ||
          error.message.includes("Missing or insufficient permissions")
        ) {
          errorMessage =
            "Permission denied. Please ensure Firestore rules are set up correctly.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Update existing bot
export const updateBot =
  (
    botId: string,
    productId: string,
    data: {
      name: string;
      description: string;
      features: string[];
      price: number;
      type: "war" | "rein" | "kvk" | "farm";
    }
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Update bot in Firestore
      const botRef = doc(db, "bots", botId);
      await updateDoc(botRef, {
        name: data.name,
        description: data.description,
        features: data.features,
        price: data.price,
        type: data.type,
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
      toast.success("Bot updated");
    } catch (error) {
      console.error("Error updating bot:", error);
      dispatch(setLoading(false));

      let errorMessage = "Failed to update bot";
      if (error instanceof Error) {
        if (
          error.message.includes("permission-denied") ||
          error.message.includes("Missing or insufficient permissions")
        ) {
          errorMessage =
            "Permission denied. Please ensure Firestore rules are set up correctly.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Delete bot
export const deleteBot = (botId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    // Delete bot from Firestore
    const botRef = doc(db, "bots", botId);
    await deleteDoc(botRef);

    dispatch(deleteBotFromState(botId));
    dispatch(setLoading(false));
    toast.success("Bot deleted");
  } catch (error) {
    console.error("Error deleting bot:", error);
    dispatch(setLoading(false));
    const message =
      error instanceof Error ? error.message : "Failed to delete bot";
    toast.error(message);
    dispatch(setError(message));
    throw error;
  }
};
