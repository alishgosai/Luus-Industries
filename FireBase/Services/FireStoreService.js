import { db } from "./firebase.config.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  limit,
  serverTimestamp,
  startAfter,
  getDoc
} from 'firebase/firestore';

const normalizeProductId = (productId) => {
  if (typeof productId !== 'string') {
    throw new Error('Product ID must be a string');
  }
  return productId.trim().toLowerCase();
};

export const firestoreService = {
  // Add a document to a collection
  addDocument: async (collectionName, data) => {
    try {
      console.log(`Adding document to collection: ${collectionName}`, data);
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
      console.log(`Document added with ID: ${docRef.id}`);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error adding document:", error.message);
      throw new Error(`Failed to add document to ${collectionName}: ${error.message}`);
    }
  },

  // Get all documents from a collection
  getDocuments: async (collectionName) => {
    try {
      console.log(`Fetching documents from collection: ${collectionName}`);
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log(`Fetched ${querySnapshot.size} documents.`);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching documents:", error.message);
      throw new Error(`Failed to fetch documents from ${collectionName}: ${error.message}`);
    }
  },

  // Query documents with pagination
  queryDocuments: async (collectionName, field, operator, value, lastVisible = null, limitCount = 10) => {
    try {
      console.log(`Querying documents in collection: ${collectionName}`);
      let q = query(
        collection(db, collectionName), 
        where(field, operator, value),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (lastVisible) {
        console.log('Applying pagination with startAfter.');
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      console.log(`Fetched ${querySnapshot.size} documents.`);
      return {
        items: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
        lastVisible: lastVisibleDoc,
      };
    } catch (error) {
      console.error("Error querying documents:", error.message);
      throw new Error(`Failed to query documents from ${collectionName}: ${error.message}`);
    }
  },

  // Update a document
  updateDocument: async (collectionName, documentId, data) => {
    try {
      console.log(`Updating document in collection: ${collectionName}, ID: ${documentId}`, data);
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      console.log(`Document updated: ${documentId}`);
      return { id: documentId, ...data };
    } catch (error) {
      console.error("Error updating document:", error.message);
      throw new Error(`Failed to update document in ${collectionName}: ${error.message}`);
    }
  },

  // Delete a document
  deleteDocument: async (collectionName, documentId) => {
    try {
      console.log(`Deleting document from collection: ${collectionName}, ID: ${documentId}`);
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      console.log(`Document deleted: ${documentId}`);
      return documentId;
    } catch (error) {
      console.error("Error deleting document:", error.message);
      throw new Error(`Failed to delete document from ${collectionName}: ${error.message}`);
    }
  },

  // Register a product for a user
  registerProduct: async (userId, productData) => {
    if (!userId || !productData || !productData.product_id) {
      throw new Error('User ID, product data, and product_id are required to register a product.');
    }
    try {
      const normalizedProductId = normalizeProductId(productData.product_id);
      console.log(`Registering product for user ID: ${userId}, normalized product ID: ${normalizedProductId}`, productData);
      
      // Check if the product exists in the global products collection
      const globalProductRef = doc(db, 'products', normalizedProductId);
      const globalDocSnap = await getDoc(globalProductRef);
      
      if (!globalDocSnap.exists()) {
        console.log(`Product ${normalizedProductId} not found in global products collection`);
        throw new Error('Product not found in the global catalog');
      }
      
      // Product exists, now register it for the user
      const userProductsRef = collection(db, 'users', userId, 'products');
      const docRef = await addDoc(userProductsRef, {
        ...productData,
        product_id: normalizedProductId,
        registrationDate: serverTimestamp(),
      });
      console.log('Product registered with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error registering product:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Access denied. Please check Firestore security rules.');
      }
      throw new Error(`Failed to register product for user ID: ${userId}: ${error.message}`);
    }
  },

  // Get user's products
  getUserProducts: async (userId) => {
    if (!userId) {
      throw new Error('User ID is required to fetch products.');
    }
    try {
      console.log(`Fetching products for user ID: ${userId}`);
      const userProductsRef = collection(db, 'users', userId, 'products');
      const q = query(userProductsRef, orderBy('registrationDate', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log(`Fetched ${querySnapshot.size} products.`);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user products:', error.message);
      throw new Error(`Failed to fetch products for user ID: ${userId}: ${error.message}`);
    }
  },

  // Get product details
  getProductDetails: async (userId, productId) => {
    if (!userId || !productId) {
      throw new Error('User ID and product ID are required to fetch product details.');
    }
    try {
      const normalizedProductId = normalizeProductId(productId);
      console.log(`Fetching product details for user ID: ${userId}, normalized product ID: ${normalizedProductId}`);
      
      // First, check the global products collection
      const globalProductRef = doc(db, 'products', normalizedProductId);
      const globalDocSnap = await getDoc(globalProductRef);
      
      if (globalDocSnap.exists()) {
        console.log('Product details fetched from global products:', globalDocSnap.data());
        return { id: globalDocSnap.id, ...globalDocSnap.data() };
      }
      
      // If not found in global products, check user-specific products
      const userProductRef = doc(db, 'users', userId, 'products', normalizedProductId);
      const userDocSnap = await getDoc(userProductRef);
      
      if (userDocSnap.exists()) {
        console.log('Product details fetched from user products:', userDocSnap.data());
        return { id: userDocSnap.id, ...userDocSnap.data() };
      }
      
      console.log(`Product not found for user ID: ${userId}, product ID: ${normalizedProductId}`);
      throw new Error('Product not found.');
    } catch (error) {
      console.error('Error fetching product details:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Access denied. Please check Firestore security rules.');
      }
      throw new Error(`Failed to fetch product details for user ID: ${userId}: ${error.message}`);
    }
  },

  // Query product by product_id
  queryProductByProductId: async (productId) => {
    try {
      const normalizedProductId = normalizeProductId(productId);
      console.log(`Querying product with normalized product_id: ${normalizedProductId}`);
      const q = query(
        collection(db, 'products'),
        where('product_id', '==', normalizedProductId),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`No product found with product_id: ${normalizedProductId}`);
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      console.log(`Product found:`, doc.data());
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error("Error querying product by product_id:", error);
      if (error.code === 'permission-denied') {
        throw new Error('Access denied. Please check Firestore security rules.');
      }
      throw new Error(`Failed to query product with product_id ${productId}: ${error.message}`);
    }
  },
};

export default firestoreService;

