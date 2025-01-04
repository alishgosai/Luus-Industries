import { getAllFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ } from '../models/FAQ.js';

export const getAllFAQsController = async (req, res) => {
  try {
    const faqs = await getAllFAQs();
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFAQByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await getFAQById(id);
    if (faq) {
      res.json(faq);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createFAQController = async (req, res) => {
  try {
    const newFAQ = await createFAQ(req.body);
    res.status(201).json(newFAQ);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateFAQController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFAQ = await updateFAQ(id, req.body);
    if (updatedFAQ) {
      res.json(updatedFAQ);
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFAQController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFAQ = await deleteFAQ(id);
    if (deletedFAQ) {
      res.json({ message: 'FAQ deleted successfully', deletedFAQ });
    } else {
      res.status(404).json({ message: 'FAQ not found' });
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

