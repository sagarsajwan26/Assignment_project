import User from '../model/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) throw new ApiError(400, 'All fields are required');

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, 'User already exists');

  const user = await User.create({ username, email, password });
  const { accessToken, refreshToken } = await generateTokens(user);

  res
    .status(201)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })
    .json(new ApiResponse(201, {
      user: { id: user._id, username: user.username, email: user.email },
      accessToken,
      refreshToken,
    }, 'User registered successfully'));
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'All fields are required');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');

  const { accessToken, refreshToken } = await generateTokens(user);

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })
    .json(new ApiResponse(200, {
      user: { id: user._id, username: user.username, email: user.email },
      accessToken,
      refreshToken,
    }, 'Login successful'));
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
      }
    }
  } catch (error) {
    // Ignore verification errors during logout as we're clearing everything anyway
  }

  res
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
};
