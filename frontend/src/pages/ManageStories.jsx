import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStories, createStory, updateStory, deleteStory, triggerScrape } from '../store/slices/storiesSlice';

const empty = { title: '', url: '', points: 0, author: '', postedAt: '' };

export default function ManageStories() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, pagination, loading, scraping } = useSelector((s) => s.stories);
  const { user } = useSelector((s) => s.auth);

  const myStories = items;

  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (user) dispatch(fetchStories({ page, limit: 10, createdBy: user.id }));
  }, [dispatch, page, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await dispatch(updateStory({ id: editId, data: form }));
    } else {
      await dispatch(createStory(form));
    }
    setForm(empty);
    setEditId(null);
    setShowForm(false);
    dispatch(fetchStories({ page: 1, limit: 10, createdBy: user.id }));
    setPage(1);
  };

  const handleEdit = (story) => {
    setForm({ title: story.title, url: story.url || '', points: story.points || 0, author: story.author || '', postedAt: story.postedAt || '' });
    setEditId(story._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    await dispatch(deleteStory(id));
  };

  const handleCancel = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Manage Stories</h1>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowForm(!showForm); setEditId(null); setForm(empty); }}
            className="btn-primary text-sm"
          >
            {showForm && !editId ? 'Cancel' : '+ Add Story'}
          </button>
        </div>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-700 mb-4">{editId ? 'Edit Story' : 'Add New Story'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <input
                  className="input-field"
                  placeholder="Title *"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <input
                className="input-field"
                placeholder="URL"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
              <input
                type="number"
                className="input-field"
                placeholder="Points"
                value={form.points}
                onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || 0 })}
              />
              <input
                className="input-field"
                placeholder="Posted At"
                value={form.postedAt}
                onChange={(e) => setForm({ ...form, postedAt: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editId ? 'Update Story' : 'Create Story'}
              </button>
              <button type="button" onClick={handleCancel} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stories Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Author</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Points</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myStories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    You haven't created any stories yet. Add one manually above.
                  </td>
                </tr>
              ) : (
                myStories.map((story) => (
                  <tr key={story._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <a href={story.url} target="_blank" rel="noreferrer" className="font-medium text-slate-800 hover:text-indigo-600 line-clamp-1">
                        {story.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{story.author || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{story.points}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(story)}
                          className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(story._id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">{myStories.length} of your stories</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-xs text-slate-600">{page} / {pagination.totalPages}</span>
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
