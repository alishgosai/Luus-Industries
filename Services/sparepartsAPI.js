import axios from 'axios';
import { API_URL } from '../backend/config/api';

// Function to fetch all spare parts
export const fetchSpareParts = async () => {
  try {
    const response = await axios.get(`${API_URL}/spare-parts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching spare parts:', error);
    throw error;
  }
};

// Function to fetch spare parts for a specific product model
export const fetchSparePartsForModel = async (productModel) => {
  try {
    const response = await axios.get(`${API_URL}/spare-parts/model`, {
      params: { productModel }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching spare parts for model ${productModel}:`, error);
    throw error;
  }
};

// Function to search spare parts
export const searchSpareParts = async (searchQuery) => {
  try {
    const response = await axios.get(`${API_URL}/spare-parts/search`, {
      params: { query: searchQuery }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching spare parts:', error);
    throw error;
  }
};

// Function to get details of a specific spare part
export const getSparePartDetails = async (partId) => {
  try {
    const response = await axios.get(`${API_URL}/spare-parts/${partId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for part ${partId}:`, error);
    throw error;
  }
};

