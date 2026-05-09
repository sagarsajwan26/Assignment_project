import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost, fetchStories } from '../store/slices/storiesSlice';

export default function ManagePost() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.stories);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    content: '',
  });

  useEffect(() => {
    if (!user) navigate('/login');
    if (isEdit) {
      const existing = items.find((item) => item._id === id);
      if (existing) {
        setFormData({
          title: existing.title,
          url: existing.url || '',
          content: existing.content || '',
        });
      }
    }
  }, [id, isEdit, items, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await dispatch(updatePost({ id, data: formData }));
    } else {
      await dispatch(createPost(formData));
    }
    await dispatch(fetchStories({ page: 1, limit: 10 }));
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          {isEdit ? 'Edit Post' : 'Create New Post'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="What's happening?"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL (Optional)</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
            <textarea
              className="input-field min-h-[150px] resize-none"
              placeholder="Tell your story..."
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 btn-primary">
              {isEdit ? 'Update Post' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
