import bcrypt from 'bcrypt';
import { admin, db } from '../services/firebaseAdmin.js';
import { sendWelcomeEmail } from '../services/emailservice.js';
import { sendOTPEmail } from '../services/emailservice.js';
import { clearUserSession, sendWelcomeMessage } from './chatController.js';
import userModel from '../models/userModel.js';

// Function to convert Australian phone number to E.164 format
const convertToE164 = (phoneNumber) => {
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '61' + cleaned.substring(1);
  } else if (cleaned.startsWith('61')) {
    // Already in E.164 format
    return '+' + cleaned;
  }
  return '+' + cleaned;
};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser.accountInfo.email, newUser.name);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Continue with registration even if welcome email fails
    }

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

export const login = async (req, res) => {
  try {
    const { email, password, phoneNumber } = req.body;
    
    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
        status: 'ERROR'
      });
    }

    // Initialize query
    const usersRef = db.collection('users');
    let querySnapshot;

    if (email) {
      console.log('Attempting login with email:', email);
      querySnapshot = await usersRef.where('accountInfo.email', '==', email.toLowerCase()).get();
    } else if (phoneNumber) {
      console.log('Attempting login with phone:', phoneNumber);
      // Try both formatted and unformatted phone numbers
      const formattedPhone = convertToE164(phoneNumber);
      const phoneQuery1 = usersRef.where('accountInfo.phoneNumber', '==', phoneNumber);
      const phoneQuery2 = usersRef.where('accountInfo.phoneNumber', '==', formattedPhone);
      
      const [results1, results2] = await Promise.all([
        phoneQuery1.get(),
        phoneQuery2.get()
      ]);

      if (!results1.empty) {
        querySnapshot = results1;
      } else if (!results2.empty) {
        querySnapshot = results2;
      } else {
        querySnapshot = { empty: true, docs: [] };
      }
    } else {
      return res.status(400).json({
        message: 'Email or phone number is required',
        status: 'ERROR'
      });
    }

    if (querySnapshot.empty) {
      const identifier = email || phoneNumber;
      console.log('No user found with identifier:', identifier);
      return res.status(401).json({
        message: 'Invalid username or password',
        status: 'ERROR'
      });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Verify password using bcrypt
    const storedPassword = userData.accountInfo?.password;
    if (!storedPassword) {
      console.error('No password found for user:', userId);
      return res.status(401).json({
        message: 'Invalid username or password',
        status: 'ERROR'
      });
    }

    const isValidPassword = await bcrypt.compare(password, storedPassword);
    if (!isValidPassword) {
      console.log('Invalid password for user:', userId);
      return res.status(401).json({
        message: 'Invalid username or password',
        status: 'ERROR'
      });
    }

    console.log('Login successful for user:', userId);

    // Create custom token
    const token = await admin.auth().createCustomToken(userId);

    // Prepare user data for response
    const user = {
      id: userId,
      userId: userId,
      name: userData.name,
      email: userData.accountInfo?.email,
      phoneNumber: userData.accountInfo?.phoneNumber,
      dateOfBirth: userData.accountInfo?.dateOfBirth
    };

    // Send welcome message
    try {
      await sendWelcomeMessage(userId);
    } catch (error) {
      console.error('Error sending welcome message:', error);
      // Continue with login even if welcome message fails
    }

    res.json({
      token,
      user,
      userId,
      status: 'SUCCESS',
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'An error occurred during login. Please try again.',
      status: 'ERROR',
      error: error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ 
        message: 'Email is required',
        status: 'ERROR'
      });
    }

    // Find user by email
    const querySnapshot = await db.collection('users')
      .where('accountInfo.email', '==', email.toLowerCase())
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ 
        message: 'User not found',
        status: 'USER_NOT_FOUND'
      });
    }

    const userDoc = querySnapshot.docs[0];

    // Generate a 6-digit OTP
    const generatedOTP = generateOTP();
    
    // Store OTP in database with expiration time
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await userDoc.ref.update({
      'accountInfo.resetOTP': generatedOTP,
      'accountInfo.resetOTPExpiry': new Date(expirationTime).toISOString()
    });

    console.log('Generated and stored OTP for user:', email, 'OTP:', generatedOTP);

    // Send OTP email
    await sendOTPEmail(email, generatedOTP);

    res.json({ 
      message: 'Verification code has been sent to your email',
      status: 'SUCCESS'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Error processing request. Please try again.',
      status: 'ERROR',
      error: error.message
    });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { email, code, otp } = req.body;
    const submittedOTP = otp || code;

    console.log('Verifying OTP for user:', email, 'Submitted OTP:', submittedOTP);

    if (!email?.trim() || !submittedOTP?.trim()) {
      return res.status(400).json({ 
        message: 'Email and code required',
        status: 'ERROR'
      });
    }

    // Get user and their stored OTP
    const querySnapshot = await db.collection('users')
      .where('accountInfo.email', '==', email.toLowerCase())
      .get();

    if (querySnapshot.empty) {
      console.log('User not found:', email);
      return res.status(400).json({ 
        message: 'Invalid code',
        status: 'INVALID_CODE'
      });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const storedOTP = userData.accountInfo?.resetOTP;

    console.log('Stored OTP data:', storedOTP);

    if (!storedOTP) {
      console.log('No OTP found for user:', email);
      return res.status(400).json({ 
        message: 'No code found',
        status: 'INVALID_CODE'
      });
    }

    // Check if OTP has expired
    const otpExpiry = new Date(userData.accountInfo?.resetOTPExpiry);
    if (Date.now() > otpExpiry.getTime()) {
      console.log('OTP expired for user:', email);
      // Clear expired OTP
      await userDoc.ref.update({
        'accountInfo.resetOTP': null,
        'accountInfo.resetOTPExpiry': null
      });
      return res.status(400).json({ 
        message: 'Code expired',
        status: 'INVALID_CODE'
      });
    }

    // Verify exact match with stored OTP
    if (submittedOTP !== storedOTP) {
      console.log('OTP mismatch for user:', email);
      return res.status(400).json({ 
        message: 'Invalid code',
        status: 'INVALID_CODE'
      });
    }

    console.log('OTP verified successfully for user:', email);
    res.json({ 
      message: 'Code verified',
      status: 'SUCCESS',
      email: email
    });
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ 
      message: 'Verification failed',
      status: 'ERROR',
      error: error.message 
    });
  }
};

export const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, code, otp, newPassword } = req.body;
    const submittedOTP = otp || code;

    if (!email?.trim() || !submittedOTP?.trim() || !newPassword) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        status: 'ERROR'
      });
    }

    // Get user document
    const querySnapshot = await db.collection('users')
      .where('accountInfo.email', '==', email.toLowerCase())
      .get();

    if (querySnapshot.empty) {
      return res.status(400).json({ 
        message: 'Invalid code',
        status: 'INVALID_CODE'
      });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const storedOTP = userData.accountInfo?.resetOTP;

    if (!storedOTP) {
      return res.status(400).json({ 
        message: 'No code found',
        status: 'INVALID_CODE'
      });
    }

    // Check if OTP has expired
    const otpExpiry = new Date(userData.accountInfo?.resetOTPExpiry);
    if (Date.now() > otpExpiry.getTime()) {
      await userDoc.ref.update({
        'accountInfo.resetOTP': null,
        'accountInfo.resetOTPExpiry': null
      });
      return res.status(400).json({ 
        message: 'Code expired',
        status: 'INVALID_CODE'
      });
    }

    // Verify exact match with stored OTP
    if (submittedOTP !== storedOTP) {
      console.log('OTP mismatch for user:', email);
      return res.status(400).json({ 
        message: 'Invalid code',
        status: 'INVALID_CODE'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear OTP
    await userDoc.ref.update({
      'accountInfo.password': hashedPassword,
      'accountInfo.resetOTP': null,
      'accountInfo.resetOTPExpiry': null,
      'accountInfo.updatedAt': new Date().toISOString()
    });

    console.log('Password reset successful for user:', email);

    // Return success without sensitive data
    res.json({ 
      message: 'Password reset successful',
      status: 'SUCCESS',
      email: email
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      message: 'Password reset failed',
      status: 'ERROR'
    });
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

export const logoutUser = async (req, res) => {
  try {
    // Get userId from request body since token might be cleared
    const { userId } = req.body;
    
    if (userId) {
      console.log('Clearing chat session for user:', userId);
      await clearUserSession(userId);
      
      // Clear user's chat sessions in database
      const userRef = db.collection('users').doc(userId);
      await userRef.update({
        chatSessions: [],
        lastUpdated: new Date().toISOString()
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Error during logout' });
  }
};
