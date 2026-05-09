import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories, fetchBookmarks } from '../store/slices/storiesSlice';
import StoryCard from '../components/StoryCard';
import Pagination from '../components/Pagination';

export default function Home() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useSelector((s) => s.stories);
  const { user } = useSelector((s) => s.auth);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchStories({ page, limit: 10 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (user) dispatch(fetchBookmarks());
  }, [dispatch, user]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Trending News</h1>
          <p className="text-slate-500 mt-1">Discover the latest stories from around the world.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Fetching the latest stories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => dispatch(fetchStories({ page, limit: 10 }))}
            className="mt-4 text-sm font-semibold text-red-700 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {items.length > 0 ? (
              items.map((story) => <StoryCard key={story._id} story={story} />)
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400">No stories yet. Try triggering a scrape!</p>
              </div>
            )}
          </div>
          <div className="mt-12 flex justify-center">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
