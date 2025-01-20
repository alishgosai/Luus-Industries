import { SparePart } from '../models/sparePartModels.js';

export const getAllSpareParts = async (req, res) => {
  try {
    console.log('Attempting to fetch all spare parts');
    const parts = await SparePart.findAll();
    console.log(`Successfully fetched ${parts.length} spare parts`);
    res.json(parts);
  } catch (error) {
    console.error('Error fetching spare parts:', error);
    res.status(500).json({ message: 'Error fetching spare parts', error: error.message });
  }
};

export const getSparePartsForModel = async (req, res) => {
  const { modelType } = req.query;
  if (!modelType) {
    return res.status(400).json({ message: 'Model type is required' });
  }
  try {
    console.log(`Fetching spare parts for model type: ${modelType}`);
    const parts = await SparePart.findBySuitableModel(modelType);
    console.log(`Found ${parts.length} parts for model type ${modelType}`);
    res.json(parts);
  } catch (error) {
    console.error(`Error fetching spare parts for model type ${modelType}:`, error);
    res.status(500).json({ message: 'Error fetching spare parts for model', error: error.message });
  }
};

export const searchSpareParts = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }
  try {
    console.log(`Searching spare parts with query: ${query}`);
    const parts = await SparePart.searchBySuits(query); // Updated to use new search method
    console.log(`Found ${parts.length} parts matching the search query`);
    res.json(parts);
  } catch (error) {
    console.error('Error searching spare parts:', error);
    res.status(500).json({ message: 'Error searching spare parts', error: error.message });
  }
};

export const createSparePart = async (req, res) => {
  const { name, imageUrl, price, productDetails, suits, partId } = req.body;
  try {
    console.log('Creating new spare part');
    const newPart = await SparePart.create({
      name,
      imageUrl,
      price,
      productDetails,
      suits: Array.isArray(suits) ? suits : suits.split(',').map(s => s.trim()),
      partId
    });
    console.log(`Successfully created new spare part with ID: ${newPart.id}`);
    res.status(201).json(newPart);
  } catch (error) {
    console.error('Error creating spare part:', error);
    res.status(500).json({ message: 'Error creating spare part', error: error.message });
  }
};

export const updateSparePart = async (req, res) => {
  const { partId } = req.params;
  const { name, imageUrl, price, productDetails, suits } = req.body;
  try {
    console.log(`Updating spare part with ID: ${partId}`);
    const part = await SparePart.findById(partId);
    if (part) {
      await part.update({
        name,
        imageUrl,
        price,
        productDetails,
        suits: Array.isArray(suits) ? suits : suits.split(',').map(s => s.trim()),
        partId
      });
      console.log(`Successfully updated spare part with ID: ${partId}`);
      res.json(part);
    } else {
      console.log(`Spare part with ID ${partId} not found for update`);
      res.status(404).json({ message: 'Spare part not found' });
    }
  } catch (error) {
    console.error(`Error updating spare part with ID ${partId}:`, error);
    res.status(500).json({ message: 'Error updating spare part', error: error.message });
  }
};

export const getSparePartDetails = async (req, res) => {
  const { partId } = req.params;
  try {
    console.log(`Fetching details for spare part with ID: ${partId}`);
    const part = await SparePart.findById(partId);
    if (part) {
      console.log('Successfully fetched spare part details');
      res.json(part);
    } else {
      console.log(`Spare part with ID ${partId} not found`);
      res.status(404).json({ message: 'Spare part not found' });
    }
  } catch (error) {
    console.error(`Error fetching spare part details for ID ${partId}:`, error);
    res.status(500).json({ message: 'Error fetching spare part details', error: error.message });
  }
};

export const deleteSparePart = async (req, res) => {
  const { partId } = req.params;
  try {
    console.log(`Deleting spare part with ID: ${partId}`);
    const part = await SparePart.findById(partId);
    if (part) {
      await part.delete();
      console.log(`Successfully deleted spare part with ID: ${partId}`);
      res.json({ message: 'Spare part deleted successfully' });
    } else {
      console.log(`Spare part with ID ${partId} not found for deletion`);
      res.status(404).json({ message: 'Spare part not found' });
    }
  } catch (error) {
    console.error(`Error deleting spare part with ID ${partId}:`, error);
    res.status(500).json({ message: 'Error deleting spare part', error: error.message });
  }
};

