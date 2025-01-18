import { 
  generateAIResponse, 
  getProductCategory, 
  formatContactInfo, 
  getWarrantyInfo 
} from '../services/aiService';
import { 
  saveChatSession, 
  getChatHistory, 
  getRecentProductInquiries, 
  clearChatHistory, 
  getAllUserIds 
} from '../models/Chat';

function getDefaultResponse(message) {
  const lowercaseMessage = message.toLowerCase().trim();
  
  // Greetings
  if (/^(hello|hi|hey|greetings|howdy|hola|bonjour|good (morning|afternoon|evening)|what's up|yo|sup)/.test(lowercaseMessage)) {
    return "Hello! Welcome to Luus Industries. How can I assist you with our commercial kitchen equipment today?";
  }
  
  // Farewells
  if (/^(bye|goodbye|see you|farewell|ciao|adios|take care|until next time)/.test(lowercaseMessage)) {
    return "Thank you for chatting with Luus Industries. If you need any further assistance with our commercial kitchen solutions, please don't hesitate to ask. Have a great day!";
  }
  
  // Gratitude
  if (/^(thanks|thank you|appreciate it|grateful|cheers|much obliged)/.test(lowercaseMessage)) {
    return "You're welcome! At Luus Industries, we're always happy to help. Is there anything else you'd like to know about our commercial kitchen equipment?";
  }
  
  // Product inquiries
  if (/\b(product|equipment|appliance|kitchen|cooktop|oven|fryer|grill|range|refrigerator|dishwasher)\b/.test(lowercaseMessage)) {
    return "Luus Industries offers a wide range of commercial kitchen equipment, including cooktops, ovens, fryers, grills, ranges, refrigerators, and dishwashers. What specific type of equipment are you interested in?";
  }
  
  // Help or assistance
  if (/\b(help|assist|support|guidance|info|information|question)\b/.test(lowercaseMessage)) {
    return "I'm here to help! Whether you need information about our products, warranty details, or have any other questions about Luus Industries, feel free to ask.";
  }

  // Price inquiries
  if (/\b(price|cost|expensive|cheap|affordable|budget)\b/.test(lowercaseMessage)) {
    return "Luus Industries offers competitive pricing on all our commercial kitchen equipment. The cost can vary depending on the specific model and features. Can you tell me which product you're interested in, and I can provide more detailed pricing information?";
  }

  // Quality and durability
  if (/\b(quality|durable|reliable|long-lasting|sturdy)\b/.test(lowercaseMessage)) {
    return "At Luus Industries, we pride ourselves on the high quality and durability of our commercial kitchen equipment. Our products are built to withstand the demands of busy commercial kitchens and are backed by our comprehensive warranty. Is there a specific product you'd like to know more about?";
  }

  // Installation and maintenance
  if (/\b(install|maintenance|repair|service|clean|care)\b/.test(lowercaseMessage)) {
    return "Luus Industries provides comprehensive installation and maintenance services for all our commercial kitchen equipment. We also offer guidance on proper care and cleaning to ensure your equipment performs optimally. Do you need specific information about installation or maintenance for a particular product?";
  }

  // Energy efficiency
  if (/\b(energy|efficient|eco-friendly|green|environmental)\b/.test(lowercaseMessage)) {
    return "Luus Industries is committed to providing energy-efficient commercial kitchen solutions. Many of our products are designed with energy-saving features to help reduce operational costs and environmental impact. Would you like information about our most energy-efficient models?";
  }

  // Customization
  if (/\b(custom|customiz|tailor|specific needs|unique)\b/.test(lowercaseMessage)) {
    return "Luus Industries understands that every kitchen is unique. We offer customization options for many of our products to meet the specific needs of your commercial kitchen. Would you like to discuss how we can tailor our equipment to your requirements?";
  }

  // Unrecognized input
  if (lowercaseMessage.length < 4 || !/^[a-z\s]+$/.test(lowercaseMessage)) {
    return "I'm sorry, but I didn't understand that. Could you please rephrase your question or provide more details about what you need help with regarding Luus Industries' commercial kitchen equipment?";
  }
  
  return null;
}

export async function handleChat(req, res) {
  console.log('Received chat request. Body:', JSON.stringify(req.body, null, 2));
  try {
    const { messages, userId, isOpenEvent } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (isOpenEvent) {
      console.log('Handling chat open event for user:', userId);
      const welcomeMessage = "Hello! 👋 I'm LuusBot, your assistant for Luus Industries commercial kitchen equipment. How can I help you today?";
      await saveChatSession(userId, [], welcomeMessage);
      return res.json({ response: welcomeMessage });
    }

    if (messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }

    const lastMessage = messages[messages.length - 1];
    let aiResponse;

    const defaultResponse = getDefaultResponse(lastMessage.content);
    if (defaultResponse) {
      aiResponse = defaultResponse;
    } else if (lastMessage.role === 'assistant' && lastMessage.content.includes("How can I assist you today?")) {
      aiResponse = "Great! I'm here to help with any questions about Luus Industries' commercial kitchen equipment and services. What would you like to know?";
    } else if (lastMessage.content.toLowerCase().includes('contact')) {
      aiResponse = formatContactInfo();
    } else if (lastMessage.content.toLowerCase().includes('warranty')) {
      aiResponse = getWarrantyInfo();
    } else {
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      aiResponse = await generateAIResponse(formattedMessages);
    }

    await saveChatSession(userId, messages, aiResponse);

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
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

