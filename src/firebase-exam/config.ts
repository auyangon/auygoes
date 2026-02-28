// src/firebase-exam/config.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// EXAM SYSTEM FIREBASE - Your separate account for free tier
const examFirebaseConfig = {
  apiKey: "AIzaSyB7pregcD_cn6nBXHq8jcWWK3FwFf-Tc-0",
  authDomain: "auy-exam.firebaseapp.com",
  databaseURL: "https://auy-exam-default-rtdb.firebaseio.com",
  projectId: "auy-exam",
  storageBucket: "auy-exam.firebasestorage.app",
  messagingSenderId: "991458712278",
  appId: "1:991458712278:web:244e8c21cf272365ff8777"
};

// Initialize Exam Firebase (separate instance)
export const examApp = initializeApp(examFirebaseConfig, 'exam');
export const examDatabase = getDatabase(examApp);
export const examAuth = getAuth(examApp);

// Helper to convert email to Firebase key
export const emailToFirebaseKey = (email: string): string => {
  if (!email) return '';
  return email.replace(/\./g, ',,,');
};
