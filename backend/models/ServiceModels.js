import { db } from '../services/firebaseAdmin.js';

const COLLECTION_NAME = 'serviceForms';
const USERS_COLLECTION = 'users';

export const createServiceForm = async (data) => {
  try {
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});

    const docRef = await db.collection(COLLECTION_NAME).add({
      ...cleanedData,
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
    const docRef = db.collection(COLLECTION_NAME).doc(id);
    const doc = await docRef.get();
    
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
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
    const querySnapshot = await db.collection(COLLECTION_NAME).where("formType", "==", formType).get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting service forms by type:', error);
    throw error;
  }
};

export const getAllServiceForms = async () => {
  try {
    const querySnapshot = await db.collection(COLLECTION_NAME).get();
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all service forms:', error);
    throw error;
  }
};

export const getServiceFormsCollection = () => db.collection(COLLECTION_NAME);

export const getUserData = async (email) => {
  try {
    if (!email) {
      console.log('No email provided for user lookup');
      return null;
    }

    // First try looking up by email field
    let snapshot = await db.collection(USERS_COLLECTION)
      .where('email', '==', email.toLowerCase())
      .get();

    // If not found, try looking up by auth.email field (in case of nested structure)
    if (snapshot.empty) {
      snapshot = await db.collection(USERS_COLLECTION)
        .where('auth.email', '==', email.toLowerCase())
        .get();
    }

    if (snapshot.empty) {
      console.log(`No user found for email: ${email}`);
      return null;
    }

    const userData = snapshot.docs[0].data();
    
    // Check different possible locations for mobile number
    const mobileNumber = userData.mobileNumber || 
                        userData.mobile ||
                        userData.phone ||
                        userData.phoneNumber ||
                        (userData.auth && userData.auth.mobileNumber) ||
                        null;

    return {
      ...userData,
      mobileNumber: mobileNumber
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

