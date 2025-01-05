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
  limit,
  serverTimestamp
} from 'firebase/firestore';

export const firestoreService = {
  // Add a document to a collection
  addDocument: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  },

  // Get all documents from a collection
  getDocuments: async (collectionName) => {
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
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
  queryDocuments: async (collectionName, field, operator, value, lastVisible = null, limitCount = 10) => {
    try {
      let q = query(
        collection(db, collectionName), 
        where(field, operator, value),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return {
        items: querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })),
        lastVisible: lastVisibleDoc
      };
    } catch (error) {
      console.error("Error querying documents:", error);
      throw error;
    }
  },

  // Update a document
  updateDocument: async (collectionName, documentId, data) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
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