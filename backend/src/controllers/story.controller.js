import Story from '../model/post.model.js';
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

  res.json(
    new ApiResponse(200, {
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, 'Stories fetched successfully')
  );
});
