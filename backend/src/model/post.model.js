import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, default: '' },
    points: { type: Number, default: 0 },
    content: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.Mixed, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    postedAt: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Story', storySchema);
