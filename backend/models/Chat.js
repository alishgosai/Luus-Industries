import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseAdmin.js';

export async function saveChatSession(userId, messages, aiResponse) {
  try {
    const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
    const category = getProductCategory(lastUserMessage);

    await addDoc(collection(db, 'chatSessions'), {
      userId,
      messages,
      aiResponse,
      timestamp: new Date().toISOString(),
      category
    });
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
}

export async function getChatHistory(userId) {
  try {
    const q = query(collection(db, 'chatSessions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
}

export async function getRecentProductInquiries(userId) {
  try {
    const history = await getChatHistory(userId);
    return history
      .filter(session => session.category !== 'Other')
      .map(session => session.category)
      .reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
  } catch (error) {
    console.error('Error getting recent product inquiries:', error);
    return {};
  }
}

export async function clearChatHistory(userId) {
  try {
    const q = query(collection(db, 'chatSessions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'chatSessions', document.id));
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
}

export async function getAllUserIds() {
  try {
    const querySnapshot = await getDocs(collection(db, 'chatSessions'));
    const userIds = new Set();
    querySnapshot.forEach(doc => userIds.add(doc.data().userId));
    return Array.from(userIds);
  } catch (error) {
    console.error('Error getting all user IDs:', error);
    return [];
  }
}

function getProductCategory(message) {
  // Implement your logic to determine the product category based on the message
  // This is a placeholder implementation
  return 'Other';
}

