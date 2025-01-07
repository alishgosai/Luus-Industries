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
import { errorHandler } from './middleware/errorHandler.js';
import { 
  handleChat, 
  getChatSessionHistory, 
  getUserProductInterests, 
  deleteUserChatHistory, 
  getAllUsers 
} from './controllers/chatController.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Global unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Updated CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.FRONTEND_URL, 'http://192.168.0.23:3000'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));

// Logging middleware with more details
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

// Ping route for connectivity testing
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Server is reachable' });
});

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Backend is connected' });
});

// Existing routes
app.use('/user', userRoutes);

app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api', supportRoutes);

// Chat routes
app.post('/api/chat', handleChat);
app.get('/api/chat/history/:userId', getChatSessionHistory);
app.get('/api/chat/interests/:userId', getUserProductInterests);
app.delete('/api/chat/history/:userId', deleteUserChatHistory);
app.get('/api/chat/users', getAllUsers);

// QR code scan route
app.post('/api/qr-scan', (req, res) => {
  console.log('QR code scan received:', req.body);
  
  // Simulate processing time
  setTimeout(() => {
    // Check if qrData is provided
    if (!req.body.qrData) {
      console.log('Error: No QR data provided');
      return res.status(400).json({ success: false, message: 'No QR data provided' });
    }

    // Process QR code data here (for now, we'll just echo it back)
    const processedData = {
      qrContent: req.body.qrData,
      timestamp: new Date().toISOString()
    };

    console.log('Processed QR data:', processedData);
    res.json({ success: true, message: 'QR code processed successfully', data: processedData });
  }, 1000); // Simulate 1 second processing time
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
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
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})

export default server;

