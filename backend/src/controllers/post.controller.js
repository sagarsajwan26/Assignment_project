import Post from '../model/post.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) throw new ApiError(400, 'Title and content are required');

  const post = await Post.create({ title, content, author: req.user.id });

  res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
});
