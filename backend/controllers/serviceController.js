import { createServiceForm } from '../models/ServiceModels.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (formData, formType) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'alishgosai@gmail.com',
    subject: `New ${formType} Submission`,
    text: `
      A new ${formType} form has been submitted:
      
      Name: ${formData.name}
      Email: ${formData.email}
      ${Object.entries(formData)
        .filter(([key]) => !['name', 'email'].includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')}
    `
  };

  await transporter.sendMail(mailOptions);
};

export const submitWarrantyService = async (req, res) => {
  try {
    const formData = req.body;
    const docId = await createServiceForm({ ...formData, formType: 'warrantyService' });
    
    if (req.query.sendEmail === 'true') {
      await sendEmail(formData, 'Warranty Service');
    }

    res.status(201).json({ message: 'Warranty service form submitted successfully', id: docId });
  } catch (error) {
    console.error('Error submitting warranty service form:', error);
    res.status(500).json({ message: 'Error submitting warranty service form', error: error.message });
  }
};

export const submitEquipmentSales = async (req, res) => {
  try {
    const formData = req.body;
    const docId = await createServiceForm({ ...formData, formType: 'equipmentSales' });
    
    if (req.query.sendEmail === 'true') {
      await sendEmail(formData, 'Equipment Sales');
    }

    res.status(201).json({ message: 'Equipment sales form submitted successfully', id: docId });
  } catch (error) {
    console.error('Error submitting equipment sales form:', error);
    res.status(500).json({ message: 'Error submitting equipment sales form', error: error.message });
  }
};

export const submitTechnicalSupport = async (req, res) => {
  try {
    const formData = req.body;
    const docId = await createServiceForm({ ...formData, formType: 'technicalSupport' });
    
    if (req.query.sendEmail === 'true') {
      await sendEmail(formData, 'Technical Support');
    }

    res.status(201).json({ message: 'Technical support form submitted successfully', id: docId });
  } catch (error) {
    console.error('Error submitting technical support form:', error);
    res.status(500).json({ message: 'Error submitting technical support form', error: error.message });
  }
};

