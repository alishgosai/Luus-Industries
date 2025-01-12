import { db } from '../services/firebaseAdmin.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.header('X-User-Id');
    if (!userId) {
      throw new Error('No User ID provided');
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    req.user = {
      id: userDoc.id,
      ...userDoc.data()
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      error: error.message || 'Please authenticate'
    });
  }
};
