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