console.log('userApi.js loaded');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../backend/config/api";

console.log('Imported API_URL in userApi.js:', API_URL);

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchUserProfile = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in AsyncStorage');
    }
    console.log('Fetching user profile for ID:', userId);
    console.log('API URL:', API_URL);

    if (!API_URL) {
      throw new Error('API_URL is not defined');
    }

    const fullUrl = `${API_URL}/user/user-profile/${userId}`;
    console.log('Full request URL:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers.map));

    const data = await handleApiResponse(response);
    console.log('User profile data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error.message === 'Network request failed') {
      console.error('Network error details:', error);
      console.error('Is the server running and accessible?');
      console.error('Is the API_URL correct?');
    }
    throw error;
  }
};

export const updateUserDetails = async (userDetails) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log('Updating user details for ID:', userId);
      console.log('User details to update:', userDetails);
      const response = await fetch(`${API_URL}/user/update-details/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });
      const data = await handleApiResponse(response);
      console.log('User details updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating user details:', error);
      throw error;
    }
  };
  
  

export const updateProfilePicture = async (imageUri) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    console.log('Updating profile picture for ID:', userId);
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile_picture.jpg',
    });

    const response = await fetch(`${API_URL}/user/update-profile-picture/${userId}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const data = await handleApiResponse(response);
    console.log('Profile picture updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

export const removeProfilePicture = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    console.log('Removing profile picture for ID:', userId);
    const response = await fetch(`${API_URL}/user/remove-profile-picture/${userId}`, {
      method: 'DELETE',
    });
    const data = await handleApiResponse(response);
    console.log('Profile picture removed successfully:', data);
    return data;
  } catch (error) {
    console.error('Error removing profile picture:', error);
    throw error;
  }
};

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection');
    console.log('API URL:', API_URL);
    const response = await fetch(`${API_URL}/ping`, {
      method: 'GET',
    });
    console.log('Ping response status:', response.status);
    const data = await handleApiResponse(response);
    console.log('API connection test successful:', data);
    return data;
  } catch (error) {
    console.error('Error testing API connection:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found');
    }
    console.log('Changing password for user ID:', userId);
    const response = await fetch(`${API_URL}/auth/change-password/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await handleApiResponse(response);
    console.log('Password changed successfully');
    return data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    console.log('Attempting to logout user');
    const token = await AsyncStorage.getItem('userToken');
    console.log('User token retrieved:', token);
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('Logout response status:', response.status);

    if (!response.ok) {
      console.error('Logout failed with status:', response.status);
      throw new Error('Logout failed');
    }

    console.log('Clearing AsyncStorage items');
    await AsyncStorage.multiRemove(['userToken', 'userId', 'userData']);

    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
