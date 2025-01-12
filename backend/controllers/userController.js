import * as userModel from '../models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to sanitize user data
const sanitizeUser = (userData) => {
  if (!userData) return null;
  const { accountInfo, ...sanitizedUser } = userData;
  return {
    ...sanitizedUser,
    accountInfo: accountInfo ? {
      email: accountInfo.email,
      phoneNumber: accountInfo.phoneNumber,
      dateOfBirth: accountInfo.dateOfBirth
    } : null
  };
};

export const getUserById = async (req, res) => {
  console.log('Get user by ID requested');
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const userData = await userModel.getUserData(userId);
    if (userData) {
      console.log('User data retrieved:', JSON.stringify(sanitizeUser(userData), null, 2));
      res.status(200).json(sanitizeUser(userData));
    } else {
      console.log('User data not found for ID:', userId);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

export const getUserProfile = async (req, res) => {
  console.log('User profile requested');
  try {
    const userId = req.params.id || req.user?.id;
    if (!userId) {
      console.log('User ID is missing in the request');
      return res.status(400).json({ message: 'User ID is required' });
    }
    console.log('Fetching user data for ID:', userId);
    const userData = await userModel.getUserData(userId);
    if (userData) {
      console.log('User profile retrieved for ID:', userId);
      res.status(200).json(sanitizeUser(userData));
    } else {
      console.log('User profile not found for ID:', userId);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

export const getAccountInformation = async (req, res) => {
  console.log('Account information requested');
  try {
    const userId = req.user?.id || req.query.userId; // Allow query parameter for testing
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const userData = await userModel.getUserData(userId);
    if (userData && userData.accountInfo) {
      console.log('Account information retrieved for ID:', userId);
      const accountInfo = {
        name: userData.name,
        email: userData.accountInfo.email,
        phoneNumber: userData.accountInfo.phoneNumber,
        dateOfBirth: userData.accountInfo.dateOfBirth,
        avatar: userData.avatar
      };
      res.status(200).json(accountInfo);
    } else {
      console.log('Account information not found for ID:', userId);
      res.status(404).json({ message: 'User not found or account information missing' });
    }
  } catch (error) {
    console.error('Error in getAccountInformation:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

export const updateUserDetails = async (req, res) => {
  console.log('Update user details requested');
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const { name, dateOfBirth, phoneNumber, email } = req.body;
    
    console.log('Updating user details:', { name, dateOfBirth, phoneNumber, email });

    // Prepare the update data
    const updateData = {
      name,
      accountInfo: {}
    };

    // Only include fields that are not undefined
    if (dateOfBirth !== undefined) updateData.accountInfo.dateOfBirth = dateOfBirth;
    if (phoneNumber !== undefined) updateData.accountInfo.phoneNumber = phoneNumber;
    if (email !== undefined) updateData.accountInfo.email = email;

    // Update the user data
    const updatedUser = await userModel.updateUserData(userId, updateData);
    
    console.log('User details updated for ID:', userId);
    res.status(200).json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    res.status(500).json({ message: 'Error updating user details', error: error.message });
  }
};



export const updateProfilePicture = async (req, res) => {
  console.log('Update profile picture requested');
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Received file:', req.file);

    // Create a full URL for the image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    const updatedUser = await userModel.updateUserAvatar(userId, imageUrl);
    if (updatedUser) {
      console.log('Profile picture updated for ID:', userId);
      res.status(200).json({
        success: true,
        avatar: imageUrl,
        message: 'Profile picture updated successfully'
      });
    } else {
      console.log('User not found for profile picture update, ID:', userId);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in updateProfilePicture:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
};

export const removeProfilePicture = async (req, res) => {
  console.log('Remove profile picture requested');
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const updatedUser = await userModel.removeUserAvatar(userId);
    if (updatedUser) {
      console.log('Profile picture removed for ID:', userId);
      res.status(200).json({
        success: true,
        message: 'Profile picture removed successfully',
        user: sanitizeUser(updatedUser)
      });
    } else {
      console.log('User not found for profile picture removal, ID:', userId);
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in removeProfilePicture:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message,
      stack: error.stack
    });
  }
};

export const handleChangePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await changeUserPassword(userId, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in handleChangePassword:', error);
    res.status(400).json({ message: error.message });
  }
};




