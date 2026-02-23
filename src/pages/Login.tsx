import { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'popup', // Use popup – simpler!
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false, // Do not redirect after sign-in
  },
};

export function Login() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver();
  }, []);

  if (isSignedIn) {
    return null; // Already signed in, App.tsx will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-light text-white mb-2 text-center">AUY Student Portal</h1>
        <p className="text-white/70 text-center mb-8">Sign in with your university email</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
      </div>
    </div>
  );
}