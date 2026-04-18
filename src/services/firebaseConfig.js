import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Kendi Firebase bilgilerini buraya tekrar koymayı unutma
const firebaseConfig = {
  apiKey: "AIzaSyD-PkcCf8yEQXdhXuXNN4XbXCMh4z4Fq6M",
  authDomain: "forest-memory-book.firebaseapp.com",
  projectId: "forest-memory-book",
  storageBucket: "forest-memory-book.firebasestorage.app",
  messagingSenderId: "184063545597",
  appId: "1:184063545597:web:a507c879be606318086e94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Sadece Auth ve Firestore kullanıyoruz
export const auth = getAuth(app);
export const db = getFirestore(app);