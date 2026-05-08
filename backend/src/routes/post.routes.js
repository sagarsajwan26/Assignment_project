import { Router } from 'express';
import { createPost } from '../controllers/post.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createPost);

export default router;
