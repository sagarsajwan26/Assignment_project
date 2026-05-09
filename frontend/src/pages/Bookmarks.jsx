import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarks } from '../store/slices/storiesSlice';
import StoryCard from '../components/StoryCard';

export default function Bookmarks() {
  const dispatch = useDispatch();
  const { bookmarks } = useSelector((s) => s.stories);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-8">My Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400">No bookmarks yet. Star a story to save it!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookmarks.map((story) => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}
