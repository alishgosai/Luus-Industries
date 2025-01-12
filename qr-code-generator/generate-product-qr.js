import QRCode from 'qrcode';

// Sample product data
const productData = {
  id: 'PROD123',
  name: 'Wireless Bluetooth Headphones',
  price: 79.99,
  category: 'Electronics',
  description: 'High-quality wireless headphones with noise cancellation',
  sku: 'WBH-001-BLK'
};

// Convert product data to JSON string
const productDataString = JSON.stringify(productData);

// Generate QR code
try {
  const qrCodeDataUrl = await QRCode.toDataURL(productDataString);
  console.log('QR Code generated successfully!');
  console.log('Data URL:');
  console.log(qrCodeDataUrl);
  
  // You can now use this data URL to display the QR code in an HTML img tag or save it as an image file
} catch (error) {
  console.error('Error generating QR code:', error);
}