import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';
import { scrapeTopStories } from './src/services/scraper.service.js';

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    scrapeTopStories()
      .then((s) => console.log(`Scraped ${s.length} stories on startup`))
      .catch((err) => console.error('Startup scrape failed:', err.message));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
