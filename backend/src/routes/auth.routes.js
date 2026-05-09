import { Router } from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);

export default router;
