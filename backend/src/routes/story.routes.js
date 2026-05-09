import { Router } from 'express';
import { getStories, getStory, toggleBookmark, getBookmarks } from '../controllers/story.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getStories);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', getStory);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
