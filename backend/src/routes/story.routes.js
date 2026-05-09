import { Router } from 'express';
import {
  getStories, getStory, createStory, updateStory, deleteStory,
  toggleBookmark, getBookmarks,
} from '../controllers/story.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getStories);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', getStory);
router.post('/', protect, createStory);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
