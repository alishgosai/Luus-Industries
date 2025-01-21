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
  if (!userId) {
    throw new Error('userId is required');
  }
  try {
    console.log('Sending chat open event to:', `${API_URL}/api/chat`);
    console.log('API_URL:', API_URL);
    
    const response = await handleApiRequest('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, messages: [], isOpenEvent: true }),
    });

    // If the server doesn't provide options, use default options
    if (!response.options) {
      response.options = [
        "Product Details",
        "Warranty",
        "Contact Information",
        "Spare Parts"
      ];
    }

    return response;
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
  if (!userId) {
    throw new Error('userId is required');
  }
  try {
    return await handleApiRequest(`/api/chat/history/${userId}`);
  } catch (error) {
    console.error('Error in fetchChatHistory:', error);
    throw error;
  }
};

export const sendChatMessage = async ({ messages, userId, isPartial = false }) => {
  if (!userId) {
    throw new Error('userId is required');
  }

  if (!Array.isArray(messages)) {
    throw new Error('messages must be an array');
  }

  try {
    const response = await handleApiRequest('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        messages,
        isPartial
      }),
    });

    // If the server doesn't provide options, use default options
    if (!response.options) {
      response.options = [
        "Products",
        "Warranty",
        "Spare Parts",
        "Contact Information"
      ];
    }

    return response;
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
};
