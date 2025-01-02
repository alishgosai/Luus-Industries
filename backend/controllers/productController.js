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

