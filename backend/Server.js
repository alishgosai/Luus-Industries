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

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
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

export default server;

