// In-memory storage for chat history
const chatHistory = new Map();

export function saveChatSession(userId, messages, aiResponse) {
  if (!chatHistory.has(userId)) {
    chatHistory.set(userId, []);
  }
  
  const userHistory = chatHistory.get(userId);
  const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
  const category = getProductCategory(lastUserMessage);
  
  userHistory.push({ 
    messages, 
    aiResponse, 
    timestamp: new Date().toISOString(),
    category
  });
  
  // Keep only the last 10 sessions for each user
  if (userHistory.length > 10) {
    userHistory.shift();
  }
}

export function getChatHistory(userId) {
  return chatHistory.get(userId) || [];
}

export function getRecentProductInquiries(userId) {
  const userHistory = chatHistory.get(userId) || [];
  return userHistory
    .filter(session => session.category !== 'Other')
    .map(session => session.category)
    .reduce((acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
}

export function clearChatHistory(userId) {
  chatHistory.delete(userId);
}

export function getAllUserIds() {
  return Array.from(chatHistory.keys());
}

function getProductCategory(message) {
  // Implement your logic to determine the product category based on the message
  // This is a placeholder implementation
  return 'Other';
}

