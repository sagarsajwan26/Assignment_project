import 'dotenv/config';
import mongoose from 'mongoose';
import User from './model/user.model.js';
import Story from './model/post.model.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Create or find a seed user
    let user = await User.findOne({ email: 'seed@example.com' });
    if (!user) {
      user = await User.create({
        username: 'seed_user',
        email: 'seed@example.com',
        password: 'password123',
      });
      console.log('Created seed user');
    }

    // 2. Clear existing user stories (optional, but good for clean seeding)
    // await Story.deleteMany({ createdBy: user._id });

    // 3. Sample stories
    const stories = [
      {
        title: 'Building a Modern News App with React and Node.js',
        url: 'https://example.com/modern-news-app',
        points: 120,
        author: 'tech_guru',
        postedAt: '2 hours ago',
        createdBy: user._id,
      },
      {
        title: 'The Future of AI in Web Development',
        url: 'https://example.com/ai-web-dev',
        points: 85,
        author: 'ai_explorer',
        postedAt: '5 hours ago',
        createdBy: user._id,
      },
      {
        title: 'Mastering MongoDB Aggregation Framework',
        url: 'https://example.com/mongodb-mastery',
        points: 64,
        author: 'db_admin',
        postedAt: 'Yesterday',
        createdBy: user._id,
      },
      {
        title: 'Understanding CORS in Express.js once and for all',
        url: 'https://example.com/cors-explained',
        points: 210,
        author: 'security_first',
        postedAt: '1 day ago',
        createdBy: user._id,
      },
      {
        title: '10 Tips for Better CSS Architecture',
        url: 'https://example.com/css-tips',
        points: 45,
        author: 'frontend_ninja',
        postedAt: '3 days ago',
        createdBy: user._id,
      },
    ];

    await Story.insertMany(stories);
    console.log(`Seeded ${stories.length} stories successfully!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
