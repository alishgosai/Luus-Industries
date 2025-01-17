import { scanAndRegisterProduct, getProductDetails, getUserProducts, registerProduct } from '../models/Product.js';

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

  
getProductDetails : async (req, res) => {
  try {
    console.log('Received request for product details:', req.params);
    const { productId } = req.params;
    
    // Parse the productId if it's a JSON string
    const parsedProductId = typeof productId === 'string' && productId.startsWith('{') 
      ? JSON.parse(productId) 
      : productId;

    console.log('Fetching product details for productId:', JSON.stringify(parsedProductId));
    
    const product = await getProductDetails(parsedProductId);
    
    if (!product) {
      console.log('Product not found in the database');
      return res.status(404).json({ success: false, error: 'Product not found in the database' });
    }

    console.log('Product details retrieved successfully');
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error in getProductDetails controller:', error);
    res.status(500).json({ success: false, error: error.message });
  }
},

registerProduct: async (req, res) => {
  console.log('Received request to register product:', req.body);
  try {
      const { productId } = req.body;
      const userId = req.user.id;
      
      if (!productId) {
          return res.status(400).json({
              success: false,
              error: 'Product ID is required'
          });
      }

      const result = await registerProduct(productId, userId);
      console.log('Product registration result:', result);
      
      res.json({ 
          success: true, 
          message: 'Product successfully registered',
          product: result
      });
  } catch (error) {
      console.error('Error in registerProduct:', error);
      res.status(500).json({
          success: false,
          error: error.message || 'An unexpected error occurred'
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
},
};

export default ProductController;

