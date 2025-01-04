import { 
    generateAIResponse, 
    getProductCategory, 
    formatContactInfo, 
    getWarrantyInfo 
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
      const { messages, userId, isOpenEvent } = req.body;
  
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
  
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages format' });
      }
  
      if (isOpenEvent) {
        console.log('Handling chat open event for user:', userId);
        // Handle chat open event
        const welcomeMessage = "Hello! 👋 I'm LuusBot, your virtual assistant for Luus Industries. How can I help you today?";
        await saveChatSession(userId, [], welcomeMessage);
        return res.json({ response: welcomeMessage });
      }
  
      if (messages.length === 0) {
        return res.status(400).json({ error: 'No messages provided' });
      }
  
      const lastMessage = messages[messages.length - 1];
      let aiResponse;
  
      if (lastMessage.role === 'assistant' && lastMessage.content.includes("How can I assist you today?")) {
        aiResponse = "Great! I'm here to help. Please choose one of the options above or ask me any question about Luus Industries products and services.";
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
  
  