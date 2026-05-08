import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, default: '' },
    points: { type: Number, default: 0 },
    content: { type: String, default: '' },
    author: { type: String, default: '' },
    postedAt: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Story', storySchema);
