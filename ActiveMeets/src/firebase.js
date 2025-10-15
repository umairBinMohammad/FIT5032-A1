// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZohBzQ6SBeCKy2lrSQWIFoI0nJkqJ-G8",
  authDomain: "activemeets-a2e25.firebaseapp.com",
  projectId: "activemeets-a2e25",
  storageBucket: "activemeets-a2e25.firebasestorage.app",
  messagingSenderId: "491773480337",
  appId: "1:491773480337:web:d34df6189c806b79e79e30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Auth service
export const auth = getAuth(app);