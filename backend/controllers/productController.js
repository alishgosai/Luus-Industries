import { getProductDetails, getUserProducts, registerUserProduct, checkProductRegistration, deleteUserProduct } from '../models/Product.js';

const ProductController = {
  getProductDetails: async (req, res) => {
    try {
      console.log('Received request for product details:', req.params, 'Body:', req.body);
      const { productId } = req.params;
      const { shouldRegister } = req.body;
      const userId = req.user.id;

      const parsedProductId = typeof productId === 'string' && productId.startsWith('{') 
        ? JSON.parse(productId) 
        : productId;

      console.log('Fetching product details for productId:', JSON.stringify(parsedProductId));

      const product = await getProductDetails(parsedProductId);

      if (!product) {
        console.log('Product not found in the database');
        return res.status(404).json({ success: false, error: 'Product not found in the database' });
      }

      let registrationResult = await checkProductRegistration(userId, product.id);

      if (shouldRegister && !registrationResult.isRegistered) {
        console.log(`Attempting to register product ${product.id} for user ${userId}`);
        registrationResult = await registerUserProduct(userId, product.id);
        console.log(`Registration result:`, registrationResult);
      }

      console.log('Product details retrieved successfully');
      console.log('Final registration result:', registrationResult);
      res.json({ 
        success: true, 
        product, 
        registered: registrationResult.isRegistered,
        registrationMessage: registrationResult.message,
        newlyRegistered: registrationResult.newlyRegistered || false
      });
    } catch (error) {
      console.error('Error in getProductDetails controller:', error);
      res.status(500).json({ success: false, error: error.message });
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
  deleteUserProduct: async (req, res) => {
    console.log('Received request to delete user product');
    try {
      const userId = req.user.id;
      const { userProductId } = req.params;

      console.log(`Attempting to delete user product ${userProductId} for user ${userId}`);

      const result = await deleteUserProduct(userId, userProductId);

      res.json({ 
        success: true, 
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteUserProduct:', error);
      let statusCode = 500;
      let errorMessage = 'An unexpected error occurred';

      if (error.message === 'User product not found') {
        statusCode = 404;
        errorMessage = 'User product not found';
      } else if (error.message === 'User does not own this product') {
        statusCode = 403;
        errorMessage = 'User is not authorized to delete this product';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage
      });
    }
  },
};

export default ProductController;

