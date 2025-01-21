import { 
  generateAIResponse, 
  getProductCategory, 
  formatContactInfo, 
  getWarrantyInfo,
  getAsianCookingInfo,
  getProfessionalEquipmentInfo,
  getSparePartsInfo,
  LUUS_PRODUCT_CATEGORIES
} from '../services/aiService.js';
import { 
  saveChatSession, 
  getChatHistory, 
  getRecentProductInquiries, 
  clearChatHistory, 
  getAllUserIds 
} from '../models/Chat.js';

// Define predefined responses
const predefinedResponses = {
  'product information': {
    response: "Great! Luus Industries specializes in two main categories of commercial kitchen equipment:",
    options: ["Asian Range", "Professional Range"],
    type: 'buttons'
  },
  'asian range': {
    response: getAsianCookingInfo().response,
    externalLink: "https://luus.com.au/range/asian/"
  },
  'professional range': {
    response: getProfessionalEquipmentInfo().response,
    externalLink: "https://luus.com.au/range/professional/"
  },
  'warranty services': {
    response: getWarrantyInfo().response
  },
  'contact & support': {
    response: formatContactInfo().response,
    externalLink: "https://luus.com.au/contact/"
  },
  'spare parts': {
    response: getSparePartsInfo().response,
    externalLink: "https://luus.com.au/spareparts/"
  }
};

// Function to find predefined response
function findPredefinedResponse(userMessage) {
  return predefinedResponses[userMessage];
}

// Active chat sessions
const activeSessions = new Map();

// Welcome message function
export async function sendWelcomeMessage(userId) {
  try {
    if (!userId) {
      console.error('userId is required for welcome message');
      return;
    }

    const welcomeMessage = {
      response: "Hello, I'm your Luus Bot. How can I assist you today!",
      options: [
        "Product Information",
        "Warranty Services",
        "Spare Parts",
        "Contact & Support"
      ],
      type: 'buttons',
      externalLink: "https://luus.com.au/"
    };

    // Save welcome message to chat history
    await saveChatSession(userId, [], welcomeMessage.response);

    return welcomeMessage;
  } catch (error) {
    console.error('Error sending welcome message:', error);
    throw error;
  }
}

export async function handleChat(req, res) {
  console.log('Received chat request. Body:', JSON.stringify(req.body, null, 2));
  try {
    const { messages, userId, isOpenEvent } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Invalid messages format. Expected an array of messages.'
      });
    }

    // Handle new session
    if (isOpenEvent) {
      console.log('Handling chat open event for user:', userId);
      
      // Clear any existing session
      if (activeSessions.has(userId)) {
        console.log('Clearing existing session for user:', userId);
        activeSessions.delete(userId);
      }
      
      // Start new session
      activeSessions.set(userId, {
        startTime: new Date(),
        messageCount: 0
      });

      const welcomeResponse = await sendWelcomeMessage(userId);
      return res.json(welcomeResponse);
    }

    // Validate active session
    if (!activeSessions.has(userId)) {
      return res.status(401).json({ 
        error: 'No active session',
        message: 'Please start a new chat session'
      });
    }

    // Get the last message from the user
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      return res.status(400).json({ 
        error: 'Invalid message format. Expected message to have content.'
      });
    }

    // Update session message count
    const session = activeSessions.get(userId);
    session.messageCount++;
    activeSessions.set(userId, session);

    console.log('Processing message:', lastMessage.content);

    // Try to find a predefined response first
    const predefinedResponse = findPredefinedResponse(lastMessage.content.toLowerCase());
    if (predefinedResponse) {
      await saveChatSession(userId, messages, predefinedResponse.response);
      console.log('Predefined response:', predefinedResponse);
      return res.json(predefinedResponse);
    }

    // If no predefined response, generate AI response
    console.log('Generating AI response');
    const response = await generateAIResponse(messages);
    await saveChatSession(userId, messages, response.response);
    console.log('AI response:', response);
    
    return res.json(response);

  } catch (error) {
    console.error('Error in handleChat:', error);
    return res.status(500).json({
      response: "I apologize for the technical difficulty. Please select from our main services:",
      options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"],
      type: 'buttons'
    });
  }
}

// Helper function to get default options
function getDefaultOptions() {
  return [
    "Product Information",
    "Technical Support",
    "Request Quote",
    "Contact Us"
  ];
}

// Handle user logout - clear their session
export async function clearUserSession(userId) {
  if (activeSessions.has(userId)) {
    console.log('Clearing chat session for user:', userId);
    activeSessions.delete(userId);
  }
}

export async function getChatSessionHistory(req, res) {
  try {
    const { userId } = req.params;
    const history = await getChatHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chat history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function getUserProductInterests(req, res) {
  try {
    const { userId } = req.params;
    const interests = await getRecentProductInquiries(userId);
    res.json(interests);
  } catch (error) {
    console.error('Error fetching user interests:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user interests',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function deleteUserChatHistory(req, res) {
  try {
    const { userId } = req.params;
    await clearChatHistory(userId);
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ 
      error: 'Failed to clear chat history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function getAllUsers(req, res) {
  try {
    const userIds = await getAllUserIds();
    res.json(userIds);
  } catch (error) {
    console.error('Error fetching user IDs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user IDs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
