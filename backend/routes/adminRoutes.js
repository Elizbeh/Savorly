import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/users', authenticate, isAdmin, getAllUsers);
router.delete('/users/:id', authenticate, isAdmin, deleteUser);

export default router;
