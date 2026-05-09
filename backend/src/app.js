import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import storyRoutes from './routes/story.routes.js';
import scraperRoutes from './routes/scraper.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/scrape', scraperRoutes);

app.use(errorHandler);

export default app;
