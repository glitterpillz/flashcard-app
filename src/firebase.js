// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXCDuxJqIappzsRU8CzraSfWveSTLKAPk",
  authDomain: "flashcard-app-ac9b9.firebaseapp.com",
  projectId: "flashcard-app-ac9b9",
  storageBucket: "flashcard-app-ac9b9.firebasestorage.app",
  messagingSenderId: "504890941016",
  appId: "1:504890941016:web:e137e1c0c87b1d9c20b42d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);