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
router.post('/api/service/equipment-sales', upload.single('file'), submitEquipmentSales);
router.post('/api/service/technical-support', upload.single('file'), submitTechnicalSupport);
router.post('/api/service/warranty-service', upload.single('file'), submitWarrantyService);

// GET routes for retrieving form data
router.get('/api/service/forms', async (req, res) => {
  try {
    const forms = await getAllServiceForms();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving forms', error: error.message });
  }
});

router.get('/api/service/forms/:id', async (req, res) => {
  try {
    const form = await getServiceFormById(req.params.id);
    res.json(form);
  } catch (error) {
    res.status(404).json({ message: 'Form not found', error: error.message });
  }
});

router.get('/api/service/forms/type/:formType', async (req, res) => {
  try {
    const forms = await getServiceFormsByType(req.params.formType);
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving forms', error: error.message });
  }
});

export default router;

