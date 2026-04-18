import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup, signOut, updateProfile // updateProfile eklendi
} from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { Trees } from 'lucide-react';

const AuthContext = createContext();

export function useAuth() { return useContext(AuthContext); }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const docRef = doc(db, "users", user.uid);
        profileUnsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) setUserProfile(docSnap.data());
          else setUserProfile({ coupleId: null });
          setLoading(false);
        }, (error) => {
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
    return () => { unsubscribeAuth(); if (profileUnsubscribe) profileUnsubscribe(); };
  },[]);

  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const registerWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const saveCoupleId = async (code) => {
    if (!currentUser) return;
    await setDoc(doc(db, "users", currentUser.uid), { coupleId: code }, { merge: true });
  };

  // YENİ: Kullanıcı adı güncelleme
  const updateUsername = async (name) => {
    if (currentUser) {
      await updateProfile(currentUser, { displayName: name });
      setCurrentUser({ ...currentUser, displayName: name });
    }
  };

  const value = { currentUser, userProfile, saveCoupleId, updateUsername, loginWithEmail, registerWithEmail, loginWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-sage">
          <Trees className="animate-pulse mb-4" size={48} />
          <span className="font-medium">Ormana giriliyor...</span>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}