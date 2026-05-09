import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import storyRoutes from './routes/story.routes.js';
import scraperRoutes from './routes/scraper.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, '')) : []),
];

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/scrape', scraperRoutes);

app.use(errorHandler);

export default app;
