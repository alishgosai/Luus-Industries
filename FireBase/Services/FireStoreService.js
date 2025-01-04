import { db } from '../firebase.config';
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
  limit 
} from 'firebase/firestore';

export const firestoreService = {
  // Add a document to a collection
  addDocument: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  },

  // Get all documents from a collection
  getDocuments: async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting documents:", error);
      throw error;
    }
  },

  // Query documents with pagination
  queryDocuments: async (collectionName, field, operator, value, limitCount = 10) => {
    try {
      const q = query(
        collection(db, collectionName), 
        where(field, operator, value),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error querying documents:", error);
      throw error;
    }
  },

  // Update a document
  updateDocument: async (collectionName, documentId, data) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return { id: documentId, ...data };
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (collectionName, documentId) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
      return documentId;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }
};

