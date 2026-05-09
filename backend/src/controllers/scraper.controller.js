import { scrapeTopStories } from '../services/scraper.service.js';
import ApiResponse from '../utils/ApiResponse.js';

export const scrape = async (_req, res) => {
  const stories = await scrapeTopStories();
  res.json(new ApiResponse(200, { count: stories.length }, 'Scrape completed'));
};
