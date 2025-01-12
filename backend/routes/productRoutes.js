import express from 'express';
import ProductController from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/scan-and-register', ProductController.scanAndRegisterProduct);
router.get('/:productId', ProductController.getProductDetails);
router.get('/user-products', ProductController.getUserProducts);

export default router;

