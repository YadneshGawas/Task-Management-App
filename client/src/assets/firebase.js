/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "taskmanager-1923e.firebaseapp.com",
  projectId: "taskmanager-1923e",
  storageBucket: "taskmanager-1923e.appspot.com",
  messagingSenderId: "149330669107",
  appId: "1:149330669107:web:3560a16cc2db29593e7d46",
  measurementId: "G-6J02P57KMJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);