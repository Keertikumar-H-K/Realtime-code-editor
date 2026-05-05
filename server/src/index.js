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

const allowedOrigins = [
  'http://localhost:5173',
  'https://realtime-code-editor-alpha.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/rooms', roomRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodeSync server is running' });
});

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
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});

export { app, io };