import { auth } from '../firebase.config';
import { db } from '../firebase.config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';
import { emailService } from './EmailService';
import { v4 as uuidv4 } from 'uuid';

const RESET_TOKENS_COLLECTION = 'passwordResetTokens';

class AuthService {
  // Store reset token in Firestore
  async storeResetToken(userId, token) {
    const tokenRef = doc(db, RESET_TOKENS_COLLECTION, userId);
    await setDoc(tokenRef, {
      token,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
    });
  }

  // Validate reset token
  async validateResetToken(userId, token) {
    const tokenRef = doc(db, RESET_TOKENS_COLLECTION, userId);
    const tokenDoc = await getDoc(tokenRef);

    if (!tokenDoc.exists()) {
      return false;
    }

    const tokenData = tokenDoc.data();
    const now = new Date();

    if (tokenData.token !== token || tokenData.expiresAt.toDate() < now) {
      return false;
    }

    return true;
  }

  // Delete reset token
  async deleteResetToken(userId) {
    const tokenRef = doc(db, RESET_TOKENS_COLLECTION, userId);
    await deleteDoc(tokenRef);
  }

  // Find user by email
  async findUserByEmail(email) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }

  // Initiate password reset
  async initiatePasswordReset(email) {
    try {
      // First, send Firebase's default password reset email
      await sendPasswordResetEmail(auth, email);

      // Then find the user and generate our custom token
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const token = uuidv4();
      await this.storeResetToken(user.id, token);

      // Send our custom email with additional information
      await emailService.sendResetEmail(email, token);

      console.log(`Password reset initiated for user ${user.id}`);
      return true;
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw error;
    }
  }

  // Reset password with Firebase
  async resetPasswordWithFirebase(oobCode, newPassword) {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      console.log('Password reset successful with Firebase');
      return true;
    } catch (error) {
      console.error('Error resetting password with Firebase:', error);
      throw error;
    }
  }

  // Reset password with custom token
  async resetPasswordWithToken(userId, token, newPassword) {
    try {
      const isValid = await this.validateResetToken(userId, token);
      if (!isValid) {
        throw new Error('Invalid or expired token');
      }

      // Update password in Firebase
      await this.resetPasswordWithFirebase(token, newPassword);
      
      // Clean up the token
      await this.deleteResetToken(userId);

      console.log(`Password reset successful for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  // Handle password reset completion
  async handlePasswordReset(actionCode, newPassword) {
    try {
      await this.resetPasswordWithFirebase(actionCode, newPassword);
      return true;
    } catch (error) {
      console.error('Error handling password reset:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

