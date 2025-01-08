import express from 'express';
import dotenv from 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipesRoutes.js';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Register the routes
app.use('/api/auth', authRoutes);  // Mount the auth routes to /api/auth

app.use('/api/recipes', recipeRoutes);


app.get('/', (req, res) => {
  res.send('Savorly API is running!');
});


export default app;
