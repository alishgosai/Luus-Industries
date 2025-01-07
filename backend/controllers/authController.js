import * as userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { admin } from '../services/firebaseAdmin.js';

// Function to convert Australian phone number to E.164 format
const convertToE164 = (phoneNumber) => {
  if (phoneNumber.startsWith('04')) {
    return `+61${phoneNumber.slice(1)}`;
  }
  return phoneNumber; // Return as-is if it's already in E.164 format
};

export const register = async (req, res, next) => {
  console.log('Received registration request');
  console.log('Request body:', req.body);
  let firebaseUser;
  try {
    console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });
    const { name, email, password, dateOfBirth, phoneNumber } = req.body;

    // Validate input fields
    if (!name?.trim()) {
      console.log('Registration failed:', { message: 'Name is required' });
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email?.trim()) {
      console.log('Registration failed:', { message: 'Email is required' });
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      console.log('Registration failed:', { message: 'Password must be at least 6 characters' });
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (!dateOfBirth) {
      console.log('Registration failed:', { message: 'Date of birth is required' });
      return res.status(400).json({ message: 'Date of birth is required' });
    }
    if (!phoneNumber?.trim() || !/^04\d{8}$/.test(phoneNumber)) {
      console.log('Registration failed:', { message: 'Invalid phone number format. Please enter a valid Australian mobile number (e.g., 0412345678)' });
      return res.status(400).json({ message: 'Invalid phone number format. Please enter a valid Australian mobile number (e.g., 0412345678)' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Registration failed:', { message: 'Invalid email format' });
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists in Firestore first
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      console.log('Registration failed:', { message: 'User already exists in the database' });
      return res.status(400).json({ message: 'User already exists in the database' });
    }

    // Check if user exists in Firebase Auth
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      if (userRecord) {
        console.log('Registration failed:', { message: 'The email address is already in use by another account.', code: 'auth/email-already-exists' });
        return res.status(400).json({ 
          message: 'The email address is already in use by another account.',
          code: 'auth/email-already-exists'
        });
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        console.error('Error checking existing user in Firebase:', error);
        throw error;
      }
    }

    // Convert phone number to E.164 format for Firebase Auth
    const e164PhoneNumber = convertToE164(phoneNumber);

    // Create Firebase Auth user
    try {
      firebaseUser = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
        phoneNumber: e164PhoneNumber
      });
      console.log('Firebase Auth user created:', firebaseUser.uid);
    } catch (firebaseError) {
      console.error('Error creating Firebase user:', firebaseError);
      return res.status(400).json({ 
        message: firebaseError.message,
        code: firebaseError.code
      });
    }

    // Create user in Firestore
    const newUser = await userModel.createUser(
      name, 
      email, 
      password, 
      dateOfBirth, 
      phoneNumber,
      firebaseUser.uid
    );

    console.log('User registered successfully:', newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        uid: firebaseUser.uid,
        name: newUser.name,
        email: newUser.accountInfo.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // If Firebase user was created but Firestore creation failed, clean up the Firebase Auth user
    if (firebaseUser) {
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
        console.log('Cleaned up Firebase Auth user after registration failure');
      } catch (cleanupError) {
        console.error('Failed to clean up Firebase Auth user:', cleanupError);
      }
    }

    res.status(500).json({ 
      message: 'Error during registration', 
      error: error.message,
      code: error.code || 'unknown_error'
    });
  }
};




export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user;
    try {
      user = await userModel.findUserByEmail(email);
    } catch (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ message: 'Error finding user', error: error.message });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.accountInfo.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Logged in successfully',
      user: { id: user.id, name: user.name, email: user.accountInfo.email },
      userId: user.id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'User ID, current password, and new password are required' });
    }

    try {
      const result = await userModel.changeUserPassword(userId, currentPassword, newPassword);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: 'User not found' });
      } else if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ message: 'Current password is incorrect' });
      } else {
        console.error('Unexpected error during password change:', error);
        return res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  } catch (error) {
    console.error('Error in changePassword controller:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




export const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};


