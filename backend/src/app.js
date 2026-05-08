import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { signup, login, logout } from './controllers/auth.controller.js';
import postRoutes from './routes/post.routes.js';
import storyRoutes from './routes/story.routes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/api/auth/register', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);

app.use(errorHandler);

export default app;
