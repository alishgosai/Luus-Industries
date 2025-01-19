import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Ensure the API key is loaded from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
}

export const LUUS_PRODUCT_CATEGORIES = [
  'Cooktops', 'Ovens', 'Fryers', 'Griddles', 'Chargrills', 
  'Salamanders', 'Stockpots', 'Noodle Boxes', 'Pasta Cookers', 
  'Bain Maries', 'Refrigeration', 'Asian', 'Professional'
];

export async function generateAIResponse(messages, options = {}) {
  console.log('Generating AI response with messages:', JSON.stringify(messages, null, 2));
  const {
    model = 'gpt-4-turbo',
    temperature = 0.7,
    maxTokens = 100,
    systemMessage = `You are LuusBot, a helpful virtual assistant for Luus Industries, an Australian manufacturer of commercial kitchen equipment. 
    Key points about Luus Industries:
    - Specializes in high-quality, durable commercial kitchen equipment
    - Product categories: ${LUUS_PRODUCT_CATEGORIES.join(', ')}
    - Offers both gas and electric options for many products
    - Provides custom fabrication services
    - Has a strong focus on Asian-style cooking equipment
    - Offers a range of professional-grade equipment for commercial kitchens
    - Offers warranty and after-sales support

    You help customers with:
    1. Product details and specifications
    2. Warranty details and certifications
    3. Custom fabrication inquiries
    4. Choosing the right equipment for their needs, including Asian-style and professional-grade equipment
    5. Contact information for sales and support
    6. Information about spare parts

    Be professional, concise, and helpful. If you're unsure about specific product details, 
    suggest contacting Luus Industries directly for the most up-to-date information.
    `
  } = options;

  try {
    const conversationWithContext = [
      { role: 'system', content: systemMessage },
      ...messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    console.log('Sending request to OpenAI with conversation:', JSON.stringify(conversationWithContext, null, 2));

    const response = await streamText({
      model: openai(model),
      messages: conversationWithContext,
      temperature,
      maxTokens,
      apiKey: OPENAI_API_KEY,
    });

    if (typeof response.text === 'string') {
      console.log('AI response generated:', response.text);
      return response.text;
    } else if (typeof response.text === 'object' && response.text.then) {
      const fullResponse = await response.text;
      console.log('AI response generated:', fullResponse);
      return fullResponse;
    } else {
      throw new Error('Unexpected response format from streamText');
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response: ' + error.message);
  }
}

export function getProductCategory(productName) {
  return LUUS_PRODUCT_CATEGORIES.find(category => 
    productName.toLowerCase().includes(category.toLowerCase())
  ) || 'Other';
}

export function formatContactInfo() {
  return "How would you like to get in touch with Luus Industries?";
}

export function getWarrantyInfo() {
  return "Luus Industries provides a warranty valid for 5 years after the date of purchase for our products. For specific details about your product's warranty, please contact our customer service team.";
}

export function getAsianCookingInfo() {
  return "Luus Industries offers a comprehensive Asian Range, specializing in high-quality equipment for Asian cuisine. Our range includes wok cookers, waterless stockpots, and other specialized equipment designed to meet the unique needs of Asian cooking styles.";
}

export function getProfessionalEquipmentInfo() {
  return "Luus Industries' Professional Range offers top-tier commercial kitchen equipment designed for high-volume, demanding environments. This includes heavy-duty cooktops, ovens, fryers, and more, all built to withstand the rigors of professional kitchens.";
}

export function getSparePartsInfo() {
  return "Luus Industries offers a wide range of spare parts for our commercial kitchen equipment. To ensure you get the correct parts for your specific model, please visit our website or contact our customer service team for assistance.";
}

export async function handleChatMessage(message, conversationHistory = []) {
  console.log('Handling chat message:', message);
  console.log('Conversation history:', JSON.stringify(conversationHistory, null, 2));

  const lowerCaseMessage = message.toLowerCase();

  // Check for predefined questions first
  if (lowerCaseMessage.includes('product details')) {
    return "Great! Luus Industries specializes in two main categories of commercial kitchen equipment: Asian Range and Professional Range. Which one would you like to know more about?";
  } else if (lowerCaseMessage.includes('asian range')) {
    return getAsianCookingInfo();
  } else if (lowerCaseMessage.includes('professional range')) {
    return getProfessionalEquipmentInfo();
  } else if (lowerCaseMessage.includes('warranty')) {
    return getWarrantyInfo();
  } else if (lowerCaseMessage.includes('contact information')) {
    return formatContactInfo();
  } else if (lowerCaseMessage.includes('spare parts')) {
    return getSparePartsInfo();
  }

  // If not a predefined question, use the AI to generate a response
  const aiMessages = [
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  try {
    console.log('Generating AI response for custom message');
    const aiResponse = await generateAIResponse(aiMessages);
    console.log('AI response for custom message:', aiResponse);
    return aiResponse;
  } catch (error) {
    console.error('Error in handleChatMessage:', error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later or contact our customer support team for assistance.";
  }
}

