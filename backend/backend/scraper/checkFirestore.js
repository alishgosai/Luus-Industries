import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccountContent = await fs.readFile(serviceAccountPath, 'utf8');
const serviceAccount = JSON.parse(serviceAccountContent);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function checkFirestoreConsistency() {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      console.log('No products found in the database.');
      return;
    }

    console.log('Checking products in Firestore for consistency:');
    let mismatchFound = false;
    let totalProducts = 0;
    let consistentProducts = 0;

    snapshot.forEach(doc => {
      totalProducts++;
      const data = doc.data();
      console.log(`\nDocument ID: ${doc.id}`);
      console.log(`Model: ${data.model}`);
      console.log(`Product ID: ${data.product_id}`);

      if (doc.id !== data.model || doc.id !== data.product_id || data.model !== data.product_id) {
        mismatchFound = true;
        console.warn('Warning: Mismatch found for this document');
        console.warn(`Document ID: ${doc.id}, Model: ${data.model}, Product ID: ${data.product_id}`);
      } else {
        consistentProducts++;
        console.log('Status: Consistent');
      }
      console.log('---');
    });

    console.log('\nDatabase consistency check summary:');
    console.log(`Total products checked: ${totalProducts}`);
    console.log(`Consistent products: ${consistentProducts}`);
    console.log(`Inconsistent products: ${totalProducts - consistentProducts}`);

    if (!mismatchFound) {
      console.log('All products have matching model, product_id, and document ID fields.');
    } else {
      console.warn('Mismatches found. Please review and correct the data inconsistencies.');
    }

    console.log('Database consistency check complete.');
  } catch (error) {
    console.error('Error checking Firestore consistency:', error);
  }
}

console.log('Starting Firestore consistency check...');
await checkFirestoreConsistency();
console.log('Process complete');

