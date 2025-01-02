import express from 'express';
import { 
  getWarrantyProducts,
  getWarrantyProductById,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/warranty-products', getWarrantyProducts);
router.get('/warranty-products/:id', getWarrantyProductById);

export default router;

