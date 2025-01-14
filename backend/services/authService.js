import bcrypt from 'bcryptjs';
import { admin } from './firebaseAdmin.js';
import * as userModel from '../models/userModel.js';

// Utility function to convert Australian phone number to E.164 format
export const convertToE164 = (phoneNumber) => {
    if (phoneNumber.startsWith('04')) {
        return `+61${phoneNumber.slice(1)}`;
    }
    return phoneNumber; // Return as-is if it's already in E.164 format
};

// Function to validate user input
export const validateUserInput = (name, email, password, dateOfBirth, phoneNumber) => {
    if (!name?.trim()) return { valid: false, message: 'Name is required' };
    if (!email?.trim()) return { valid: false, message: 'Email is required' };
    if (!password || password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
    if (!dateOfBirth) return { valid: false, message: 'Date of birth is required' };
    if (!phoneNumber?.trim() || !/^04\d{8}$/.test(phoneNumber)) return { valid: false, message: 'Invalid phone number format. Please enter a valid Australian mobile number (e.g., 0412345678)' };

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };

    return { valid: true };
};

// Check if the user exists in Firestore and Firebase Auth
export const checkExistingUser = async (email, phoneNumber) => {
    try {
        const userByEmail = await userModel.findUserByEmail(email);
        if (userByEmail) return { exists: true, type: 'email' };

        const userByPhone = phoneNumber ? await userModel.findUserByPhoneNumber(phoneNumber) : null;
        if (userByPhone) return { exists: true, type: 'phone' };

        return { exists: false };
    } catch (error) {
        throw new Error('Error checking existing user');
    }
};

// Create Firebase Auth user
export const createFirebaseUser = async (email, password, name, phoneNumber) => {
    const e164PhoneNumber = convertToE164(phoneNumber);

    try {
        const firebaseUser = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
            phoneNumber: e164PhoneNumber
        });
        return firebaseUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Create user in Firestore
export const createFirestoreUser = async (name, email, password, dateOfBirth, phoneNumber, firebaseUserId) => {
    try {
        const newUser = await userModel.createUser(
            name, email, password, dateOfBirth, phoneNumber, firebaseUserId
        );
        return newUser;
    } catch (error) {
        throw new Error('Error creating user in Firestore');
    }
};

// Check password validity
export const checkPassword = async (user, password) => {
    try {
        const isMatch = await bcrypt.compare(password, user.accountInfo.password);
        return isMatch;
    } catch (error) {
        throw new Error('Error checking password');
    }
};

// Reset user password logic (for forgot-password and reset-password)
export const resetPassword = async (email, newPassword) => {
    try {
        const user = await userModel.findUserByEmail(email);
        if (!user) throw new Error('User not found');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateUserPassword(user.id, hashedPassword); // Assuming this method exists

        return { message: 'Password reset successfully' };
    } catch (error) {
        throw new Error('Error resetting password');
    }
};
