import OpenAI from 'openai';

// Ensure the API key is loaded from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in the environment variables');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const LUUS_PRODUCT_CATEGORIES = [
  'Cooktops', 'Ovens', 'Fryers', 'Griddles', 'Chargrills', 
  'Salamanders', 'Stockpots', 'Noodle Boxes', 'Pasta Cookers', 
  'Bain Maries', 'Refrigeration', 'Asian', 'Professional'
];

// Predefined responses for common queries
const PREDEFINED_RESPONSES = {
  greeting: {
    response: "Hello, I'm your Luus Bot. How can I assist you today!",
    options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"],
    type: 'buttons'
  },
  products: {
    response: "Great! Luus Industries specializes in two main categories of commercial kitchen equipment:",
    options: ["Asian Range", "Professional Range"],
    type: 'buttons'
  },
  'asian range': {
    response: "Our Asian Range includes specialized equipment for Asian cuisine:\n\n" +
              "• Waterless Wok Cookers\n" +
              "• Chimney Burners\n" +
              "• Combination Burners\n" +
              "• Dim Sum Steamers\n\n" +
              "Would you like to learn more about specific products?",
    externalLink: "https://luus.com.au/range/asian/"
  },
  'professional range': {
    response: "Our Professional Range includes premium commercial kitchen equipment:\n\n" +
              "• Cooktops & Ranges\n" +
              "• Ovens & Grills\n" +
              "• Fryers & Griddles\n" +
              "• Warmers & Holders\n\n" +
              "Would you like to learn more about specific products?",
    externalLink: "https://luus.com.au/range/professional/"
  },
  warranty: {
    response: "Luus offers comprehensive warranty coverage:\n\n" +
              "• 12-month parts and labor warranty\n" +
              "• Extended warranty options available\n" +
              "• Australia-wide service network\n\n" +
              "How can we help with your warranty needs?"
  },
  'spare parts': {
    response: "Need spare parts for your Luus equipment?\n\n" +
              "• Quick parts identification\n" +
              "• Genuine Luus parts\n" +
              "• Australia-wide delivery\n\n" +
              "How can we assist with your parts needs?",
    externalLink: "https://luus.com.au/spareparts/"
  },
  contact: {
    response: "Here's how you can reach us:\n\n" +
              "📞 Phone: +61 3 9240 6822\n" +
              "📧 Email: info@luus.com.au\n" +
              "🏢 Address: 72-74 Quantum Close, Dandenong South VIC 3175\n\n" +
              "Business Hours: Monday to Friday, 8:30 AM - 5:00 PM AEST",
    externalLink: "https://luus.com.au/contact/"
  }
};

// Product categories
export const PRODUCT_CATEGORIES = {
  ASIAN: 'Asian',
  PROFESSIONAL: 'Professional',
  OTHER: 'Other'
};

/**
 * Determines the product category based on the message content
 * @param {string} message - The user's message
 * @returns {string} - The determined product category
 */
export function getProductCategory(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('wok') || 
      lowerMessage.includes('asian') || 
      lowerMessage.includes('noodle') || 
      lowerMessage.includes('dim sum') ||
      lowerMessage.includes('stockpot')) {
    return PRODUCT_CATEGORIES.ASIAN;
  }
  
  if (lowerMessage.includes('oven') || 
      lowerMessage.includes('cooktop') || 
      lowerMessage.includes('fryer') || 
      lowerMessage.includes('grill') ||
      lowerMessage.includes('professional')) {
    return PRODUCT_CATEGORIES.PROFESSIONAL;
  }
  
  return PRODUCT_CATEGORIES.OTHER;
}

// Knowledge base for contextual information
const KNOWLEDGE_BASE = {
  company: {
    name: "Luus Industries",
    address: "250 Fairbairn Road, Sunshine West, VIC 3020, Australia",
    phone: "+61 3 9240 6822",
    abn: "94 082 257 734",
    website: "https://luus.com.au",
    businessHours: "Monday to Friday: 8:30 AM - 5:00 PM AEST",
    emails: {
      sales: "sales@luus.com.au",
      support: "support@luus.com.au",
      parts: "parts@luus.com.au",
      info: "info@luus.com.au"
    }
  },
  products: {
    asian: {
      categories: ["Wok Cookers", "Waterless Stockpots", "Noodle Stations", "Dim Sum Steamers"],
      features: ["High-power burners", "Water-cooled systems", "Custom configurations"]
    },
    professional: {
      cooking: ["Ranges", "Ovens", "Fryers", "Griddles", "Chargrills"],
      preparation: ["Salamanders", "Bain Maries", "Work Benches", "Refrigeration"]
    },
    custom: {
      services: ["Custom designs", "Stainless steel fabrication", "Kitchen planning"]
    }
  },
  warranty: {
    standard: {
      duration: "2 years",
      coverage: ["Parts", "Labor", "Manufacturing defects", "Operational issues"]
    },
    extended: {
      options: ["Additional coverage", "Preventive maintenance", "Priority support"]
    }
  }
};

// Helper function to extract context from conversation
function extractContext(messages) {
  const context = {
    topics: new Set(),
    products: new Set(),
    concerns: new Set(),
    previousResponses: []
  };

  messages.forEach(msg => {
    // Validate message content
    if (!msg || typeof msg.content !== 'string') {
      console.warn('Invalid message format in context extraction:', msg);
      return;
    }

    const text = msg.content.toLowerCase();
    
    // Extract topics
    if (text.includes('warranty') || text.includes('guarantee')) context.topics.add('warranty');
    if (text.includes('price') || text.includes('cost')) context.topics.add('pricing');
    if (text.includes('contact') || text.includes('reach')) context.topics.add('contact');
    if (text.includes('repair') || text.includes('fix')) context.topics.add('support');
    
    // Extract products
    if (text.includes('wok') || text.includes('asian')) context.products.add('asian');
    if (text.includes('oven') || text.includes('cooktop')) context.products.add('cooking');
    if (text.includes('refrigeration') || text.includes('prep')) context.products.add('preparation');
    
    // Extract concerns
    if (text.includes('urgent') || text.includes('emergency')) context.concerns.add('urgent');
    if (text.includes('budget') || text.includes('expensive')) context.concerns.add('budget');
    if (text.includes('quality') || text.includes('reliable')) context.concerns.add('quality');
    
    // Store previous responses
    if (msg.role === 'assistant' && msg.content) {
      context.previousResponses.push(msg.content);
    }
  });

  return context;
}

// Helper function to generate dynamic response
function generateDynamicResponse(userMessage, context) {
  // Validate input
  if (typeof userMessage !== 'string') {
    console.warn('Invalid userMessage in generateDynamicResponse:', userMessage);
    return null;
  }

  const message = userMessage.toLowerCase();
  let response = '';
  let externalLink = KNOWLEDGE_BASE.company.website;

  // Build response based on context
  if (context.topics.has('warranty') && context.products.size > 0) {
    response = `Regarding warranty for our ${Array.from(context.products).join(' and ')} equipment:\n\n`;
    response += `• Standard ${KNOWLEDGE_BASE.warranty.standard.duration} warranty covering ${KNOWLEDGE_BASE.warranty.standard.coverage.join(', ')}\n`;
    response += `• Extended options include ${KNOWLEDGE_BASE.warranty.extended.options.join(', ')}\n\n`;
  }

  if (context.topics.has('pricing') && context.concerns.has('budget')) {
    response += "We offer competitive pricing and flexible payment options. Our sales team can provide detailed quotes and discuss financing solutions that match your budget.\n\n";
  }

  // Add product-specific information
  Array.from(context.products).forEach(product => {
    if (KNOWLEDGE_BASE.products[product]) {
      const productInfo = KNOWLEDGE_BASE.products[product];
      response += `\nOur ${product} range includes:\n`;
      Object.entries(productInfo).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          response += `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value.join(', ')}\n`;
        }
      });
    }
  });

  // Add contact information footer to all responses
  if (response) {
    response += `\nFor more detailed information and assistance:\n`;
    response += `• Call us: ${KNOWLEDGE_BASE.company.phone}\n`;
    response += `• Email: ${KNOWLEDGE_BASE.company.emails.info}\n`;
    response += `• Business Hours: ${KNOWLEDGE_BASE.company.businessHours}`;

    return {
      response,
      options: [],
      externalLink
    };
  }

  return null; // Let OpenAI handle it
}

export async function generateAIResponse(messages) {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format');
    }

    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    // Check for predefined responses first
    const predefinedResponse = findPredefinedResponse(lastMessage);
    if (predefinedResponse) {
      return predefinedResponse;
    }

    // Handle greetings
    if (lastMessage.includes('hi') || lastMessage.includes('hello') || lastMessage.includes('hey')) {
      return {
        response: "Hello, I'm your Luus Bot. How can I assist you today!",
        options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"],
        type: 'buttons'
      };
    }

    // Handle product inquiries
    if (lastMessage.includes('product') || lastMessage.includes('equipment') || lastMessage.includes('range')) {
      return {
        response: "We offer two main product ranges. Which would you like to learn more about?",
        options: ["Asian Range", "Professional Range"],
        type: 'buttons'
      };
    }

    // If no pattern matches, return a default response with options
    return {
      response: "I can help you with information about our products, warranty, spare parts, or contact details. What would you like to know?",
      options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"],
      type: 'buttons'
    };

  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      response: "I apologize for the technical difficulty. Please select from our main services:",
      options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"],
      type: 'buttons'
    };
  }
}

export function findPredefinedResponse(message) {
  // Convert message to lowercase for case-insensitive matching
  const normalizedMessage = message.toLowerCase();

  // Check exact matches first
  for (const [key, response] of Object.entries(PREDEFINED_RESPONSES)) {
    if (normalizedMessage === key) {
      return response;
    }
  }

  // Check partial matches
  for (const [key, response] of Object.entries(PREDEFINED_RESPONSES)) {
    if (normalizedMessage.includes(key)) {
      return response;
    }
  }

  return null;
}

export async function handleChatMessage(message, conversationHistory = []) {
  const lowerCaseMessage = message.toLowerCase();

  // Handle Asian Range selection
  if (lowerCaseMessage.includes('asian range') || lowerCaseMessage.includes('asian product')) {
    return {
      response: "Our Asian Range includes specialized equipment for Asian cuisine:\n\n" +
                "• Waterless Wok Cookers\n" +
                "• Chimney Burners\n" +
                "• Combination Burners\n" +
                "• Dim Sum Steamers\n\n" +
                "Would you like to learn more about specific products?",
      externalLink: "https://luus.com.au/range/asian/",
      type: 'text'
    };
  }

  // Handle Professional Range selection
  if (lowerCaseMessage.includes('professional range') || lowerCaseMessage.includes('professional product')) {
    return {
      response: "Our Professional Range includes premium commercial kitchen equipment:\n\n" +
                "• Cooktops & Ranges\n" +
                "• Ovens & Grills\n" +
                "• Fryers & Griddles\n" +
                "• Warmers & Holders\n\n" +
                "Would you like to learn more about specific products?",
      externalLink: "https://luus.com.au/range/professional/",
      type: 'text'
    };
  }

  // Try AI response for other queries
  try {
    const aiResponse = await generateAIResponse([...conversationHistory, { role: 'user', content: message }]);
    
    // Only add default options if it's not a specific category response
    if (!aiResponse.type && !aiResponse.options && 
        !lowerCaseMessage.includes('warranty') && 
        !lowerCaseMessage.includes('spare parts') && 
        !lowerCaseMessage.includes('contact')) {
      return {
        ...aiResponse,
        type: 'buttons',
        options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"]
      };
    }
    
    return aiResponse;
  } catch (error) {
    console.error('Error in handleChatMessage:', error);
    return {
      response: "I apologize for the inconvenience. Please select from our main services:",
      options: ["Product Information", "Warranty Services", "Spare Parts", "Contact & Support"],
      type: 'buttons'
    };
  }
}

export function formatContactInfo() {
  return {
    response: "Contact Luus Industries:\n\n" +
              "📍 Head Office:\n" +
              "250 Fairbairn Road\n" +
              "Sunshine West, VIC 3020\n" +
              "Australia\n\n" +
              "📞 Phone: " + KNOWLEDGE_BASE.company.phone + "\n" +
              "📧 Email: " + KNOWLEDGE_BASE.company.emails.sales + "\n\n" +
              "🕒 Business Hours:\n" +
              KNOWLEDGE_BASE.company.businessHours,
    options: ["Request Quote", "Technical Support", "Find Dealer"],
    type: 'contact'
  };
}

export function getWarrantyInfo() {
  return {
    response: "Luus Industries Warranty Coverage:\n\n" +
              "• Duration: " + KNOWLEDGE_BASE.warranty.standard.duration + "\n" +
              "• Coverage: " + KNOWLEDGE_BASE.warranty.standard.coverage.join(', ') + "\n" +
              "• Extended Options: " + KNOWLEDGE_BASE.warranty.extended.options.join(', ') + "\n\n" +
              "For specific details about your product's warranty, please contact our customer service team.",
    type: 'warranty'
  };
}

export function getAsianCookingInfo() {
  const asianProducts = KNOWLEDGE_BASE.products.asian;
  return {
    response: "Our Asian Range includes specialized equipment for Asian cuisine:\n\n" +
              "Categories:\n" + asianProducts.categories.map(cat => "• " + cat).join('\n') + "\n\n" +
              "Features:\n" + asianProducts.features.map(feat => "• " + feat).join('\n'),
   
    externalLink: "https://luus.com.au/range/asian/"
  };
}

export function getProfessionalEquipmentInfo() {
  const profProducts = KNOWLEDGE_BASE.products.professional;
  return {
    response: "Our Professional Range includes:\n\n" +
              "Cooking Equipment:\n" + profProducts.cooking.map(item => "• " + item).join('\n') + "\n\n" +
              "Preparation Equipment:\n" + profProducts.preparation.map(item => "• " + item).join('\n'),
 
    externalLink: "https://luus.com.au/range/professional/"
  };
}

export function getSparePartsInfo() {
  return {
    response: "Genuine Luus Parts & Support:\n\n" +
              "• Original manufacturer parts\n" +
              "• Technical documentation\n" +
              "• Installation guides\n" +
              "• Service manuals\n\n" +
              "Contact our parts department:\n" +
              "📞 " + KNOWLEDGE_BASE.company.phone + "\n" +
              "✉️ " + KNOWLEDGE_BASE.company.emails.parts,
    
    externalLink: "https://luus.com.au/spareparts/"
  };
}

// Error responses
const ERROR_RESPONSES = {
  quota: "I apologize for the inconvenience. Our systems are currently experiencing high demand. Please:\n\n" +
         "1. Visit our product catalog at https://luus.com.au\n" +
         "2. Contact our sales team at 1300 585 666\n" +
         "3. Email us at info@luus.com.au for detailed information\n\n" +
         "A representative will assist you promptly.",
  timeout: "I apologize for the delay in our response. For immediate assistance:\n\n" +
           "• Call our support team: 1300 585 666\n" +
           "• Email: info@luus.com.au\n" +
           "• Visit: https://luus.com.au\n\n" +
           "Our team is available Monday to Friday, 8:30 AM - 5:00 PM AEST.",
  generic: "We're currently experiencing technical difficulties. For immediate assistance:\n\n" +
           "1. Call our support team: 1300 585 666\n" +
           "2. Email us: info@luus.com.au\n" +
           "3. Browse our online catalog: https://luus.com.au\n\n" +
           "We appreciate your patience and understanding."
};