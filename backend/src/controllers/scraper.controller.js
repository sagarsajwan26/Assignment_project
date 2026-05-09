import { scrapeTopStories } from '../services/scraper.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const scrape = asyncHandler(async (_req, res) => {
  const stories = await scrapeTopStories();
  res.json(new ApiResponse(200, { count: stories.length }, 'Scrape completed'));
});
