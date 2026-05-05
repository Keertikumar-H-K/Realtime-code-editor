import { connectDB } from './db.js';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleSocketConnection } from './socket/socketHandler.js';
import roomRoutes from './routes/rooms.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/rooms', roomRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeSync server is running' });
});

// ✅ FIX: Add transports to prevent WebSocket connection failures
const io = new Server(httpServer, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  handleSocketConnection(socket, io);
});

connectDB();

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 CodeSync server running on port ${PORT}`);
  console.log(`📡 Socket.io listening for connections`);
});

export { app, io };