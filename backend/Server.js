import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import sparePartRoutes from './routes/sparePartRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { 
  handleChat, 
  getChatSessionHistory, 
  getUserProductInterests, 
  deleteUserChatHistory, 
  getAllUsers 
} from './controllers/chatController.js';
import { handleChatMessage } from './services/aiService.js';
import { initializeEmailService } from './services/emailservice.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Define API_URL
const API_URL = process.env.API_URL || `http://localhost:${port}`;

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Updated CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://172.20.10.7:3000'];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`Origin ${origin} not allowed by CORS`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  
  // Log response
  const originalJson = res.json;
  res.json = function (body) {
    console.log(`[${timestamp}] Response:`, body);
    return originalJson.call(this, body);
  };
  
  next();
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Created uploads directory: ${uploadsDir}`);
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));

// Ping route for connectivity testing
app.get('/ping', (req, res) => {
  console.log('Ping route accessed');
  res.status(200).json({ message: 'Server is reachable' });
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Backend is connected' });
});

// Routes
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
console.log('Mounting product routes...');
app.use('/api/products', productRoutes);
console.log('Product routes mounted.');
app.use('/api/service', serviceRoutes);
app.use('/api', supportRoutes);
app.use('/', sparePartRoutes);

// Chat routes
app.post('/api/chat', handleChat);
app.get('/api/chat/history/:userId', getChatSessionHistory);
app.get('/api/chat/interactions/:userId', getUserProductInterests);
app.delete('/api/chat/history/:userId', deleteUserChatHistory);
app.get('/api/chat/users', getAllUsers);

// New chat route for AI-powered responses
const conversationHistory = new Map();

app.post("/api/chat/ai", async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: "Message and userId are required" });
  }

  try {
    console.log('Received chat request:', { message, userId });

    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const userHistory = conversationHistory.get(userId);
    console.log('User conversation history:', JSON.stringify(userHistory, null, 2));

    const response = await handleChatMessage(message, userHistory);
    console.log('AI response:', response);

    userHistory.push({ role: 'user', content: message });
    userHistory.push({ role: 'assistant', content: response });

    // Limit conversation history to last 10 messages
    if (userHistory.length > 20) {
      userHistory.splice(0, 2);
    }

    res.json({
      answer: response,
      prompt: message,
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: "An error occurred while processing your request" });
  }
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on ${API_URL}`);
  console.log('Registered routes:');
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    } else if (r.name === 'router') {
      r.handle.stack.forEach((nestedRoute) => {
        if (nestedRoute.route) {
          const basePath = r.regexp.toString().split('/')[1];
          console.log(`${Object.keys(nestedRoute.route.methods)} /${basePath}${nestedRoute.route.path}`);
        }
      });
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

//email
initializeEmailService();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;

