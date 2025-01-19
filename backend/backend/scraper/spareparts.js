import puppeteer from 'puppeteer';
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

// Predefined product information
const productInfo = {
  'ball-valve-20m-20f-no-handle': {
    suits: 'NG, PG, RC, WF, WL, WX, YC, YCA, YCR',
    productDetails: 'Ball valve only (no handle)\n3/4" BSP\nSuits:\nNoodle Cooker/Rice Roll Steamer and Pasta Cooker\nTraditional Wok/Waterless and Compact Waterless Wok\nStockpot Boiler\nYum Cha Steamer\nAuto Refill Yum Cha Steamer and Auto Refill Rice Roll Steamer\nWeight 0.3kg'
  },
  'ball-valve-3-4-f-f-dual-stem': {
    suits: 'WY',
    productDetails: 'Gas Valve 3/4"F x F\nsuits WY\nWeight 0.3kg'
  },
  'ball-valve-30fx30f': {
    suits: 'WY',
    productDetails: 'Ball Valve 30Fx30F for Waterless Wok'
  },
  'ball-valve-brass-1-2-bsp': {
    suits: 'BCH, CS, GTS, RS',
    productDetails: 'Ball Valve Brass 1/2" BSP\nSuits Professional Series Equipment'
  },
  'ball-valve-hex-shaft-3-4': {
    suits: 'WY',
    productDetails: 'Ball Valve with Hex Shaft 3/4" for Waterless Wok'
  },
  'assy-burner-fv-lpg': {
    suits: 'FV',
    productDetails: 'Assembly Burner for FV Series (LPG)\nComplete burner assembly for Fryer'
  },
  'burner-boiler-4-base': {
    suits: 'BCH',
    productDetails: 'Burner Base for Boiler Series\nSuits Professional Series Equipment'
  },
  'r4-burner-hood': {
    suits: 'RS',
    productDetails: 'R4 Burner Hood for RS Series Ovens'
  },
  'burner-chimney-24-jet-nat': {
    suits: 'CS, RS',
    productDetails: 'Burner Chimney 24 Jet Natural Gas\nSuits Professional Series Cooktops and Ovens'
  },
  'adjustable-leg-370mm-suit-wx-series': {
    suits: 'WX',
    productDetails: 'Adjustable Leg 370mm\nSpecifically designed for WX Series equipment'
  },
  'adjustable-leg-stainless-steel-750mm-suit-wz-series': {
    suits: 'WZ',
    productDetails: 'Adjustable Leg Stainless Steel 750mm\nSpecifically designed for WZ Series equipment'
  },
  'ball-valve-20m-20f-includes-handle': {
    suits: 'NG, PG, RC, WF, WL, WX, YC, YCA, YCR',
    productDetails: 'Ball valve with handle included\n3/4" BSP\nSuits multiple series equipment'
  }
};

// Product URLs
const productUrls = [
  'https://luus.com.au/product/ball-valve-20m-20f-no-handle/',
  'https://luus.com.au/product/ball-valve-3-4-f-f-dual-stem/',
  'https://luus.com.au/product/ball-valve-30fx30f/',
  'https://luus.com.au/product/ball-valve-brass-1-2-bsp/',
  'https://luus.com.au/product/ball-valve-hex-shaft-3-4/',
  'https://luus.com.au/product/assy-burner-fv-lpg/',
  'https://luus.com.au/product/burner-boiler-4-base/',
  'https://luus.com.au/product/r4-burner-hood/',
  'https://luus.com.au/product/burner-chimney-24-jet-nat/',
  'https://luus.com.au/product/adjustable-leg-370mm-suit-wx-series/',
  'https://luus.com.au/product/adjustable-leg-stainless-steel-750mm-suit-wz-series/',
  'https://luus.com.au/product/ball-valve-20m-20f-includes-handle/'
];

async function scrapeProductPage(browser, url) {
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log(`Navigating to: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    const productData = await page.evaluate(() => {
      const name = document.querySelector('h1.product_title')?.textContent.trim();
      const priceElement = document.querySelector('.price .woocommerce-Price-amount');
      const price = priceElement ? priceElement.textContent.trim() : '';
      const imageUrl = document.querySelector('.woocommerce-product-gallery__image img')?.src;
      const sku = document.querySelector('.sku')?.textContent.trim();

      return {
        partId: sku,
        name,
        price,
        imageUrl,
        
      };
    });

    // Get the slug from the URL to match with predefined data
    const slug = url.split('/').filter(Boolean).pop();
    const predefinedData = productInfo[slug] || { suits: '', productDetails: '' };

    // Combine scraped and predefined data
    return {
      ...productData,
      suits: predefinedData.suits,
      productDetails: predefinedData.productDetails
    };

  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  } finally {
    await page.close();
  }
}

async function storeInFirestore(productData) {
  if (!productData?.partId) {
    console.error('No partId found in product data');
    return;
  }

  try {
    const docRef = db.collection('spare_parts').doc(productData.partId);
    await docRef.set(productData);
    console.log(`Successfully stored product with partId: ${productData.partId} in Firestore`);
    console.log('Stored data:', {
      partId: productData.partId,
      name: productData.name,
      suits: productData.suits,
      productDetails: productData.productDetails
    });
  } catch (error) {
    console.error('Error storing data in Firestore:', error);
  }
}

async function main() {
  console.log('Starting product data scraper...');
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  try {
    // Process URLs in batches of 3 to avoid overwhelming the server
    const batchSize = 3;
    for (let i = 0; i < productUrls.length; i += batchSize) {
      const batch = productUrls.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(productUrls.length/batchSize)}`);
      
      const productPromises = batch.map(url => scrapeProductPage(browser, url));
      const products = await Promise.all(productPromises);
      
      // Store batch results
      for (const product of products) {
        if (product) {
          await storeInFirestore(product);
        }
      }

      // Add a small delay between batches
      if (i + batchSize < productUrls.length) {
        console.log('Waiting before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('All products processed successfully.');
  } catch (error) {
    console.error('An error occurred during the process:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

main().catch(console.error);