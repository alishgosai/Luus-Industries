import express from 'express';
import * as sparePartController from '../controllers/sparePartController.js';

const router = express.Router();

// Get all spare parts
router.get('/spare-parts', sparePartController.getAllSpareParts);

// Get spare parts for a specific product model
router.get('/spare-parts/model', sparePartController.getSparePartsForModel);

// Search spare parts
router.get('/spare-parts/search', sparePartController.searchSpareParts);

// Get details of a specific spare part
router.get('/spare-parts/:partId', sparePartController.getSparePartDetails);

// Create a new spare part
router.post('/spare-parts', sparePartController.createSparePart);

// Update a spare part
router.put('/spare-parts/:partId', sparePartController.updateSparePart);

// Delete a spare part
router.delete('/spare-parts/:partId', sparePartController.deleteSparePart);

export default router;

