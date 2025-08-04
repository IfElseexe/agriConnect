import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/productRoutes.js';
import productOptionsRoutes from './routes/productOptionsRoutes.js';
import chatRoomRoutes from './routes/chatRoom.routes.js';
import messageRoutes from './routes/message.routes.js';
import setupSocket from './socket/index.js'; // new

// Initialize environment
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ⚡ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
setupSocket(io); // pass io to the socket handler

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Ensure uploads folder exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('📂 Created uploads directory');
}

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images
app.use('/uploads', express.static(uploadsPath));

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-options', productOptionsRoutes);
app.use('/api/chat-rooms', chatRoomRoutes); // new
app.use('/api/messages', messageRoutes);     // new

// ✅ Serve Angular frontend
const frontendPath = path.join(__dirname, 'dist', 'agriConnect');
app.use(express.static(frontendPath));

// ✅ Fallback to index.html for frontend routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: 'API route not found' });
  } else {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// ✅ Start server with Socket.IO support
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
