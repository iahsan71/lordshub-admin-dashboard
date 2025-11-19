// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2n2N-WB4KWoNbPtZdVj9piujqMn0WeCY",
  authDomain: "lordshubgaming.firebaseapp.com",
  projectId: "lordshubgaming",
  storageBucket: "lordshubgaming.firebasestorage.app",
  messagingSenderId: "332774440952",
  appId: "1:332774440952:web:a58e327aeb2f01009b200d",
  measurementId: "G-GSYS846JM0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
