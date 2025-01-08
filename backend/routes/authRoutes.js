import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/loginController.js';
import { validateRegister, validateLogin } from '../middleware/validateInput.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Registration Route with validation middleware
router.post('/register', validateRegister, registerUser);

// Login Route with validation middleware
router.post('/login', validateLogin, loginUser);

// Example of a protected route using authentication middleware
router.get('/protected', authenticate, (req, res) => {
    res.json({ message: 'You are authorized!', user: req.user });
});

export default router;
