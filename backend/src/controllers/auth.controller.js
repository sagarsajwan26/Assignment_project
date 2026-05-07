import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(409).json({ message: 'User already exists' });

  const user = await User.create({ username, email, password });
  const token = signToken(user._id);

  res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
};
