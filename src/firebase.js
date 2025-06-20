// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgCNMjsBtIbghefyHVF2kS-Cr1FgRxy3E",
  authDomain: "talksure-da15a.firebaseapp.com",
  projectId: "talksure-da15a",
  storageBucket: "talksure-da15a.firebasestorage.com",
  messagingSenderId: "341059130864",
  appId: "1:341059130864:web:6459c3939e007cd092f935",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
