import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipesRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';  // JWT for token validation

// Ensure JWT_SECRET is set in environment variables
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables!");
}

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type', 'Cache-Control', 'Origin', 'Accept'],
};

app.use(cors(corsOptions));
app.use(helmet());  // Secure HTTP headers

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Serve static files with appropriate headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=0');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}, express.static(path.join(process.cwd(), 'uploads')));


// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/profile', profileRoutes);

// Error handler for unhandled errors
/*app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ message: err.message || 'Something went wrong. Please try again later.' });
});*/
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized, please log in again' });
  }
  console.error('Global Error:', err);
  res.status(500).json({ message: 'Something went wrong. Please try again later.' });
});


// Token validation route for testing
app.post('/test-token', (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ message: 'Token is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ decoded });
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

// Root route to check if the API is running
app.get('/', (req, res) => {
  res.send('Savorly API is running!');
});

export default app;
