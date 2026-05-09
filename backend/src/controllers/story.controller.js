import Story from '../model/post.model.js';
import User from '../model/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getStories = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const [stories, total] = await Promise.all([
    Story.find().sort({ points: -1 }).skip(skip).limit(limit).lean(),
    Story.countDocuments(),
  ]);

  res.json(new ApiResponse(200, {
    stories,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }, 'Stories fetched successfully'));
});

export const getStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).lean();
  if (!story) throw new ApiError(404, 'Story not found');
  res.json(new ApiResponse(200, story, 'Story fetched'));
});

export const createStory = asyncHandler(async (req, res) => {
  const { title, content, url } = req.body;
  if (!title || !content) throw new ApiError(400, 'Title and content are required');
  const story = await Story.create({ title, content, url, author: req.user.id });
  res.status(201).json(new ApiResponse(201, story, 'Story created successfully'));
});

export const updateStory = asyncHandler(async (req, res) => {
  const { title, content, url } = req.body;
  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { title, content, url },
    { new: true, runValidators: true }
  );
  if (!story) throw new ApiError(404, 'Story not found');
  res.json(new ApiResponse(200, story, 'Story updated successfully'));
});

export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findByIdAndDelete(req.params.id);
  if (!story) throw new ApiError(404, 'Story not found');
  res.json(new ApiResponse(200, null, 'Story deleted successfully'));
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw new ApiError(404, 'Story not found');

  const user = await User.findById(req.user.id);
  const idx = user.bookmarks.findIndex((b) => b.toString() === story._id.toString());

  if (idx === -1) user.bookmarks.push(story._id);
  else user.bookmarks.splice(idx, 1);

  await user.save({ validateBeforeSave: false });
  const bookmarked = idx === -1;
  res.json(new ApiResponse(200, { bookmarked }, bookmarked ? 'Bookmarked' : 'Bookmark removed'));
});

export const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('bookmarks').lean();
  res.json(new ApiResponse(200, user.bookmarks, 'Bookmarks fetched'));
});
