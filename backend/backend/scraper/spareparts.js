import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Add stealth plugin to bypass security checks
puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccountContent = await fs.readFile(serviceAccountPath, 'utf8');
const serviceAccount = JSON.parse(serviceAccountContent);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "luus-industries.appspot.com"
});

const db = getFirestore(app);
const storage = getStorage(app);
const bucket = storage.bucket();

function generateSparePartId(partNumber) {
  return `SPARE_${partNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
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
      metadata: { contentType: 'image/jpeg' }
    });
    
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    });
    
    return signedUrl;
  } catch (error) {
    console.error(`Error uploading image to Firebase:`, error);
    throw error;
  }
}

async function waitForSecurityCheck(page) {
  try {
    // Wait for security check to complete
    await page.waitForFunction(
      () => !document.title.includes('Checking the site connection security'),
      { timeout: 30000 }
    );
    
    // Use setTimeout instead of waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return true;
  } catch (error) {
    console.error('Security check timeout:', error);
    return false;
  }
}

async function scrapeSparePartsFirstPage() {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({
      headless: false, // Change to false to see what's happening
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });

    page = await browser.newPage();
    
    // Set realistic browser environment
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // Enable JavaScript
    await page.setJavaScriptEnabled(true);
    
    console.log('Navigating to Spare Parts page 1...');
    
    await page.goto('https://luus.com.au/spareparts/page/1/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Handle security check
    const securityCheckPassed = await waitForSecurityCheck(page);
    if (!securityCheckPassed) {
      throw new Error('Failed to pass security check');
    }

    // Wait for the main content to load
    await page.waitForSelector('.product-grid, .products-grid, .product-list', {
      timeout: 30000
    });

    console.log('Page loaded successfully, extracting data...');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-screenshot.png' });

    const sparePartsData = await page.evaluate(() => {
      const spareParts = [];
      const products = document.querySelectorAll('.product-item, .product, .product-list-item');

      products.forEach(product => {
        // Extract part number and name
        const titleEl = product.querySelector('h2, .product-title, .title');
        if (!titleEl) return;

        const titleText = titleEl.textContent.trim();
        const partNumber = titleText.split(' ')[0];
        const name = titleText.substring(partNumber.length).trim();

        // Extract compatibility
        const compatibilityEl = product.querySelector('.compatibility, .specs');
        const compatibility = compatibilityEl ? 
          compatibilityEl.textContent.split(',').map(item => item.trim()).filter(Boolean) : 
          [];

        // Extract image URL
        const imageEl = product.querySelector('img');
        const imageUrl = imageEl ? (imageEl.src || imageEl.dataset.src) : '';

        spareParts.push({
          partNumber,
          name,
          compatibility,
          imageUrl
        });
      });

      return spareParts;
    });

    console.log(`Found ${sparePartsData.length} spare parts`);

    // Store data in Firebase
    for (const sparePart of sparePartsData) {
      if (!sparePart.partNumber) continue;

      const sparePartId = generateSparePartId(sparePart.partNumber);
      let storedImageUrl = null;

      if (sparePart.imageUrl) {
        try {
          const imageBuffer = await downloadImage(sparePart.imageUrl);
          const storagePath = `spare-parts/${sparePartId}.jpg`;
          storedImageUrl = await uploadImageToFirebase(imageBuffer, storagePath);
        } catch (error) {
          console.error(`Failed to process image for ${sparePartId}:`, error);
        }
      }

      const sparePartObject = {
        spare_part_id: sparePartId,
        partNumber: sparePart.partNumber,
        name: sparePart.name,
        compatibility: sparePart.compatibility,
        imageUrl: storedImageUrl,
        scrapedAt: new Date().toISOString()
      };

      try {
        await db.collection('spare_parts').doc(sparePartId).set(sparePartObject);
        console.log(`Stored spare part: ${sparePart.partNumber}`);
      } catch (error) {
        console.error(`Failed to store ${sparePart.partNumber}:`, error);
      }
    }

    console.log('All spare parts have been processed');

  } catch (error) {
    console.error('Scraping error:', error);
    
    // Save debug information
    if (page) {
      try {
        const debugInfo = await page.evaluate(() => ({
          title: document.title,
          url: window.location.href,
          html: document.documentElement.outerHTML
        }));
        
        await fs.writeFile('debug-info.json', JSON.stringify(debugInfo, null, 2));
        console.log('Debug information saved to debug-info.json');
        
        // Take a screenshot of the error state
        await page.screenshot({ path: 'error-screenshot.png' });
      } catch (debugError) {
        console.error('Failed to save debug information:', debugError);
      }
    }
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function main() {
  console.log('Starting Spare Parts scraper...');
  try {
    await scrapeSparePartsFirstPage();
    console.log('Scraping completed successfully');
  } catch (error) {
    console.error('Main process error:', error);
  }
}

main().catch(console.error);