import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔹 Replace with your Firebase config
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwWg9DjHPit9189KX22xMBQqs_UD9rYUU",
    authDomain: "inno91-7ab6e.firebaseapp.com",
    projectId: "inno91-7ab6e",
    storageBucket: "inno91-7ab6e.firebasestorage.app",
    messagingSenderId: "887268068340",
    appId: "1:887268068340:web:05dd7a36263e56adeb87a1"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const fireStore = getFirestore(app);
export const storage = getStorage(app);
