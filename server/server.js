import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

// Load env variables
dotenv.config();

// Critical Environment Check
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI or MONGO_URI is not defined in environment variables.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not defined. Falling back to default secret.');
}
if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not defined. AI Resume analysis features will fail.');
}


const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://ai-resume-analyzer-topaz-kappa.vercel.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed by server config'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Route mounts
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Test endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Resume Analyzer API is running smoothly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  
  // Multer error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Max limit is 5MB.' });
  }

  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Database & Server startup
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully to production cluster');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
