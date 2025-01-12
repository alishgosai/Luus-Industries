import { API_URL } from "../backend/config/api";

const handleApiRequest = async (endpoint, options) => {
  if (!API_URL) {
    throw new Error('API_URL is not defined. Please check your configuration.');
  }

  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }
  return response.json();
};

export const sendChatOpenEvent = async (userId) => {
  try {
    console.log('Sending chat open event to:', `${API_URL}/api/chat`);
    console.log('API_URL:', API_URL);
    
    return await handleApiRequest('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, messages: [], isOpenEvent: true }),
    });
  } catch (error) {
    console.error('Error in sendChatOpenEvent:', error);
    console.error('Error details:', error.message);
    if (error.cause) {
      console.error('Error cause:', error.cause);
    }
    throw error;
  }
};

export const fetchChatHistory = async (userId) => {
  try {
    return await handleApiRequest(`/api/chat/history/${userId}`);
  } catch (error) {
    console.error('Error in fetchChatHistory:', error);
    throw error;
  }
};

export const sendChatMessage = async (messages, userId) => {
  try {
    return await handleApiRequest('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        messages,
        userId
      }),
    });
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};

