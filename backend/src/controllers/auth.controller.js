import User from '../model/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
};

const generateTokens = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) throw new ApiError(400, 'All fields are required');

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError(409, 'User already exists');

  const user = await User.create({ username, email, password });
  const { accessToken, refreshToken } = await generateTokens(user);

  res
    .status(201)
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(
      new ApiResponse(201, {
        user: { id: user._id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      }, 'User registered successfully')
    );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'All fields are required');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');

  const { accessToken, refreshToken } = await generateTokens(user);

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json(
      new ApiResponse(200, {
        user: { id: user._id, username: user.username, email: user.email },
        accessToken,
        refreshToken,
      }, 'Login successful')
    );
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } });
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, {}, 'Logged out successfully'));
});
