import express from 'express';
import ProductController from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/user-products', ProductController.getUserProducts);
router.post('/:productId', ProductController.getProductDetails);
router.delete('/user-products/:userProductId', ProductController.deleteUserProduct);

export default router;

