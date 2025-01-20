import { getFirestore } from 'firebase-admin/firestore';
import { db, admin } from '../services/firebaseAdmin.js';
import { getProductCategory } from '../services/aiService.js';

export async function saveChatSession(userId, messages, aiResponse) {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    if (!userId) {
      throw new Error('userId is required');
    }

    const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
    const category = getProductCategory(lastUserMessage);

    // Reference to user's chat document
    const userRef = db.collection('users').doc(userId);
    
    // Get the current chat session
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log('Creating new user document for chat sessions');
      await userRef.set({
        userId,
        chatSessions: [],
        lastUpdated: new Date().toISOString()
      });
    }

    // Get existing sessions
    const userData = userDoc.exists ? userDoc.data() : { chatSessions: [] };
    const chatSessions = userData.chatSessions || [];

    // Check for duplicate welcome message
    if (messages.length === 0 && chatSessions.length > 0) {
      const lastSession = chatSessions[chatSessions.length - 1];
      const isRecentSession = new Date().getTime() - new Date(lastSession.timestamp).getTime() < 5000; // 5 seconds
      
      if (isRecentSession && lastSession.messages.length === 0) {
        console.log('Skipping duplicate welcome message');
        return;
      }
    }

    // Add new chat session
    const newSession = {
      messages,
      aiResponse,
      timestamp: new Date().toISOString(),
      category
    };

    // Update the document with the new session
    await userRef.set({
      chatSessions: [...chatSessions, newSession],
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    console.log('Chat session saved successfully for user:', userId);
  } catch (error) {
    console.error('Error saving chat session:', error);
    throw error;
  }
}

export async function getChatHistory(userId) {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    if (!userId) {
      throw new Error('userId is required');
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return [];
    }

    const userData = userDoc.data();
    return userData.chatSessions || [];
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
}

export async function getRecentProductInquiries(userId) {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    if (!userId) {
      throw new Error('userId is required');
    }

    // Get user's document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return [];
    }

    const userData = userDoc.data();
    const chatSessions = userData.chatSessions || [];

    // Get unique categories from recent chats
    const categories = new Set();
    chatSessions
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .forEach(session => {
        if (session.category) {
          categories.add(session.category);
        }
      });

    return Array.from(categories);
  } catch (error) {
    console.error('Error getting recent product inquiries:', error);
    return [];
  }
}

export async function clearChatHistory(userId) {
  try {
    if (!db) {
      throw new Error('Firestore instance not initialized');
    }

    if (!userId) {
      throw new Error('userId is required');
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      chatSessions: [],
      lastUpdated: new Date().toISOString()
    });

    console.log('Chat history cleared for user:', userId);
    return true;
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

    const usersSnapshot = await db.collection('users').get();
    return usersSnapshot.docs.map(doc => ({
      userId: doc.id,
      lastUpdated: doc.data().lastUpdated,
      sessionCount: (doc.data().chatSessions || []).length
    }));
  } catch (error) {
    console.error('Error getting all user IDs:', error);
    return [];
  }
}
