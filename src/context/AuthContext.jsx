import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  },[]);

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // YENİ EKLENDİ: E-posta ile Kayıt Olma
  const registerWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}