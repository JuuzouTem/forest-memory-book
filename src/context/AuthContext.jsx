import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { Trees } from 'lucide-react'; // Yükleme ekranı ikonu için

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Kullanıcı giriş yaptıysa Firestore'dan profilini çekmeyi dene
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile({ coupleId: null });
          }
        } catch (error) {
          console.error("Profil çekme hatası:", error);
          // Hata olsa bile uygulamayı kilitleme, kodu sorması için boş profil ayarla
          setUserProfile({ coupleId: null });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      // Her halükarda yükleme ekranını kapat (Beyaz ekranı engeller)
      setLoading(false);
    });

    return unsubscribe;
  },[]);

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const saveCoupleId = async (code) => {
    if (!currentUser) return;
    try {
      await setDoc(doc(db, "users", currentUser.uid), { coupleId: code }, { merge: true });
      setUserProfile({ ...userProfile, coupleId: code });
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