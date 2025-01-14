import { API_URL } from "../backend/config/api";// Replace with your actual API endpoint

// Helper function to create FormData from form data and file
const createFormData = (formData, file) => {
  const data = new FormData();
  
  Object.keys(formData).forEach(key => {
    if (key !== 'image' && key !== 'fileName') {
      data.append(key, formData[key]);
    }
  });

  if (file) {
    const fileExtension = file.fileName.split('.').pop();
    data.append('file', {
      uri: file.image,
      type: `image/${fileExtension}`,
      name: file.fileName,
    });
  }

  return data;
};

// Function to submit Equipment Sales form
export const submitEquipmentSalesForm = async (formData) => {
  try {
    const data = createFormData(formData, formData.image ? { image: formData.image, fileName: formData.fileName } : null);

    const response = await fetch(`${API_URL}/api/service/equipment-sales`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to submit Equipment Sales form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting Equipment Sales form:', error);
    throw error;
  }
};

// Function to submit Technical Support form
export const submitTechnicalSupportForm = async (formData) => {
  try {
    const data = createFormData(formData, formData.image ? { image: formData.image, fileName: formData.fileName } : null);

    const response = await fetch(`${API_URL}/api/service/technical-support`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to submit Technical Support form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting Technical Support form:', error);
    throw error;
  }
};

// Function to submit Warranty Service form
export const submitWarrantyServiceForm = async (formData) => {
  try {
    const data = createFormData(formData, formData.image ? { image: formData.image, fileName: formData.fileName } : null);

    const response = await fetch(`${API_URL}/api/service/warranty-service`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to submit Warranty Service form');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting Warranty Service form:', error);
    throw error;
  }
};

