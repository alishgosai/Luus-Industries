import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../backend/config/api";

// Helper function to set authentication token
const setAuthToken = async (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await AsyncStorage.setItem('authToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('authToken');
  }
};

// Helper function to handle errors
const handleError = (error) => {
  console.error('API call error:', error);
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.response) {
    console.error('Error response:', error.response.data);
    errorMessage = error.response.data.message || errorMessage;
  } else if (error.request) {
    console.error('Error request:', error.request);
    errorMessage = 'No response received from the server. Please check your internet connection.';
  } else {
    console.error('Error message:', error.message);
  }

  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email/mobile or password. Please check your credentials and try again.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email/mobile. Please check your credentials or sign up.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many unsuccessful login attempts. Please try again later or reset your password.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection and try again.';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already in use. Please use a different email or try logging in.';
        break;
    }
  }
  
  throw new Error(errorMessage);
};

export const login = async (identifier, password) => {
  try {
    console.log('Attempting login with identifier:', identifier);
    console.log('API_URL:', API_URL);
    
    // Determine if the identifier is an email or phone number
    const isEmail = identifier.includes('@');
    const loginData = isEmail 
      ? { email: identifier, password } 
      : { phoneNumber: identifier, password };

    // Backend authentication
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    
    console.log('Backend login response:', response.data);
    const { userId, user } = response.data;
    
    if (userId) {
      // Store user ID
      await AsyncStorage.setItem('userId', userId);
      
      // Store user data
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      return user;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    handleError(error);
  }
};



export const register = async (userData) => {
    try {
      console.log('Attempting registration with data:', { ...userData, password: '[REDACTED]' });
      
      // Backend registration
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      console.log('Backend registration response:', response.data);
      const { user } = response.data;
      
      if (user && user.id) {
        // Store user data
        await AsyncStorage.setItem('userId', user.id);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
        
        return user;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        throw new Error(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw new Error('No response received from the server');
      } else {
        console.error('Error message:', error.message);
        throw new Error('Error setting up the request');
      }
    }
  };
  
export const forgotPassword = async (email) => {
    try {
      console.log('Attempting forgot password for email:', email);
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      console.log('Forgot password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        throw new Error(error.response.data.message || 'Failed to send password reset email');
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw new Error('No response received from the server');
      } else {
        console.error('Error message:', error.message);
        throw new Error('Error setting up the request');
      }
    }
  };
  
export const resetPassword = async (email, code, newPassword) => {
  try {
    console.log('Attempting password reset for email:', email);
    const response = await axios.post(`${API_URL}/auth/reset-password`, { email, code, newPassword });
    console.log('Password reset response:', response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export { setAuthToken };

