import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiwo7k1ajJXu2XLhDZUwOvkO9KTehdJnM",
  authDomain: "the-wolf-of-paper-street-f8a30.firebaseapp.com",
  projectId: "the-wolf-of-paper-street-f8a30",
  storageBucket: "the-wolf-of-paper-street-f8a30.firebasestorage.app",
  messagingSenderId: "44051285847",
  appId: "1:44051285847:web:cbbe54a79f803a64cba012",
  measurementId: "G-TWT5GLDH94"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // db for Firestore

export { app, auth, db };  // Export db instead of firestore
