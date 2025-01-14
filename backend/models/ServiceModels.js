import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const COLLECTION_NAME = 'serviceForms';
const DATA_FILE = path.join(process.cwd(), 'data', 'serviceForms.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper function to read data from file
const readDataFromFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data to file
const writeDataToFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

export const createServiceForm = async (data) => {
  const forms = readDataFromFile();
  const newForm = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString()
  };
  forms.push(newForm);
  writeDataToFile(forms);
  return newForm.id;
};

export const getServiceFormById = async (id) => {
  const forms = readDataFromFile();
  const form = forms.find(form => form.id === id);
  if (form) {
    return form;
  } else {
    throw new Error('Service form not found');
  }
};

export const getServiceFormsByType = async (formType) => {
  const forms = readDataFromFile();
  return forms.filter(form => form.formType === formType);
};

export const getAllServiceForms = async () => {
  return readDataFromFile();
};

