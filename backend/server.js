require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const routes = require('./routes/index');
const { errorHandler, notFound } = require('./middleware/error');

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
app.use(cors({
  origin: 'https://tourease-ai.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Session for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'tourease_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TourEase AI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Socket.IO - Real-time features
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join user room for notifications
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // AI Chatbot
  socket.on('chat_message', async (data) => {
    const { message, userId } = data;

    // Simulate AI response (connect to real AI API in production)
    setTimeout(() => {
      const responses = {
        hotel: "I can help you find the perfect hotel! What's your budget and preferred location?",
        trip: "Let me plan a perfect trip for you! Tell me your destination, duration, and interests.",
        food: "India has amazing cuisine! From biryani in Hyderabad to seafood in Goa, every region has unique flavors.",
        safety: "For safety tips, always keep emergency numbers handy: Police 100, Ambulance 108. Travel with registered guides.",
        default: "Welcome to TourEase AI! I'm here to help you plan the perfect Indian adventure. Ask me about destinations, hotels, or travel tips!",
      };

      const keyword = Object.keys(responses).find((k) => message.toLowerCase().includes(k));
      const reply = responses[keyword] || responses.default;

      socket.emit('chat_reply', {
        message: reply,
        timestamp: new Date().toISOString(),
        type: 'bot',
      });
    }, 800);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Make io accessible
app.set('io', io);

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║        TourEase AI Backend 🚀          ║
  ║  Server running on port ${PORT}           ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}           ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = { app, server, io };
