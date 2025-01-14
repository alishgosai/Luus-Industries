import { createServiceForm, uploadFile } from '../models/ServiceModels.js';

export const submitEquipmentSales = async (req, res) => {
  try {
    const { name, email, businessName, businessType, requiredDate, problemDescription } = req.body;
    let fileUrl = null;
    let fileName = null;

    if (req.file) {
      fileUrl = await uploadFile(req.file);
      fileName = req.file.originalname;
    }

    const docId = await createServiceForm({
      formType: 'equipmentSales',
      name,
      email,
      businessName,
      businessType,
      requiredDate,
      problemDescription,
      fileName,
      fileUrl
    });

    res.status(201).json({ message: 'Equipment sales form submitted successfully', id: docId });
  } catch (error) {
    console.error('Error submitting equipment sales form:', error);
    res.status(500).json({ message: 'Error submitting equipment sales form', error: error.message });
  }
};

export const submitTechnicalSupport = async (req, res) => {
  try {
    const { name, email, productModel, serialNumber, purchaseDate, problemDescription } = req.body;
    let fileUrl = null;
    let fileName = null;

    if (req.file) {
      fileUrl = await uploadFile(req.file);
      fileName = req.file.originalname;
    }

    const docId = await createServiceForm({
      formType: 'technicalSupport',
      name,
      email,
      productModel,
      serialNumber,
      purchaseDate,
      problemDescription,
      fileName,
      fileUrl
    });

    res.status(201).json({ message: 'Technical support form submitted successfully', id: docId });
  } catch (error) {
    console.error('Error submitting technical support form:', error);
    res.status(500).json({ message: 'Error submitting technical support form', error: error.message });
  }
};

export const submitWarrantyService = async (req, res) => {
  try {
    const { name, email, productModel, serialNumber, purchaseDate, warrantyNumber, problemDescription } = req.body;
    let fileUrl = null;
    let fileName = null;

    if (req.file) {
      fileUrl = await uploadFile(req.file);
      fileName = req.file.originalname;
    }

    const docId = await createServiceForm({
      formType: 'warrantyService',
      name,
      email,
      productModel,
      serialNumber,
      purchaseDate,
      warrantyNumber,
      problemDescription,
      fileName,
      fileUrl
    });

    res.status(201).json({ message: 'Warranty service form submitted successfully', id: docId });
  } catch (error) {
    console.error('Error submitting warranty service form:', error);
    res.status(500).json({ message: 'Error submitting warranty service form', error: error.message });
  }
};

