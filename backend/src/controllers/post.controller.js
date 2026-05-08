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

export const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true, runValidators: true }
  );

  if (!post) throw new ApiError(404, 'Post not found');

  res.json(new ApiResponse(200, post, 'Post updated successfully'));
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) throw new ApiError(404, 'Post not found');

  res.json(new ApiResponse(200, null, 'Post deleted successfully'));
});
