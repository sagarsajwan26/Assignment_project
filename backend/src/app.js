import express from 'express';
import cors from 'cors';
import { signup, login } from './controllers/auth.controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/register', signup);
app.post('/api/auth/login', login);

export default app;
