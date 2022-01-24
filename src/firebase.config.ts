// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD46J6nYOzqawB1eUFP7cNmwMmWjQdzryk",
  authDomain: "house-marketplace-app-cd88a.firebaseapp.com",
  projectId: "house-marketplace-app-cd88a",
  storageBucket: "house-marketplace-app-cd88a.appspot.com",
  messagingSenderId: "1037420900812",
  appId: "1:1037420900812:web:c7744930362a4e8ec02d69",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore();
