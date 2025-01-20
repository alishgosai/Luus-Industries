import { db } from '../services/firebaseAdmin.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

class User {
  constructor(id, name, avatar, accountInfo) {
    this.id = id || uuidv4();
    this.name = name;
    this.avatar = avatar;
    this.accountInfo = accountInfo;
  }
}

class AccountInfo {
  constructor(dateOfBirth, phoneNumber, email, password) {
    this.dateOfBirth = dateOfBirth;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
  }
}

export const findUserByEmail = async (email) => {
  try {
    console.log('Searching for user with email:', email);
    const usersRef = db.collection('users');
    console.log('Users collection reference created');
    
    const snapshot = await usersRef.where('accountInfo.email', '==', email).limit(1).get();
    console.log('Query executed');

    if (snapshot.empty) {
      console.log('No user found with email:', email);
      return null;
    }

    const userData = snapshot.docs[0].data();
    console.log('User found:', snapshot.docs[0].id);
    
    return {
      id: snapshot.docs[0].id,
      ...userData
    };
  } catch (error) {
    console.error('Error in findUserByEmail:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to find user by email: ${error.message}`);
  }
};

export const findUserByPhoneNumber = async (phoneNumber) => {
  try {
    console.log('Searching for user with phone number:', phoneNumber);
    const usersRef = db.collection('users');
    
    const snapshot = await usersRef.where('accountInfo.phoneNumber', '==', phoneNumber).limit(1).get();

    if (snapshot.empty) {
      console.log('No user found with phone number:', phoneNumber);
      return null;
    }

    const userData = snapshot.docs[0].data();
    console.log('User found:', snapshot.docs[0].id);
    
    return {
      id: snapshot.docs[0].id,
      ...userData
    };
  } catch (error) {
    console.error('Error in findUserByPhoneNumber:', error);
    throw new Error(`Failed to find user by phone number: ${error.message}`);
  }
};




export const createUser = async (name, email, password, dateOfBirth, phoneNumber, firebaseUid) => {
  try {
    console.log('Creating new user with email:', email);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userDoc = {
      name,
      avatar: null,
      accountInfo: {
        email,
        password: hashedPassword,
        dateOfBirth,
        phoneNumber
      },
      firebaseUid,
      createdAt: new Date().toISOString()
    };

    const userRef = await db.collection('users').add(userDoc);
    console.log('User created with ID:', userRef.id);

    return {
      id: userRef.id,
      ...userDoc,
      accountInfo: {
        ...userDoc.accountInfo,
        password: undefined
      }
    };
  } catch (error) {
    console.error('Error in createUser:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const findUserById = async (id) => {
  try {
    console.log('Searching for user with ID:', id);
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('No user found with ID:', id);
      return null;
    }
    const userData = doc.data();
    console.log('User found by ID:', id);
    return new User(
      doc.id,
      userData.name,
      userData.avatar,
      new AccountInfo(
        userData.accountInfo.dateOfBirth,
        userData.accountInfo.phoneNumber,
        userData.accountInfo.email,
        userData.accountInfo.password
      )
    );
  } catch (error) {
    console.error('Error in findUserById:', error);
    throw new Error(`Failed to find user by ID: ${error.message}`);
  }
};

export const getUserData = async (userId) => {
  try {
    if (!userId) {
      console.error('getUserData called with no userId');
      throw new Error('User ID is required');
    }
    console.log('Attempting to fetch user data for ID:', userId);
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('No user found with the given ID:', userId);
      return null;
    }
    const userData = doc.data();
    console.log('User data retrieved for ID:', userId);
    return { 
      id: doc.id, 
      ...userData, 
      accountInfo: { ...userData.accountInfo, password: undefined } 
    };
  } catch (error) {
    console.error('Error in getUserData:', error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

export const updateUserData = async (userId, updateData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    console.log('Updating user data for ID:', userId);
    console.log('Update data:', updateData);
    const userRef = db.collection('users').doc(userId);
    
    const updateObject = { name: updateData.name };
    
    // Only update accountInfo fields that are provided
    if (Object.keys(updateData.accountInfo).length > 0) {
      Object.keys(updateData.accountInfo).forEach(key => {
        updateObject[`accountInfo.${key}`] = updateData.accountInfo[key];
      });
    }
    
    await userRef.update(updateObject);
    
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    console.log('User data updated for ID:', userId);
    return { 
      id: updatedDoc.id, 
      ...updatedData, 
      accountInfo: { ...updatedData.accountInfo, password: undefined } 
    };
  } catch (error) {
    console.error('Error in updateUserData:', error);
    throw new Error(`Failed to update user data: ${error.message}`);
  }
};




export const updateUserAvatar = async (userId, imageUrl) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    console.log('Updating user avatar for ID:', userId);
    const userRef = db.collection('users').doc(userId);
    await userRef.update({ avatar: imageUrl });
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    console.log('User avatar updated for ID:', userId);
    return { 
      id: updatedDoc.id, 
      ...updatedData, 
      accountInfo: { ...updatedData.accountInfo, password: undefined } 
    };
  } catch (error) {
    console.error('Error in updateUserAvatar:', error);
    throw new Error(`Failed to update user avatar: ${error.message}`);
  }
};

export const removeUserAvatar = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    console.log('Removing user avatar for ID:', userId);
    const userRef = db.collection('users').doc(userId);
    await userRef.update({ avatar: null });
    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();
    console.log('User avatar removed for ID:', userId);
    return { 
      id: updatedDoc.id, 
      ...updatedData, 
      accountInfo: { ...updatedData.accountInfo, password: undefined } 
    };
  } catch (error) {
    console.error('Error in removeUserAvatar:', error);
    throw new Error(`Failed to remove user avatar: ${error.message}`);
  }
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    console.log('Changing password for user ID:', userId);
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log('User not found for ID:', userId);
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    console.log('User data retrieved:', JSON.stringify(userData, null, 2));
    console.log('Stored hashed password:', userData.accountInfo.password);
    console.log('Provided current password:', currentPassword);
    
    console.log('Comparing passwords for user:', userId);
    const isMatch = await bcrypt.compare(currentPassword, userData.accountInfo.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Current password is incorrect for user:', userId);
      throw new Error('Current password is incorrect');
    }

    console.log('Current password verified, hashing new password');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userRef.update({ 'accountInfo.password': hashedNewPassword });

    console.log('Password changed successfully for user ID:', userId);
    return { message: 'Password changed successfully' };
  } catch (error) {
    console.error('Error in changeUserPassword:', error);
    throw error;
  }
};



export const logoutUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    console.log('Logging out user with ID:', userId);
    const userRef = db.collection('users').doc(userId);
    
    // Here you might want to clear any session tokens or update the user's status
    // For this example, we'll just log the logout action
    await userRef.update({ lastLogout: new Date().toISOString() });
    
    console.log('User logged out successfully:', userId);
    return { message: 'User logged out successfully' };
  } catch (error) {
    console.error('Error in logoutUser:', error);
    throw new Error(`Failed to logout user: ${error.message}`);
  }
};

export const storeOTP = async (email, otp) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    
    await db.collection('users').doc(user.id).update({
      'accountInfo.resetOTP': {
        code: otp,
        expirationTime: expirationTime
      }
    });

    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (email, otp, clearIfValid = true) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('User not found during OTP verification');
      return {
        isValid: false,
        message: 'User not found. Please request a new verification code.'
      };
    }

    const resetOTP = user.accountInfo?.resetOTP;
    if (!resetOTP) {
      console.log('No OTP found for user:', email);
      return {
        isValid: false,
        message: 'No verification code found. Please request a new code.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > resetOTP.expirationTime) {
      console.log('OTP has expired for user:', email);
      // Clear expired OTP
      await db.collection('users').doc(user.id).update({
        'accountInfo.resetOTP': null
      });
      return {
        isValid: false,
        message: 'Verification code has expired. Please request a new code.'
      };
    }

    // Strict comparison with the stored OTP
    if (resetOTP.code !== otp) {
      console.log('Invalid OTP provided for user:', email, 'Expected:', resetOTP.code, 'Received:', otp);
      return {
        isValid: false,
        message: 'Incorrect verification code. Please check and try again.'
      };
    }

    // If we get here, OTP is valid
    if (clearIfValid) {
      console.log('Valid OTP provided, clearing OTP for user:', email);
      // Clear the OTP after successful verification
      await db.collection('users').doc(user.id).update({
        'accountInfo.resetOTP': null
      });
    }

    return {
      isValid: true,
      message: 'Code verified successfully'
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      isValid: false,
      message: 'Error verifying code. Please try again.'
    };
  }
};

export const resetPasswordWithOTP = async (email, newPassword) => {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.collection('users').doc(user.id).update({
      'accountInfo.password': hashedPassword
    });

    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export default User;
