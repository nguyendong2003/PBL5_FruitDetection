import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAks5OOJ_VcLMIhjSr81yVs0GpwZgTeM_E",
  authDomain: "fruit-detection-4af07.firebaseapp.com",
  projectId: "fruit-detection-4af07",
  storageBucket: "fruit-detection-4af07.appspot.com",
  messagingSenderId: "680644650070",
  appId: "1:680644650070:web:30d1cb2840d740fd7a47f7",
  measurementId: "G-09T4VHS179"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);