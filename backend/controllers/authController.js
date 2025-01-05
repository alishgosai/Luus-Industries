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
  try {
    console.log('Registration attempt:', { ...req.body, password: '[REDACTED]' });
    const { name, email, password, dateOfBirth, phoneNumber } = req.body;

    // Validate input fields
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of birth is required' });
    }
    if (!phoneNumber?.trim() || !/^04\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number format. Please enter a valid Australian mobile number (e.g., 0412345678)' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user exists in Firestore
    try {
      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
      return res.status(500).json({ 
        message: 'Error checking user existence',
        error: error.message,
        stack: error.stack
      });
    }

    // Convert phone number to E.164 format for Firebase Auth
    const e164PhoneNumber = convertToE164(phoneNumber);

    // Create Firebase Auth user first
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: name,
        phoneNumber: e164PhoneNumber
      });
      console.log('Firebase Auth user created:', firebaseUser.uid);
    } catch (error) {
      console.error('Firebase Auth user creation failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        return res.status(400).json({ 
          message: 'The email address is already in use by another account.',
          error: error.message,
          code: error.code
        });
      }
      return res.status(400).json({ 
        message: 'Error creating user authentication',
        error: error.message,
        code: error.code
      });
    }

    // Create user in Firestore
    try {
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
      // If Firestore creation fails, clean up the Firebase Auth user
      console.error('Firestore user creation failed:', error);
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
        console.log('Cleaned up Firebase Auth user after Firestore failure');
      } catch (cleanupError) {
        console.error('Failed to clean up Firebase Auth user:', cleanupError);
      }
      
      return res.status(500).json({ 
        message: 'Error creating user in database', 
        error: error.message,
        stack: error.stack
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error during registration', 
      error: error.message,
      stack: error.stack
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



export const logout = async (req, res, next) => {
  try {
    // For now, we'll just send a success message
    // In the future, you might want to implement token invalidation or other logout logic
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

