import { API_URL } from "../backend/config/api";

const createFormData = (formData) => {
  const data = new FormData();

  for (const [key, value] of Object.entries(formData)) {
    if (value !== undefined && value !== null) {
      if (key === 'image' && value) {
        // Assuming the image is a file or blob
        const fileName = formData.fileName || 'photo.jpg';
        data.append('image', {
          uri: value,
          type: 'image/jpeg', // You might want to detect this dynamically
          name: fileName
        });
      } else if (key === 'purchaseDate' || key === 'requiredDate') {
        // Convert date to ISO string if it's a Date object
        data.append(key, value instanceof Date ? value.toISOString() : value);
      } else {
        data.append(key, value.toString());
      }
    }
  }

  return data;
};

const submitForm = async (endpoint, formData) => {
  try {
    console.log(`Preparing to submit form to ${endpoint}:`, formData);
    const data = createFormData(formData);

    console.log('Sending request to:', `${API_URL}/api/service/${endpoint}?sendEmail=true`);
    const response = await fetch(`${API_URL}/api/service/${endpoint}?sendEmail=true`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);
    return result;
  } catch (error) {
    console.error(`Error submitting form to ${endpoint}:`, error);
    throw error;
  }
};

export const submitWarrantyServiceForm = (formData) => 
  submitForm('warranty-service', formData);

export const submitEquipmentSalesForm = (formData) => 
  submitForm('equipment-sales', formData);

export const submitTechnicalSupportForm = (formData) => 
  submitForm('technical-support', formData);

