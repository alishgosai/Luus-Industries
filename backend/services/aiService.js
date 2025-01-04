import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const LUUS_PRODUCT_CATEGORIES = [
  'Cooktops', 'Ovens', 'Fryers', 'Griddles', 'Chargrills', 
  'Salamanders', 'Stockpots', 'Noodle Boxes', 'Pasta Cookers', 
  'Bain Maries', 'Refrigeration'
];

export async function generateAIResponse(messages, options = {}) {
  const {
    model = 'gpt-4-turbo',
    temperature = 0.7,
    maxTokens = 500,
    systemMessage = `You are LuusBot, a helpful virtual assistant for Luus Industries, an Australian manufacturer of commercial kitchen equipment. 
    Key points about Luus Industries:
    - Specializes in high-quality, durable commercial kitchen equipment
    - Product categories: ${LUUS_PRODUCT_CATEGORIES.join(', ')}
    - Offers both gas and electric options for many products
    - Provides custom fabrication services
    - Has a strong focus on Asian-style cooking equipment
    - Offers warranty and after-sales support

    You help customers with:
    1. Product details and specifications
    2. Installation and maintenance information
    3. Warranty details and certifications
    4. Custom fabrication inquiries
    5. Choosing the right equipment for their needs
    6. Contact information for sales and support

    Be professional, concise, and helpful. If you're unsure about specific product details, 
    suggest contacting Luus Industries directly at info@luus.com.au or +61 3 9240 6822.
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

    const result = await streamText({
      model: openai(model),
      messages: conversationWithContext,
      temperature,
      maxTokens,
    });

    return result.text;
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
  return `
    For more information or assistance, you can contact Luus Industries:
    - Email: info@luus.com.au
    - Phone: +61 3 9240 6822
    - Website: https://luus.com.au
  `;
}

export function getWarrantyInfo() {
  return `
    Luus Industries offers warranty on their products. The standard warranty period may vary depending on the product. 
    For specific warranty information on your Luus product, please refer to your product documentation or contact Luus Industries directly.
  `;
}

