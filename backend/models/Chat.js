import { getFirestore } from 'firebase-admin/firestore';
import { db } from '../services/firebaseAdmin.js';
import { getProductCategory } from '../services/aiService.js';

export async function saveChatSession(userId, messages, aiResponse) {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
    const category = getProductCategory(lastUserMessage);

    const chatSessionsRef = db.collection('chatSessions');
    await chatSessionsRef.add({
      userId,
      messages,
      aiResponse,
      timestamp: new Date().toISOString(),
      category
    });

    console.log('Chat session saved successfully');
  } catch (error) {
    console.error('Error saving chat session:', error);
    throw error; // Propagate the error to handle it in the controller
  }
}

export async function getChatHistory(userId) {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    const chatSessionsRef = db.collection('chatSessions');
    const q = chatSessionsRef.where('userId', '==', userId);
    const querySnapshot = await q.get();
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
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
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    const chatSessionsRef = db.collection('chatSessions');
    const q = chatSessionsRef.where('userId', '==', userId);
    const querySnapshot = await q.get();
    
    const deletePromises = querySnapshot.docs.map(document => 
      chatSessionsRef.doc(document.id).delete()
    );
    
    await Promise.all(deletePromises);
    console.log('Chat history cleared successfully');
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
}

export async function getAllUserIds() {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    const chatSessionsRef = db.collection('chatSessions');
    const querySnapshot = await chatSessionsRef.get();
    const userIds = new Set();
    
    querySnapshot.forEach(doc => userIds.add(doc.data().userId));
    return Array.from(userIds);
  } catch (error) {
    console.error('Error getting all user IDs:', error);
    return [];
  }
}

