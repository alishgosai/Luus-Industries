// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTUXgEQxP6WQc-M-D1Txvotz9wBB5_kV8",
  authDomain: "luus-industries.firebaseapp.com",
  projectId: "luus-industries",
  storageBucket: "luus-industries.firebasestorage.app",
  messagingSenderId: "773731271005",
  appId: "1:773731271005:web:2e77c0d08826f27797e8b4",
  measurementId: "G-M5VTVG31YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);