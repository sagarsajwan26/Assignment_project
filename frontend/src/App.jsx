import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
          <Route path="/manage" element={<ManagePost />} />
          <Route path="/manage/:id" element={<ManagePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
