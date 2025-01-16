import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTUXgEQxP6WQc-M-D1Txvotz9wBB5_kV8",
  authDomain: "luus-industries.firebaseapp.com",
  databaseURL: "https://luus-industries-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "luus-industries",
  storageBucket: "gs://luus-industries.firebasestorage.app", // Make sure this is correct
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

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage with explicit bucket URL
const storage = getStorage(app, `gs://${firebaseConfig.storageBucket}`);

export { app, auth, db, storage };

