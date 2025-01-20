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
  'product details': {
    response: "Great! Luus Industries specializes in two main categories of commercial kitchen equipment:",
    options: ["Asian Range", "Professional Range"]
  },
  'asian range': {
    response: getAsianCookingInfo(),
    externalLink: "https://luus.com.au/range/asian/"
  },
  'professional range': {
    response: getProfessionalEquipmentInfo(),
    externalLink: "https://luus.com.au/range/professional/"
  },
  'warranty': {
    response: getWarrantyInfo()
  },
  'contact information': {
    response: formatContactInfo()
  },
  'spare parts': {
    response: getSparePartsInfo(),
    externalLink: "https://luus.com.au/spareparts/"
  }
};

// Function to find predefined response
function findPredefinedResponse(userMessage) {
  return predefinedResponses[userMessage];
}

// Active user sessions map
const activeSessions = new Map();

// Welcome message function
export async function sendWelcomeMessage(userId) {
  try {
    if (!userId) {
      console.error('userId is required for welcome message');
      return;
    }

    const welcomeMessage = "Welcome to Luus Industries, Australia's leading manufacturer of commercial kitchen equipment. How may I assist you today?";
    const options = [
      "About Us",
      "Product Information",
      "Warranty Services",
      "Contact & Support"
    ];

    // Save welcome message to chat history
    await saveChatSession(userId, [], welcomeMessage);
    console.log('Welcome message saved for new user:', userId);

    return {
      response: welcomeMessage,
      options,
      externalLink: "https://luus.com.au/"
    };
  } catch (error) {
    console.error('Error sending welcome message:', error);
    throw error;
  }
}

export async function handleChat(req, res) {
  console.log('Received chat request. Body:', JSON.stringify(req.body, null, 2));
  try {
    const { messages, userId, isOpenEvent, isPartial } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if this is a new user session
    if (isOpenEvent) {
      console.log('Handling chat open event for user:', userId);
      
      // Clear any existing session for this user
      if (activeSessions.has(userId)) {
        console.log('Clearing existing session for user:', userId);
        activeSessions.delete(userId);
      }
      
      // Start new session
      activeSessions.set(userId, {
        startTime: new Date(),
        messageCount: 0
      });

      try {
        // Send welcome message
        const welcomeResponse = await sendWelcomeMessage(userId);
        return res.json(welcomeResponse);
      } catch (error) {
        console.error('Error saving welcome message:', error);
        return res.json({
          response: "Welcome to Luus Industries. How may I assist you today?",
          options: []
        });
      }
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    // Validate user has active session
    if (!activeSessions.has(userId)) {
      return res.status(401).json({ 
        error: 'No active session',
        message: 'Please start a new chat session'
      });
    }

    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || typeof lastMessage.content !== 'string') {
      return res.status(400).json({ error: 'Invalid last message format' });
    }
    
    if (isPartial) {
      return res.json({
        response: `I'm processing your question about ${lastMessage.content.slice(0, 20)}...`,
        options: []
      });
    }

    if (lastMessage.role === 'user') {
      const userMessage = lastMessage.content.trim();
      console.log('Processing message:', userMessage);
      
      try {
        // Update session message count
        const session = activeSessions.get(userId);
        session.messageCount++;
        activeSessions.set(userId, session);

        // Generate AI response
        console.log('Generating AI response');
        const aiResponse = await generateAIResponse(messages);
        
        if (!aiResponse || typeof aiResponse.response !== 'string') {
          throw new Error('Invalid AI response format');
        }

        // Save the chat session
        await saveChatSession(userId, messages, aiResponse.response);

        return res.json({
          response: aiResponse.response,
          options: aiResponse.options || [],
          externalLink: aiResponse.externalLink
        });

      } catch (error) {
        console.error('Error processing message:', error);
        return res.json({
          response: "I apologize for the technical difficulty. For immediate assistance:\n\n" +
                   "1. Visit our website: https://luus.com.au\n" +
                   "2. Call us: +61 3 9240 6822\n" +
                   "3. Email: info@luus.com.au\n\n" +
                   "Our team is available Monday to Friday, 8:30 AM - 5:00 PM AEST.",
          options: [],
          externalLink: "https://luus.com.au/contact/"
        });
      }
    }

    return res.json({
      response: "I'm here to help you with information about Luus Industries' commercial kitchen equipment. Please feel free to ask any questions.",
      options: []
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again.'
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
