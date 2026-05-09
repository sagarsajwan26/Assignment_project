import { Router } from 'express';
import { scrape } from '../controllers/scraper.controller.js';
import { scrapeLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', scrapeLimiter, scrape);

export default router;
