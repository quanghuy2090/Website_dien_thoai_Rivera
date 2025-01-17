// src/firebase.js
import { initializeApp } from 'firebase/app';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSit7BrZElIP-t2uxgnej6oKrtEQIBCRs",
  authDomain: "website-rivera.firebaseapp.com",
  projectId: "website-rivera",
  storageBucket: "website-rivera.firebasestorage.app",
  messagingSenderId: "595249682170",
  appId: "1:595249682170:web:77d4f8fcf20d57e0289b43",
  measurementId: "G-7JNM4JPW66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase services
export const auth = getAuth(app);
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();