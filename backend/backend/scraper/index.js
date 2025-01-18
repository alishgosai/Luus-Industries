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
  'PC-45' : 'https://luus.com.au/wp-content/uploads/2016/09/PC45-768x768.jpg',
  'PC-60' : 'https://luus.com.au/wp-content/uploads/2016/09/PC60-768x768.jpg'
};

function generateProductId(model) {
  return `PROD_${model.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
}

async function downloadFile(url) {
  try {
    console.log(`Downloading file from ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.buffer();
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error);
    throw error;
  }
}

async function uploadFileToFirebase(buffer, storagePath, contentType) {
  try {
    console.log(`Attempting to upload file to ${storagePath}`);
    
    const file = bucket.file(storagePath);
    await file.save(buffer, {
      metadata: {
        contentType: contentType,
      },
    });
    
    console.log(`File uploaded successfully to ${storagePath}`);
    
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    
    console.log(`Signed URL generated: ${signedUrl}`);
    return signedUrl;
  } catch (error) {
    console.error(`Error uploading file to Firebase:`, error);
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
  
  // Wait for any dynamic content to load after scrolling
  await page.waitForSelector('.lu-product-list-item', { timeout: 10000 });
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

    console.log('Navigating to pasta cookers page...');
    
    await page.goto('https://luus.com.au/range/professional/pasta-cookers/', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('Page loaded, waiting for content...');

    // Wait for the product list to load
    await page.waitForSelector('.lu-product-list-item', { timeout: 60000 });

    console.log('Product list loaded, extracting content...');

    // Scroll to load all content
    await autoScroll(page);
    console.log('Finished scrolling, waiting for content to settle...');

    const productData = await page.evaluate(() => {
      const products = [];
      const productElements = document.querySelectorAll('.lu-product-list-item');

      console.log(`Found ${productElements.length} product elements`);

      productElements.forEach((element, index) => {
        const titleElement = element.querySelector('h2');
        const title = titleElement ? titleElement.textContent.trim() : '';
        const modelMap = {
          '450': 'PC-45',
          '600': 'PC-60'
        };
        const modelMatch = title.match(/PC (\d+)/);
        const model = modelMatch ? modelMap[modelMatch[1]] || '' : '';
        const name = title;

        const description = element.querySelector('.lu-product-list-item__copy p')?.textContent?.trim() || '';

        const specs = {};
        element.querySelectorAll('.lu-product-list-item__specs--row').forEach(row => {
          const key = row.querySelector('.lu-product-list-item__specs--column:first-child')?.textContent?.trim();
          const value = row.querySelector('.lu-product-list-item__specs--column:last-child')?.textContent?.trim();
          if (key && value) {
            specs[key] = value;
          }
        });

        const specificationsPdfLink = element.querySelector('a[href$=".pdf"]')?.href;
        const cadDrawingsLink = element.querySelector('a[href$=".dwg"]')?.href;

        console.log(`Extracted product ${index + 1}: ${model}`);

        products.push({
          model,
          name,
          description,
          specifications: specs,
          category: 'Professional',
          subcategory: 'pasta cookers',
          scrapedAt: new Date().toISOString(),
          specificationsPdfLink,
          cadDrawingsLink
        });
      });

      return products;
    });

    console.log(`Extracted ${productData.length} products`);

    for (const product of productData) {
      if (product.model) {
        console.log(`Processing product: ${product.model}`);
        const productId = generateProductId(product.model);
        product.product_id = productId;

        // Get image URL from our mapping
        const imageUrl = productImageUrls[product.model];
        if (imageUrl) {
          try {
            const imageBuffer = await downloadFile(imageUrl);
            const storagePath = `products/${productId}.jpg`;
            const signedUrl = await uploadFileToFirebase(imageBuffer, storagePath, 'image/jpeg');
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

        // Download and store specifications PDF
        if (product.specificationsPdfLink) {
          try {
            const pdfBuffer = await downloadFile(product.specificationsPdfLink);
            const pdfStoragePath = `specifications/${productId}_specifications.pdf`;
            const pdfSignedUrl = await uploadFileToFirebase(pdfBuffer, pdfStoragePath, 'application/pdf');
            product.storedSpecificationsPdfUrl = pdfSignedUrl;
            console.log(`Stored specifications PDF URL for ${productId}: ${pdfSignedUrl}`);
          } catch (error) {
            console.error(`Error processing specifications PDF for product ${productId}:`, error);
            product.storedSpecificationsPdfUrl = null;
          }
        }

        // Download and store CAD drawings
        if (product.cadDrawingsLink) {
          try {
            const dwgBuffer = await downloadFile(product.cadDrawingsLink);
            const dwgStoragePath = `cad_drawings/${productId}_cad.dwg`;
            const dwgSignedUrl = await uploadFileToFirebase(dwgBuffer, dwgStoragePath, 'application/acad');
            product.storedCadDrawingsUrl = dwgSignedUrl;
            console.log(`Stored CAD drawings URL for ${productId}: ${dwgSignedUrl}`);
          } catch (error) {
            console.error(`Error processing CAD drawings for product ${productId}:`, error);
            product.storedCadDrawingsUrl = null;
          }
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
          storedImageUrl: product.storedImageUrl,
          storedSpecificationsPdfUrl: product.storedSpecificationsPdfUrl,
          storedCadDrawingsUrl: product.storedCadDrawingsUrl
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
  console.log('Starting compact pasta-cookers scraper with image, PDF, and CAD file storage...');
  try {
    await scrapeWokPage();
    console.log('Scraping complete');
  } catch (error) {
    console.error('An error occurred during the scraping process:', error);
  }
}

main().catch(console.error);

