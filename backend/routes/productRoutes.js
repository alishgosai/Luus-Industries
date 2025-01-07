import express from 'express';
import { 
  getWarrantyProducts,
  getWarrantyProductById,
  handleQRCodeScan,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/warranty-products', getWarrantyProducts);
router.get('/warranty-products/:id', getWarrantyProductById);
router.post('/qr-scan', handleQRCodeScan);

export default router;
