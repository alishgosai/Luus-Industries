import { API_URL } from "../backend/config/api";
import { storage } from '../FireBase/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadImageToFirebase = async (imageUri, fileName) => {
  try {
    console.log('Uploading image to Firebase Storage...');
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `uploads/${fileName}`);
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('Image uploaded successfully');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw error;
  }
};

const createFormData = async (formData) => {
  const data = new FormData();

  for (const [key, value] of Object.entries(formData)) {
    if (key === 'image' && value) {
      const fileName = `${Date.now()}_${formData.fileName || 'photo.jpg'}`;
      const downloadURL = await uploadImageToFirebase(value, fileName);
      data.append('imageUrl', downloadURL);
      data.append('fileName', fileName);
    } else {
      data.append(key, value);
    }
  }

  return data;
};

export const submitWarrantyServiceForm = async (formData) => {
  try {
    console.log('Preparing to submit warranty service form:', formData);
    const data = await createFormData(formData);

    console.log('Sending request to:', `${API_URL}/api/service/warranty-service?sendEmail=true`);
    const response = await fetch(`${API_URL}/api/service/warranty-service?sendEmail=true`, {
      method: 'POST',
      body: data,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error submitting Warranty Service form:', error);
    throw error;
  }
};

export const submitEquipmentSalesForm = async (formData) => {
  try {
    console.log('Preparing to submit equipment sales form:', formData);
    const data = await createFormData(formData);

    console.log('Sending request to:', `${API_URL}/api/service/equipment-sales?sendEmail=true`);
    const response = await fetch(`${API_URL}/api/service/equipment-sales?sendEmail=true`, {
      method: 'POST',
      body: data,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error submitting Equipment Sales form:', error);
    throw error;
  }
};

export const submitTechnicalSupportForm = async (formData) => {
  try {
    console.log('Preparing to submit technical support form:', formData);
    const data = await createFormData(formData);

    console.log('Sending request to:', `${API_URL}/api/service/technical-support?sendEmail=true`);
    const response = await fetch(`${API_URL}/api/service/technical-support?sendEmail=true`, {
      method: 'POST',
      body: data,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Form submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('Error submitting Technical Support form:', error);
    throw error;
  }
};

