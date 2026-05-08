import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStories } from '../store/slices/storiesSlice';
import StoryCard from '../components/StoryCard';
import Pagination from '../components/Pagination';

export default function Home() {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useSelector((s) => s.stories);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchStories({ page, limit: 10 }));
  }, [dispatch, page]);

  if (loading) return <div className="center-msg">Loading stories...</div>;
  if (error) return <div className="center-msg error">{error}</div>;

  return (
    <div className="container">
      <h1 className="page-title">Top Stories</h1>
      <div className="stories-list">
        {items.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>
      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
