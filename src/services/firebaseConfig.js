import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// YENİ: getFirestore yerine çevrimdışı destekli modülleri ekledik
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// TODO: Kendi Firebase bilgilerini buraya tekrar koymayı unutma
const firebaseConfig = {
  apiKey: "AIzaSyD-PkcCf8yEQXdhXuXNN4XbXCMh4z4Fq6M",
  authDomain: "forest-memory-book.firebaseapp.com",
  projectId: "forest-memory-book",
  storageBucket: "forest-memory-book.firebasestorage.app",
  messagingSenderId: "184063545597",
  appId: "1:184063545597:web:a507c879be606318086e94"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// YENİ: Çevrimdışı (Orman) modu ve sıfır gecikme için yerel önbellek aktifleştirildi
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
});