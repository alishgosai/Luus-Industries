import puppeteer from 'puppeteer';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccountContent = await fs.readFile(serviceAccountPath, 'utf8');
const serviceAccount = JSON.parse(serviceAccountContent);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "luus-industries.firebasestorage.app"
});

const db = getFirestore(app);
const storage = getStorage(app);
const bucket = storage.bucket();

// Mapping of product models to their image URLs
const productImageUrls = {
  'WV-1A': 'https://luus.com.au/wp-content/uploads/2021/01/WV1A-768x768.jpg',
  'WV-1A1P': 'https://luus.com.au/wp-content/uploads/2021/03/WV1A1P-768x768.jpg',
  'WV-1P1A': 'https://luus.com.au/wp-content/uploads/2021/03/WV1P1A-768x768.jpg',
  'WV-2A': 'https://luus.com.au/wp-content/uploads/2021/03/WV2A-768x768.jpg',
  'WV-1A1P1A': 'https://luus.com.au/wp-content/uploads/2021/04/WV1A1P1A-768x768.jpg',
  'WV-1A2P1A': 'https://luus.com.au/wp-content/uploads/2022/01/WV1A2P1A-768x768.jpg'
};

function generateProductId(model) {
  return `PROD_${model.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
}

async function downloadImage(url) {
  try {
    console.log(`Downloading image from ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.buffer();
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    throw error;
  }
}

async function uploadImageToFirebase(buffer, storagePath) {
  try {
    console.log(`Attempting to upload image to ${storagePath}`);
    
    const file = bucket.file(storagePath);
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
      },
    });
    
    console.log(`Image uploaded successfully to ${storagePath}`);
    
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    
    console.log(`Signed URL generated: ${signedUrl}`);
    return signedUrl;
  } catch (error) {
    console.error(`Error uploading image to Firebase:`, error);
    if (error.code === 'storage/unauthorized') {
      console.error('Firebase Storage permissions error. Check your Storage rules.');
    }
    throw error;
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function scrapeWokPage() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-http2',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    timeout: 60000
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0'
    });

    console.log('Navigating to Fo San Woks page...');
    
    await page.goto('https://luus.com.au/range/asian/fo-san-woks/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('Page loaded, waiting for content...');

    await page.waitForSelector('.lu-product-list-item', { timeout: 60000 });

    console.log('Product list loaded, extracting content...');

    await autoScroll(page);

    const productData = await page.evaluate(() => {
      const products = [];
      const productElements = document.querySelectorAll('.lu-product-list-item');

      productElements.forEach((element) => {
        const titleElement = element.querySelector('h2');
        const title = titleElement ? titleElement.textContent.trim() : '';
        const [model, ...nameParts] = title.split(' ');
        const name = nameParts.join(' ');

        const description = element.querySelector('.lu-product-list-item__copy p')?.textContent?.trim() || '';

        const specs = {};
        element.querySelectorAll('.lu-product-list-item__specs--row').forEach(row => {
          const key = row.querySelector('.lu-product-list-item__specs--column:first-child')?.textContent?.trim();
          const value = row.querySelector('.lu-product-list-item__specs--column:last-child')?.textContent?.trim();
          if (key && value) {
            specs[key] = value;
          }
        });

        products.push({
          model,
          name: `${model} ${name}`,
          description,
          specifications: specs,
          category: 'Asian',
          subcategory: 'Fo San Woks',
          scrapedAt: new Date().toISOString()
        });
      });

      return products;
    });

    console.log(`Extracted ${productData.length} products`);

    for (const product of productData) {
      if (product.model) {
        const productId = generateProductId(product.model);
        product.product_id = productId;

        // Get image URL from our mapping
        const imageUrl = productImageUrls[product.model];
        if (imageUrl) {
          try {
            const imageBuffer = await downloadImage(imageUrl);
            const storagePath = `products/${productId}.jpg`;
            const signedUrl = await uploadImageToFirebase(imageBuffer, storagePath);
            product.storedImageUrl = signedUrl;
            console.log(`Stored image URL for ${productId}: ${signedUrl}`);
          } catch (error) {
            console.error(`Error processing image for product ${productId}:`, error);
            product.storedImageUrl = null;
          }
        } else {
          console.log(`No image URL found for product ${product.model}`);
          product.storedImageUrl = null;
        }

        const productObject = {
          product_id: productId,
          model: product.model,
          name: product.name,
          description: product.description,
          specifications: product.specifications,
          category: product.category,
          subcategory: product.subcategory,
          scrapedAt: product.scrapedAt,
          storedImageUrl: product.storedImageUrl
        };

        try {
          const docRef = db.collection('products').doc(productId);
          await docRef.set(productObject);
          console.log(`Successfully stored product data for ${product.model} in Firestore with product_id: ${productId}`);
        } catch (error) {
          console.error(`Error storing product data for ${product.model}:`, error);
        }
      } else {
        console.warn('Skipping product with empty model:', product);
      }
    }

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log('Starting Fo San Woks scraper with image storage...');
  try {
    await scrapeWokPage();
    console.log('Scraping complete');
  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
  }
}

main().catch(console.error);

