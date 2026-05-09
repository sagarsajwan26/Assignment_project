import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Bookmarks from './pages/Bookmarks';
import ManagePost from './pages/ManagePost';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container mx-auto px-4 pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-post"
            element={
              <ProtectedRoute>
                <ManagePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-post/:id"
            element={
              <ProtectedRoute>
                <ManagePost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
