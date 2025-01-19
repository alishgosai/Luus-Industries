import express from 'express';
import multer from 'multer';
import { 
  submitEquipmentSales, 
  submitTechnicalSupport, 
  submitWarrantyService 
} from '../controllers/serviceController.js';
import { 
  getServiceFormById, 
  getServiceFormsByType, 
  getAllServiceForms 
} from '../models/ServiceModels.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST routes for form submissions
router.post('/equipment-sales', upload.single('image'), submitEquipmentSales);
router.post('/technical-support', upload.single('image'), submitTechnicalSupport);
router.post('/warranty-service', upload.single('image'), submitWarrantyService);

// GET routes for retrieving form data
router.get('/forms', async (req, res) => {
  try {
    const forms = await getAllServiceForms();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving forms', error: error.message });
  }
});

router.get('/forms/:id', async (req, res) => {
  try {
    const form = await getServiceFormById(req.params.id);
    res.json(form);
  } catch (error) {
    res.status(404).json({ message: 'Form not found', error: error.message });
  }
});

router.get('/forms/type/:formType', async (req, res) => {
  try {
    const forms = await getServiceFormsByType(req.params.formType);
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving forms', error: error.message });
  }
});

export default router;

