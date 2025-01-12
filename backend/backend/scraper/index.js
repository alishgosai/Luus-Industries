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
  storageBucket: "luus-industries.firebasestorage.app/Products"
});

const db = getFirestore(app);
const storage = getStorage(app);
const bucket = storage.bucket();

function generateProductId(model) {
  return `PROD_${model.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
}

async function downloadImage(url, localPath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  await fs.writeFile(localPath, buffer);
}

async function uploadImageToFirebase(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: 'image/jpeg',
    },
  });
  await fs.unlink(localPath);
  return bucket.file(storagePath).publicUrl();
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

    await page.screenshot({ path: 'debug_screenshot.png', fullPage: true });
    const pageContent = await page.content();
    await fs.writeFile('debug_page_content.html', pageContent);

    console.log('Saved debug screenshot and page content');

    const productData = await page.evaluate(() => {
      const products = [];
      const productElements = document.querySelectorAll('.lu-product-list-item');

      productElements.forEach((element, index) => {
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

        let imageUrl = '';
        let imageSrcset = '';

        const imageElement = element.querySelector('.lu-product-list-item__image img');
        if (imageElement) {
          imageUrl = imageElement.src || imageElement.dataset.src || '';
          imageSrcset = imageElement.srcset || imageElement.dataset.srcset || '';
        }

        if (!imageUrl && !imageSrcset) {
          const pictureElement = element.querySelector('.lu-product-list-item__image picture');
          if (pictureElement) {
            const sourceElement = pictureElement.querySelector('source');
            if (sourceElement) {
              imageSrcset = sourceElement.srcset || sourceElement.dataset.srcset || '';
            }
            const imgElement = pictureElement.querySelector('img');
            if (imgElement) {
              imageUrl = imgElement.src || imgElement.dataset.src || '';
            }
          }
        }

        products.push({
          model,
          name,
          description,
          specifications: specs,
          category: 'Asian',
          subcategory: 'Fo San Woks',
          scrapedAt: new Date().toISOString(),
          imageUrl,
          imageSrcset
        });
      });

      return products;
    });

    console.log(`Extracted ${productData.length} products`);

    for (const product of productData) {
      if (product.model) {
        const productId = generateProductId(product.model);
        product.product_id = productId;


        // Convert the product object to a plain JavaScript object
        const productObject = {
          product_id: productId,
          model: product.model,
          name: product.name,
          description: product.description,
          specifications: product.specifications,
          category: product.category,
          subcategory: product.subcategory,
          scrapedAt: product.scrapedAt
        };

        const docRef = db.collection('products').doc(productId);
        await docRef.set(productObject);
        console.log(`Successfully stored product data for ${product.model} in Firestore with product_id: ${productId}`);
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

    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`Product ID: ${data.product_id}`);
      console.log(`Model: ${data.model}`);
      console.log(`Document ID: ${doc.id}`);
      console.log(`Stored Image URL: ${data.storedImageUrl || 'N/A'}`);
      console.log('---');

      if (doc.id !== data.product_id || generateProductId(data.model) !== data.product_id) {
        mismatchFound = true;
        console.warn(`Warning: Mismatch found for document ${doc.id}`);
        console.warn(`Document ID: ${doc.id}, Product ID: ${data.product_id}, Generated Product ID: ${generateProductId(data.model)}`);
      }
    });

    if (!mismatchFound) {
      console.log('All products have matching product_id, document ID, and generated product ID fields.');
    } else {
      console.warn('Mismatches found. Please review and correct the data inconsistencies.');
    }

    console.log('Database consistency check complete.');
  } catch (error) {
    console.error('Error checking Firestore consistency:', error);
  }
}

async function main() {
  console.log('Starting Fo San Woks scraper with image storage...');
  await scrapeWokPage();
  console.log('Scraping complete');

  console.log('Starting Firestore consistency check...');
  await checkFirestoreConsistency();
  console.log('Process complete');
}

main().catch(console.error);

