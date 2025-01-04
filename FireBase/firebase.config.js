import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Initialize Auth with AsyncStorage persistence
let auth;
if (global.auth) {
  auth = global.auth;
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  global.auth = auth;
}

export { app, auth };

