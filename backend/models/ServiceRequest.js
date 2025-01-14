import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const COLLECTION_NAME = 'serviceForms';

export const createServiceForm = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    formType: data.formType, // 'equipmentSales', 'technicalSupport', or 'warrantyService'
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
    fileUrl: data.fileUrl,
    createdAt: new Date()
  });
  return docRef.id;
};

export const getServiceFormById = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Service form not found');
  }
};

export const getServiceFormsByType = async (formType) => {
  const q = query(collection(db, COLLECTION_NAME), where("formType", "==", formType));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllServiceForms = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getServiceFormsCollection = () => collection(db, COLLECTION_NAME);
