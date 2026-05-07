import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { signup, login, logout } from './controllers/auth.controller.js';
import ApiError from './utils/ApiError.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/api/auth/register', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/logout', logout);

// Global error handler
app.use((err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
