import 'dotenv/config';
import mongoose from 'mongoose';
import app from './src/app.js';
import { scrapeStories } from './src/services/scraper.service.js';

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await scrapeStories();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
