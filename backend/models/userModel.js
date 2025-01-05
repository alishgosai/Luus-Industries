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
    throw error;
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
    throw error;
  }
};




export const findUserById = async (id) => {
  try {
    const userRef = db.collection('users').doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('No user found with ID:', id);
      return null;
    }
    const userData = doc.data();
    console.log('User found by ID:', id);
    return new User(
      userData.id,
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
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
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
    throw error;
  }
};

export const updateUserData = async (userId, { name, dateOfBirth, phoneNumber, email }) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const userRef = db.collection('users').doc(userId);
    const updateData = {};
    if (name) updateData.name = name;
    if (dateOfBirth) updateData['accountInfo.dateOfBirth'] = dateOfBirth;
    if (phoneNumber) updateData['accountInfo.phoneNumber'] = phoneNumber;
    if (email) updateData['accountInfo.email'] = email;
    await userRef.update(updateData);
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
    throw error;
  }
};

export const updateUserAvatar = async (userId, imageUrl) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
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
    throw error;
  }
};

export const removeUserAvatar = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
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
    throw error;
  }
};

export default User;

