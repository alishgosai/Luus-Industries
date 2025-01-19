import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Initializing Firebase Admin...');

if (!admin.apps.length) {
  try {
    const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
    const serviceAccountContent = await fs.readFile(serviceAccountPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountContent);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: 'luus-industries.firebasestorage.app'
    });

    console.log('Firebase Admin initialized successfully');
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Client Email:', serviceAccount.client_email);
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    process.exit(1);
  }
}

const db = getFirestore();
const storage = admin.storage();

// Test the database connection
try {
  await db.collection('serviceForms').limit(1).get();
  console.log('Firestore connection successful');
} catch (error) {
  console.error('Firestore connection failed:', error);
}

export { admin, db, storage };
