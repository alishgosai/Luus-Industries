import { getUserData, updateUserData, updateUserAvatar, removeUserAvatar } from '../models/userModel.js';

export const getUserProfile = (req, res) => {
  console.log('User profile requested');
  res.json(getUserData());
};

export const getAccountInformation = (req, res) => {
  console.log('Account information requested');
  const userData = getUserData();
  res.json({
    name: userData.name,
    avatar: userData.avatar,
    ...userData.accountInfo
  });
};

export const updateUserDetails = (req, res) => {
  console.log('Received request to update user details');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  try {
    const { name, dateOfBirth, phoneNumber, email, password } = req.body;
    updateUserData({ name, dateOfBirth, phoneNumber, email, password });
    res.json({ success: true, message: 'User details updated successfully' });
  } catch (error) {
    console.error('Error in update-user-details:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateProfilePicture = (req, res) => {
  console.log('Received request to update profile picture');
  try {
    if (req.file) {
      console.log('File received:', req.file);
      const imageUrl = `http://192.168.0.23:${process.env.PORT || 3000}/uploads/${req.file.filename}`;
      updateUserAvatar(imageUrl);
      console.log('Profile picture updated:', imageUrl);
      res.json({ success: true, imageUrl });
    } else {
      console.log('No file received');
      res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
  } catch (error) {
    console.error('Error in update-profile-picture:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const removeProfilePicture = (req, res) => {
  console.log('Received request to remove profile picture');
  try {
    removeUserAvatar();
    console.log('Profile picture removed');
    res.json({ success: true });
  } catch (error) {
    console.error('Error in remove-profile-picture:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

