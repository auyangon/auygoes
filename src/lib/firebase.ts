<<<<<<< HEAD
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
=======
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDMaoB6mOKYJOkDGwCmliz0azqtJifbwpY",
  authDomain: "auy-portal-v2.firebaseapp.com",
  databaseURL: "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auy-portal-v2",
  storageBucket: "auy-portal-v2.firebasestorage.app",
  messagingSenderId: "1092101561903",
  appId: "1:1092101561903:web:07abc804196ff95bc2f0da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
>>>>>>> 7e787996e344ec0e38973ffd84b2419f9c179aec
