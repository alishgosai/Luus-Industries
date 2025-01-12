import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

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

// Function to retrieve product data from Firebase
async function getProductData(productId) {
  try {
    const docRef = db.collection('products').doc(productId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log(`No product found with ID: ${productId}`);
      return null;
    }
    
    return doc.data();
  } catch (error) {
    console.error('Error retrieving product data:', error);
    return null;
  }
}

async function generateQRCode(product, qrDir, options = {}) {
  const productId = product.product_id || product.model;
  
  // Create QR code data object with product_id
  const qrData = JSON.stringify({ product_id: productId });

  const qrCodePath = path.join(qrDir, `${productId}.jpg`);
  
  // Generate QR code as PNG
  const qrCodeBuffer = await QRCode.toBuffer(qrData, {
    errorCorrectionLevel: 'H',
    width: 300,
    ...options
  });

  // Convert PNG to JPG
  await sharp(qrCodeBuffer)
    .jpeg()
    .toFile(qrCodePath);

  console.log(`Generated QR code for product ${productId} with data:`, qrData);

  // Test retrieving data using the product_id
  console.log('Testing data retrieval for generated QR code...');
  const retrievedData = await getProductData(productId);
  if (retrievedData) {
    console.log(`Successfully retrieved data for product ${productId}`);
    console.log('Product data:', JSON.stringify(retrievedData, null, 2));
  } else {
    console.log(`Failed to retrieve data for product ${productId}`);
  }

  return qrCodePath;
}

async function generateQRCodes(productIds = null) {
  try {
    const qrDir = path.join(__dirname, 'qr_codes');
    await fs.mkdir(qrDir, { recursive: true });

    let query = db.collection('products');
    if (productIds && productIds.length > 0) {
      query = query.where('product_id', 'in', productIds);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      console.log('No matching products found in the database.');
      return;
    }

    for (const doc of snapshot.docs) {
      const product = doc.data();
      const qrCodePath = await generateQRCode(product, qrDir);

      // Update the product document with the QR code path
      await doc.ref.update({
        qrCodePath: qrCodePath,
        qrCodeUpdatedAt: new Date().toISOString()
      });
      console.log(`Updated product ${product.product_id} with QR code path`);
    }

    console.log('QR code generation complete.');
  } catch (error) {
    console.error('Error generating QR codes:', error);
  }
}

// Example usage
const productIdsToUpdate = process.argv.slice(2);
console.log('Starting QR code generation...');
await generateQRCodes(productIdsToUpdate.length > 0 ? productIdsToUpdate : null);
console.log('Process complete');

