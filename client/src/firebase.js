// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "abdulmainrealestate.firebaseapp.com",
  projectId: "abdulmainrealestate",
  storageBucket: "abdulmainrealestate.appspot.com",
  messagingSenderId: "264361362679",
  appId: "1:264361362679:web:35383c6e534e0ad0d9bff2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);