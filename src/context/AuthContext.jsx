import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore'; // getDoc çıkarıldı, onSnapshot eklendi
import { auth, db } from '../services/firebaseConfig';
import { Trees } from 'lucide-react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const[userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        
        // YENİ: await getDoc beklemesi iptal edildi. onSnapshot ile anında tepki veriyoruz!
        const docRef = doc(db, "users", user.uid);
        profileUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile({ coupleId: null });
          }
          setLoading(false); // Veri gelir gelmez veya önbellekten okunur okunmaz yüklemeyi bitir
        }, (error) => {
          // Eğer reklam engelleyici engellerse 10 saniye beklemez, anında buraya düşer ve sayfayı açar!
          console.warn("Çevrimdışı bağlantı uyarısı (Hızlı geçiş yapıldı):", error.message);
          setUserProfile({ coupleId: null });
          setLoading(false);
        });

      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
        if (profileUnsubscribe) profileUnsubscribe();
      }
    });

    return () => {
      unsubscribeAuth();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  },[]);

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const saveCoupleId = async (code) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), { coupleId: code }, { merge: true });
      // onSnapshot otomatik tetikleneceği için state'i manuel güncellememize gerek yok
    } catch (error) {
      console.error("Kod kaydetme hatası:", error);
      alert("Kod kaydedilirken bir hata oluştu.");
    }
  };

  const value = {
    currentUser,
    userProfile,
    saveCoupleId,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-sage">
          <Trees className="animate-pulse mb-4" size={48} />
          <span className="font-medium">Ormana giriliyor...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}