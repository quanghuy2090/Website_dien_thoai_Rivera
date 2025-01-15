// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

export const auth = firebase.auth();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider