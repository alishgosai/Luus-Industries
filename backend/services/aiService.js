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
    response: "Welcome to Luus Industries, Australia's leading manufacturer of commercial kitchen equipment. As your virtual assistant, I'm here to help you discover our comprehensive range of professional catering solutions. How may I assist you today?",
    options: ["About Us", "Product Information", "Warranty Services", "Contact & Support"]
  },
  about: {
    response: "About Luus Industries:\n\n" +
              "Founded in Australia, Luus Industries is a premier manufacturer of commercial kitchen equipment, committed to excellence in every aspect:\n\n" +
              "Our Mission:\n" +
              "• Leading manufacturer and solutions provider of commercial catering equipment in Australia\n" +
              "• Dedicated to innovation and quality in commercial kitchen solutions\n" +
              "• Committed to sustainability and supporting local communities\n\n" +
              "Our Expertise:\n" +
              "• Specialized in Asian-style cooking equipment\n" +
              "• Full range of professional kitchen solutions\n" +
              "• Custom fabrication capabilities\n" +
              "• Australian-made quality\n\n" +
              "Location & Facilities:\n" +
              "• Headquarters: 250 Fairbairn Road, Sunshine West, VIC 3020\n" +
              "• Modern manufacturing facility\n" +
              "• Extensive R&D capabilities\n" +
              "• Nationwide distribution network",
    options: ["Product Range", "Contact Sales", "View Catalogue"],
    externalLink: "https://luus.com.au/about/"
  },
  contact: {
    response: "Contact Luus Industries:\n\n" +
              "Head Office:\n" +
              "📍 250 Fairbairn Road, Sunshine West, VIC 3020, Australia\n" +
              "📞 +61 3 9240 6822\n" +
              "🌐 https://luus.com.au\n" +
              "📱 ABN: 94 082 257 734\n\n" +
              "Business Hours:\n" +
              "Monday to Friday: 8:30 AM - 5:00 PM AEST\n\n" +
              "Departments:\n" +
              "• Sales Inquiries: sales@luus.com.au\n" +
              "• Technical Support: support@luus.com.au\n" +
              "• Spare Parts: parts@luus.com.au\n" +
              "• General Inquiries: info@luus.com.au",
    options: ["Request Quote", "Technical Support", "Find Dealer"],
    externalLink: "https://luus.com.au/contact/"
  },
  products: {
    response: "Luus Industries Professional Kitchen Equipment:\n\n" +
              "Asian Specialty Range:\n" +
              "• Professional Wok Cookers\n" +
              "  - Single, double, and triple burner options\n" +
              "  - High-power burner systems\n" +
              "  - Waterless or water-cooled designs\n\n" +
              "• Specialty Equipment:\n" +
              "  - Waterless Stockpots\n" +
              "  - Noodle Cooking Stations\n" +
              "  - Dim Sum Steamers\n\n" +
              "Professional Kitchen Series:\n" +
              "• Cooking Equipment:\n" +
              "  - Commercial Ranges\n" +
              "  - Professional Ovens\n" +
              "  - Deep Fryers\n" +
              "  - Griddles & Chargrills\n\n" +
              "• Food Preparation:\n" +
              "  - Salamanders\n" +
              "  - Bain Maries\n" +
              "  - Work Benches\n" +
              "  - Refrigeration Units\n\n" +
              "Custom Solutions:\n" +
              "• Tailored designs for specific requirements\n" +
              "• Stainless steel fabrication\n" +
              "• Commercial kitchen planning",
    options: ["Request Specifications", "View Catalogue", "Custom Quote"],
    externalLink: "https://luus.com.au/products/"
  },
  warranty: {
    response: "Luus Industries Warranty Coverage:\n\n" +
              "Standard Warranty:\n" +
              "• Duration: 12 months comprehensive coverage\n" +
              "• Scope: Parts and labor\n" +
              "• Coverage: Manufacturing defects and operational issues\n\n" +
              "Extended Protection:\n" +
              "• Additional coverage options available\n" +
              "• Preventive maintenance plans\n" +
              "• Priority technical support\n\n" +
              "Warranty Process:\n" +
              "1. Register your product\n" +
              "2. Contact technical support\n" +
              "3. Provide product details:\n" +
              "   - Serial number\n" +
              "   - Purchase date\n" +
              "   - Dealer information\n\n" +
              "For warranty claims or inquiries:\n" +
              "📞 +61 3 9240 6822\n" +
              "✉️ warranty@luus.com.au",
    options: ["Register Product", "Technical Support", "Maintenance Guide"],
    externalLink: "https://luus.com.au/warranty/"
  },
  spareparts: {
    response: "Genuine Luus Parts & Maintenance:\n\n" +
              "Parts Catalog:\n" +
              "• Complete range of genuine parts\n" +
              "• OEM specifications\n" +
              "• Quality-tested components\n\n" +
              "Support Services:\n" +
              "• Technical documentation\n" +
              "• Installation guides\n" +
              "• Maintenance schedules\n" +
              "• Service manuals\n\n" +
              "Ordering Process:\n" +
              "1. Identify your model\n" +
              "2. Locate part number\n" +
              "3. Contact parts department:\n" +
              "   📞 +61 3 9240 6822\n" +
              "   ✉️ parts@luus.com.au\n\n" +
              "Express Service Available:\n" +
              "• Next-day delivery options\n" +
              "• Emergency parts service\n" +
              "• Bulk order discounts",
    options: ["Parts Catalog", "Technical Support", "Service Request"],
    externalLink: "https://luus.com.au/spareparts/"
  }
};

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

export async function generateAIResponse(messages, options = {}) {
  console.log('Generating AI response with messages:', JSON.stringify(messages, null, 2));
  
  try {
    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format');
    }

    const lastMessage = messages[messages.length - 1];
    
    // Validate last message
    if (!lastMessage || typeof lastMessage.content !== 'string') {
      throw new Error('Invalid message content format');
    }

    // Extract context from conversation
    const context = extractContext(messages);
    
    // Try to generate dynamic response
    const dynamicResponse = generateDynamicResponse(lastMessage.content, context);
    if (dynamicResponse) {
      return dynamicResponse;
    }

    // If no dynamic response, use OpenAI
    const systemMessage = `You are the professional virtual assistant for Luus Industries, a leading Australian manufacturer of commercial kitchen equipment. 
    
    Use this knowledge base for accurate information:
    ${JSON.stringify(KNOWLEDGE_BASE, null, 2)}
    
    Guidelines:
    1. Be professional and courteous
    2. Provide specific, accurate information from the knowledge base
    3. For technical details or more information, always include our contact details:
       • Phone: ${KNOWLEDGE_BASE.company.phone}
       • Email: ${KNOWLEDGE_BASE.company.emails.info}
       • Hours: ${KNOWLEDGE_BASE.company.businessHours}
    4. Maintain context from the entire conversation
    5. If unsure, suggest contacting our team directly
    
    Current conversation context:
    ${JSON.stringify(context, null, 2)}`;

    const conversationWithContext = [
      { role: 'system', content: systemMessage },
      ...messages.filter(msg => msg && typeof msg.content === 'string').map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationWithContext,
      temperature: 0.7,
      max_tokens: 250,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('Invalid AI completion response');
    }

    let aiResponse = completion.choices[0].message.content;
    
    // Add contact information if not already present
    if (!aiResponse.toLowerCase().includes('call us') && !aiResponse.toLowerCase().includes('phone')) {
      aiResponse += `\n\nFor more detailed information and assistance:\n`;
      aiResponse += `• Call us: ${KNOWLEDGE_BASE.company.phone}\n`;
      aiResponse += `• Email: ${KNOWLEDGE_BASE.company.emails.info}\n`;
      aiResponse += `• Business Hours: ${KNOWLEDGE_BASE.company.businessHours}`;
    }

    return {
      response: aiResponse,
      options: [],
      externalLink: KNOWLEDGE_BASE.company.website
    };

  } catch (error) {
    console.error('Error generating AI response:', error);
    
    return {
      response: "I apologize for the technical difficulty. For immediate assistance:\n\n" +
                `• Call us: ${KNOWLEDGE_BASE.company.phone}\n` +
                `• Email: ${KNOWLEDGE_BASE.company.emails.support}\n` +
                `• Business Hours: ${KNOWLEDGE_BASE.company.businessHours}\n\n` +
                `Our team will be happy to help you with any questions.`,
      options: [],
      externalLink: KNOWLEDGE_BASE.company.website
    };
  }
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
