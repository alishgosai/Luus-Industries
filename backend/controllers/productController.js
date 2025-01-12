import { scanAndRegisterProduct, getProductDetails, getUserProducts } from '../models/Product.js';

const ProductController = {
  scanAndRegisterProduct: async (req, res) => {
    console.log('Raw request body:', req.body);
    try {
      const { qrCodeData } = req.body;
      
      if (!qrCodeData) {
        return res.status(400).json({
          success: false,
          error: 'Invalid QR code data. Please try scanning again.',
          scannedCode: req.body.qrCodeData
        });
      }

      const userId = req.user.id;
      console.log('Processing scan request:', { qrCodeData, userId: userId });

      const result = await scanAndRegisterProduct(qrCodeData, userId);
      console.log('Scan and register result:', result);
      
      res.json({ 
        success: true, 
        product: result,
        message: 'Product successfully registered',
        scannedCode: qrCodeData
      });
    } catch (error) {
      console.error('Error in scanAndRegisterProduct:', error);
      let errorMessage = 'An unexpected error occurred';
      let statusCode = 500;

      if (error.message.startsWith('Scanned product does not exist in the database')) {
        errorMessage = `Product not found in the database. Please check the QR code and try again. (Scanned: ${req.body.qrCodeData})`;
        statusCode = 404;
      } else if (error.message === 'User ID is required') {
        errorMessage = 'User ID is required.';
        statusCode = 400;
      } else if (error.message === 'User not found') {
        errorMessage = 'User not found. Please log in again.';
        statusCode = 404;
      } else if (error.message === 'Product already registered to this user') {
        errorMessage = 'This product is already registered to your account.';
        statusCode = 409;
      } else if (error.message === 'Invalid product data format') {
        errorMessage = 'Invalid QR code format. Please try scanning again.';
        statusCode = 400;
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        details: error.stack,
        scannedCode: req.body.qrCodeData
      });
    }
  },

  getProductDetails: async (req, res) => {
    console.log('Received request for product details:', req.params);
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({
          success: false,
          error: 'Product ID is required'
        });
      }
      console.log('Fetching product details for productId:', productId);
      const product = await getProductDetails(productId);
      console.log('Product details retrieved:', JSON.stringify(product, null, 2));
      res.json({ success: true, product });
    } catch (error) {
      console.error('Error in getProductDetails:', error);
      let statusCode = 500;
      let errorMessage = 'An unexpected error occurred';

      if (error.message === 'Product not found') {
        statusCode = 404;
        errorMessage = 'Product not found in the database';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage
      });
    }
  },

  getUserProducts: async (req, res) => {
    console.log('Received request for user products');
    try {
      const userId = req.user.id;
      const products = await getUserProducts(userId);
      res.json({ 
        success: true, 
        products,
        count: products.length
      });
    } catch (error) {
      console.error('Error in getUserProducts:', error);
      let statusCode = 500;
      let errorMessage = 'An unexpected error occurred';

      if (error.message === 'User not found') {
        statusCode = 404;
        errorMessage = 'User not found. Please log in again.';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage
      });
    }
  }
};

export default ProductController;

