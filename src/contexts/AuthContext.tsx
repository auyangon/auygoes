import React, { createContext, useContext, useEffect, useState } from 'react';
<<<<<<< HEAD
import {
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  getRedirectResult
} from 'firebase/auth';
=======
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
<<<<<<< HEAD
  signInWithGoogle: () => Promise<void>;
=======
  signIn: (email: string, password: string) => Promise<void>;
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Listen to auth state changes
=======
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
<<<<<<< HEAD
    return () => unsubscribe();
  }, []);

  // Handle redirect result when user comes back
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // Optionally do something with the user, like create a Firestore record
          console.log('User signed in via redirect', result.user);
        }
      } catch (error) {
        console.error('Redirect sign-in error:', error);
      }
    };
    handleRedirectResult();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // The page will redirect, no need to wait
    } catch (error) {
      console.error('Error initiating redirect sign-in:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
=======
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
      {children}
    </AuthContext.Provider>
  );
}

<<<<<<< HEAD
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
=======
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
  return context;
}