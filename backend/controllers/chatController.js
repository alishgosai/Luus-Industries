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

export async function handleChat(req, res) {
  console.log('Received chat request. Body:', JSON.stringify(req.body, null, 2));
  try {
    const { messages, userId, isOpenEvent, isPartial } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (isOpenEvent) {
      console.log('Handling chat open event for user:', userId);
      const welcomeMessage = "Hello! 👋 I'm LuusBot, How can I help you today?";
      const options = [
        "Product Details",
        "Warranty",
        "Contact Information",
        "Spare Parts"
      ];
      try {
        await saveChatSession(userId, [], welcomeMessage);
        return res.json({ response: welcomeMessage, options });
      } catch (error) {
        console.error('Error saving welcome message:', error);
        return res.json({ response: welcomeMessage, options }); // Continue even if save fails
      }
    }

    if (messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const lastMessage = messages[messages.length - 1];
    let aiResponse;
    let options;
    let externalLink;

    if (isPartial) {
      aiResponse = `I'm listening... You're asking about ${lastMessage.content.slice(0, 20)}...`;
    } else if (lastMessage.role === 'user') {
      const userMessage = lastMessage.content.toLowerCase();
      console.log('Processing message:', userMessage);
      
      try {
        switch (userMessage) {
          case 'product details':
            aiResponse = "Great! Luus Industries specializes in two main categories of commercial kitchen equipment:";
            options = ["Asian Range", "Professional Range"];
            break;
          case 'asian range':
            aiResponse = getAsianCookingInfo();
            externalLink = "https://luus.com.au/range/asian/";
            break;
          case 'professional range':
            aiResponse = getProfessionalEquipmentInfo();
            externalLink = "https://luus.com.au/range/professional/";
            break;
          case 'warranty':
            aiResponse = getWarrantyInfo();
            break;
          case 'contact information':
            aiResponse = formatContactInfo();
            break;
          case 'spare parts':
            aiResponse = getSparePartsInfo();
            externalLink = "https://luus.com.au/spareparts/";
            break;
          default:
            console.log('Generating AI response for custom message');
            aiResponse = await generateAIResponse(messages);
            console.log('AI response generated:', aiResponse);
            const category = getProductCategory(userMessage);
            if (category !== 'Other') {
              options = LUUS_PRODUCT_CATEGORIES.filter(cat => cat !== category);
            } else {
              options = [
                "Product Details",
                "Warranty",
                "Contact Information",
                "Spare Parts"
              ];
            }
            aiResponse += "\n\nIs there a specific category or topic you'd like more information about?";
        }
        
        console.log('Final response:', { response: aiResponse, options, externalLink });

        try {
          await saveChatSession(userId, messages, aiResponse);
        } catch (error) {
          console.error('Error saving chat session:', error);
          // Continue with the response even if saving fails
        }
        
        return res.json({ response: aiResponse, options, externalLink });
      } catch (error) {
        console.error('Error processing message:', error);
        return res.status(500).json({ 
          error: 'Failed to process chat message',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    } else {
      return res.status(400).json({ error: 'Last message must be from user' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

