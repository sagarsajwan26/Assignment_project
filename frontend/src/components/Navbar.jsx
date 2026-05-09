import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/50 mb-8">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          NewsHub
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/manage" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                + Create
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 hidden sm:inline">Hi, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/signup" className="btn-primary !px-6 !py-1.5 text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
