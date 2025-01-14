import { admin, db, storage } from '../services/firebaseAdmin.js';

export const createServiceForm = async (data) => {
  try {
    const docRef = await db.collection('serviceForms').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating service form:', error);
    throw error;
  }
};

export const getServiceFormById = async (id) => {
  try {
    const docRef = db.collection('serviceForms').doc(id);
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
    const snapshot = await db.collection('serviceForms')
      .where('formType', '==', formType)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting service forms by type:', error);
    throw error;
  }
};

export const getAllServiceForms = async () => {
  try {
    const snapshot = await db.collection('serviceForms').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting all service forms:', error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  try {
    const bucket = storage.bucket();
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(error);
      });

      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

