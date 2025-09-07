import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import rateLimitMiddleware from './middleware/rateLimit.js';

// Import routes
import authRoutes from './routes/auth.js';
import guideRoutes from './routes/guides.js';
import quizRoutes from './routes/quiz.js';
import gamifiedRoutes from './routes/gamified.js';
import chatbotRoutes from './routes/chatbot.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://studygeniev1.vercel.app'],
  credentials: true
}));
app.options("*", cors());
app.use(helmet());

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimitMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/gamified', gamifiedRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'StudyGenie API is running!', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 StudyGenie server running on port ${PORT}`);
});