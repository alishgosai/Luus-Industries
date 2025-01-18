import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, admin } from '../services/firebaseAdmin.js';

const COLLECTION_NAME = 'serviceForms';

export const createServiceForm = async (data) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      formType: data.formType,
      name: data.name,
      email: data.email,
      businessName: data.businessName,
      businessType: data.businessType,
      requiredDate: data.requiredDate,
      productModel: data.productModel,
      serialNumber: data.serialNumber,
      purchaseDate: data.purchaseDate,
      warrantyNumber: data.warrantyNumber,
      problemDescription: data.problemDescription,
      fileName: data.fileName,
      imageUrl: data.imageUrl,
      createdAt: new Date()
    });
    console.log('Service form created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating service form:', error);
    throw error;
  }
};

export const getServiceFormById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Service form not found');
    }
  } catch (error) {
    console.error('Error getting service form:', error);
    throw error;
  }
};

export const getServiceFormsByType = async (formType) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("formType", "==", formType));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting service forms by type:', error);
    throw error;
  }
};

export const getAllServiceForms = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all service forms:', error);
    throw error;
  }
};

export const getServiceFormsCollection = () => collection(db, COLLECTION_NAME);

