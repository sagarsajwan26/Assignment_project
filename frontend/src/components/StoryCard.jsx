import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleBookmark, deletePost, fetchStories } from '../store/slices/storiesSlice';

export default function StoryCard({ story }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const bookmarks = useSelector((state) => state.stories.bookmarks);
  const isBookmarked = bookmarks.some((b) => b._id === story._id);
  const isOwner = user && story.author?.toString() === user.id?.toString();

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <a
          href={story.url || '#'}
          target="_blank"
          rel="noreferrer"
          className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors flex-1 mr-3"
        >
          {story.title}
        </a>
        {user && (
          <button
            onClick={() => dispatch(toggleBookmark(story._id))}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            className={`text-2xl leading-none transition-colors ${isBookmarked ? 'text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span>{story.points} pts</span>
          <span>by {story.author || 'Anonymous'}</span>
          <span>{story.postedAt || 'Recently'}</span>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/manage-post/${story._id}`)}
              className="text-xs text-indigo-600 hover:underline font-medium"
            >
              Edit
            </button>
            <button
              onClick={async () => { await dispatch(deletePost(story._id)); dispatch(fetchStories({ page: 1, limit: 10 })); }}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
