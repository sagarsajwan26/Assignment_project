import { Router } from 'express';
import { scrape } from '../controllers/scraper.controller.js';

const router = Router();

router.post('/', scrape);

export default router;
