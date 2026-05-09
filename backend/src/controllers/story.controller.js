import Story from '../model/post.model.js';
import User from '../model/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getStories = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.createdBy) query.createdBy = req.query.createdBy;

  const [stories, total] = await Promise.all([
    Story.find(query).sort({ points: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    Story.countDocuments(query),
  ]);

  res.json(new ApiResponse(200, {
    stories,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }, 'Stories fetched successfully'));
};

export const getStory = async (req, res) => {
  const story = await Story.findById(req.params.id).lean();
  if (!story) throw new ApiError(404, 'Story not found');
  res.json(new ApiResponse(200, story, 'Story fetched'));
};

export const createStory = async (req, res) => {
  const { title, url, points, author, postedAt } = req.body;
  if (!title) throw new ApiError(400, 'Title is required');
  const story = await Story.create({
    title: String(title).trim(),
    url: url ? String(url).trim() : '',
    points: parseInt(points) || 0,
    author: author ? String(author).trim() : '',
    postedAt: postedAt ? String(postedAt).trim() : '',
    createdBy: req.user.id,
  });
  res.status(201).json(new ApiResponse(201, story, 'Story created successfully'));
};

export const updateStory = async (req, res) => {
  const { title, url, points, author, postedAt } = req.body;
  const story = await Story.findById(req.params.id);
  if (!story) throw new ApiError(404, 'Story not found');
  if (story.createdBy && story.createdBy.toString() !== req.user.id)
    throw new ApiError(403, 'Not authorized to update this story');

  story.title = String(title).trim();
  story.url = url ? String(url).trim() : '';
  story.points = parseInt(points) || 0;
  story.author = author ? String(author).trim() : '';
  story.postedAt = postedAt ? String(postedAt).trim() : '';
  await story.save();

  res.json(new ApiResponse(200, story, 'Story updated successfully'));
};

export const deleteStory = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw new ApiError(404, 'Story not found');
  if (story.createdBy && story.createdBy.toString() !== req.user.id)
    throw new ApiError(403, 'Not authorized to delete this story');
  await story.deleteOne();
  res.json(new ApiResponse(200, null, 'Story deleted successfully'));
};

export const toggleBookmark = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw new ApiError(404, 'Story not found');

  const user = await User.findById(req.user.id);
  const idx = user.bookmarks.findIndex((b) => b.toString() === story._id.toString());

  if (idx === -1) user.bookmarks.push(story._id);
  else user.bookmarks.splice(idx, 1);

  await user.save({ validateBeforeSave: false });
  const bookmarked = idx === -1;
  res.json(new ApiResponse(200, { bookmarked }, bookmarked ? 'Bookmarked' : 'Bookmark removed'));
};

export const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user.id).populate('bookmarks').lean();
  res.json(new ApiResponse(200, user.bookmarks, 'Bookmarks fetched'));
};
