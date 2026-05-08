import { Router } from 'express';
import { createPost, updatePost, deletePost } from '../controllers/post.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
