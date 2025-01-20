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
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    console.error('Error response:', error.response.data);
    errorMessage = error.response.data.message || errorMessage;
  } else if (error.request) {
    console.error('Error request:', error.request);
    errorMessage = 'Server not responding';
  }

  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-credential':
        errorMessage = 'Invalid credentials';
        break;
      case 'auth/user-not-found':
        errorMessage = 'User not found';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email already registered';
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
    
    if (response.data.status !== 'SUCCESS') {
      throw new Error(response.data.message || 'Login failed');
    }

    const { token, user } = response.data;
    
    if (!user || !token) {
      throw new Error('Invalid response from server');
    }

    // Store token
    await AsyncStorage.setItem('authToken', token);
    
    // Store user data
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    await AsyncStorage.setItem('userId', user.id);
      
    return user;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('Server not responding');
    } else {
      console.error('Error message:', error.message);
      throw error;
    }
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
  
export const logout = async ({ userId }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, { userId });
    return response.data;
  } catch (error) {
    throw handleError(error);
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
      throw new Error(error.response.data.message || 'Failed to send code');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('Server not responding');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Request failed');
    }
  }
};

export const verifyCode = async (email, code) => {
  try {
    console.log('Attempting to verify code for email:', email);
    const response = await axios.post(`${API_URL}/auth/verify-reset-code`, { email, code });
    console.log('Verify code response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Verify code error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      throw new Error(error.response.data.message || 'Invalid code');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('Server not responding');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Verification failed');
    }
  }
};

export const resetPassword = async (email, code, newPassword) => {
  try {
    console.log('Attempting password reset for email:', email);
    const response = await axios.post(`${API_URL}/auth/reset-password`, { 
      email, 
      code, 
      newPassword 
    });
    
    if (response.data.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Password reset failed');
    }
  } catch (error) {
    console.error('Password reset error:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Password reset failed');
    } else if (error.request) {
      throw new Error('Server not responding');
    } else {
      throw new Error('Request failed');
    }
  }
};

export { setAuthToken };
