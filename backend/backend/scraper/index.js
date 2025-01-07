import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';
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
    
    const response = await page.goto('https://luus.com.au/range/asian/fo-san-woks/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    if (!response.ok()) {
      throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`);
    }

    // Wait for any content to load
    await page.waitForSelector('body', { timeout: 60000 });

    console.log('Page loaded, extracting content...');

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
          name,
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
        const docRef = db.collection('products').doc(product.model);
        await docRef.set(product);
        console.log(`Successfully stored product data for ${product.model} in Firestore`);
      } else {
        console.warn('Skipping product with empty model:', product);
      }
    }

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

console.log('Starting Fo San Woks scraper...');
await scrapeWokPage();
console.log('Scraping complete');

