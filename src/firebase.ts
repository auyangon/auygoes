// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDMaoB6mOKYJOkDGwCmliz0azqtJifbwpY",
  authDomain: "auy-portal-v2.firebaseapp.com",
  databaseURL: "https://auy-portal-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auy-portal-v2",
  storageBucket: "auy-portal-v2.firebasestorage.app",
  messagingSenderId: "991458712278",
  appId: "1:991458712278:web:244e8c21cf272365ff8777"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
