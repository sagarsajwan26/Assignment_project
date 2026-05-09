import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, signupApi, logoutApi } from '../apiRoutes/auth.api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi(credentials);
      const userData = res.data.data.user;
      const token = res.data.data.accessToken;
      
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signupApi(data);
      const userData = res.data.data.user;
      const token = res.data.data.accessToken;
      
      setUser(userData);
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      setUser(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
