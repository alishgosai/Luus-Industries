import { storage } from '../services/firebaseAdmin.js';
import { createServiceForm, getUserData } from '../models/ServiceModels.js';
import { sendEmail } from '../services/emailservice.js';

const uploadImage = async (file) => {
  if (!file) return null;

  try {
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = storage.bucket().file(`uploads/${fileName}`);
    
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });
    
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const processFormData = async (formData) => {
  const processedData = {};
  for (const [key, value] of Object.entries(formData)) {
    if (value !== undefined && value !== null && value !== '') {
      processedData[key] = value;
    }
  }

  // Fetch user data to get the mobile number
  if (processedData.email) {
    try {
      const userData = await getUserData(processedData.email);
      if (userData && userData.mobileNumber) {
        processedData.mobileNumber = userData.mobileNumber;
      } else {
        console.log(`Mobile number not found for user: ${processedData.email}`);
        // If mobile number is provided in the form, use that instead
        if (formData.mobileNumber) {
          processedData.mobileNumber = formData.mobileNumber;
        }
      }
    } catch (error) {
      console.error('Error processing user data:', error);
      // If mobile number is provided in the form, use that as fallback
      if (formData.mobileNumber) {
        processedData.mobileNumber = formData.mobileNumber;
      }
    }
  }

  return processedData;
};

export const submitWarrantyService = async (req, res) => {
  try {
    const formData = await processFormData(req.body);
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const docId = await createServiceForm({
      ...formData,
      imageUrl,
      formType: 'warrantyService'
    });
    
    let emailSent = false;
    if (req.query.sendEmail === 'true') {
      emailSent = await sendEmail(formData, 'Warranty Service', req.file);
      if (!emailSent) {
        console.warn('Email could not be sent, but form was submitted successfully');
      }
    }

    res.status(201).json({ 
      message: 'Warranty service form submitted successfully', 
      id: docId,
      emailSent
    });
  } catch (error) {
    console.error('Error submitting warranty service form:', error);
    res.status(500).json({ 
      message: 'Error submitting warranty service form', 
      error: error.message 
    });
  }
};

export const submitEquipmentSales = async (req, res) => {
  try {
    const formData = await processFormData(req.body);
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const docId = await createServiceForm({
      ...formData,
      imageUrl,
      formType: 'equipmentSales'
    });
    
    let emailSent = false;
    if (req.query.sendEmail === 'true') {
      emailSent = await sendEmail(formData, 'Equipment Sales', req.file);
      if (!emailSent) {
        console.warn('Email could not be sent, but form was submitted successfully');
      }
    }

    res.status(201).json({ 
      message: 'Equipment sales form submitted successfully', 
      id: docId,
      emailSent
    });
  } catch (error) {
    console.error('Error submitting equipment sales form:', error);
    res.status(500).json({ 
      message: 'Error submitting equipment sales form', 
      error: error.message 
    });
  }
};

export const submitTechnicalSupport = async (req, res) => {
  try {
    const formData = await processFormData(req.body);
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const docId = await createServiceForm({
      ...formData,
      imageUrl,
      formType: 'technicalSupport'
    });
    
    let emailSent = false;
    if (req.query.sendEmail === 'true') {
      emailSent = await sendEmail(formData, 'Technical Support', req.file);
      if (!emailSent) {
        console.warn('Email could not be sent, but form was submitted successfully');
      }
    }

    res.status(201).json({ 
      message: 'Technical support form submitted successfully', 
      id: docId,
      emailSent
    });
  } catch (error) {
    console.error('Error submitting technical support form:', error);
    res.status(500).json({ 
      message: 'Error submitting technical support form', 
      error: error.message 
    });
  }
};

