import { getWarrantyProductsData, getWarrantyProductData } from '../models/Product.js';

export const getWarrantyProducts = (req, res) => {
  console.log('Warranty products requested');
  try {
    const warrantyProducts = getWarrantyProductsData();
    res.json(warrantyProducts);
  } catch (error) {
    console.error('Error in get-warranty-products:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getWarrantyProductById = (req, res) => {
  console.log('Warranty product requested by ID:', req.params.id);
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      console.error('Invalid product ID:', req.params.id);
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product = getWarrantyProductData(productId);
    if (product) {
      console.log('Product found:', product);
      res.json(product);
    } else {
      console.error('Product not found for ID:', productId);
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error in get-warranty-product-by-id:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const handleQRCodeScan = (req, res) => {
  console.log('QR code scan received:', req.body.qrData);
  try {
    const productId = parseInt(req.body.qrData);
    if (isNaN(productId)) {
      console.error('Invalid QR code data:', req.body.qrData);
      return res.status(400).json({ success: false, message: 'Invalid QR code data' });
    }
    const product = getWarrantyProductData(productId);
    if (product) {
      console.log('Product found for QR code:', product);
      res.json({ success: true, product });
    } else {
      console.error('Product not found for QR code:', productId);
      res.status(404).json({ success: false, message: 'Product not found for this QR code' });
    }
  } catch (error) {
    console.error('Error in handle-qr-code-scan:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
