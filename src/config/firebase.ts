// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2n2N-WB4KWoNbPtZdVj9piujqMn0WeCY",
  authDomain: "lordshubgaming.firebaseapp.com",
  databaseURL: "https://lordshubgaming-default-rtdb.firebaseio.com", // Add your Realtime Database URL
  projectId: "lordshubgaming",
  storageBucket: "lordshubgaming.firebasestorage.app",
  messagingSenderId: "332774440952",
  appId: "1:332774440952:web:a58e327aeb2f01009b200d",
  measurementId: "G-GSYS846JM0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

export default app;
