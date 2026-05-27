import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Initial token validation failed:', error.response?.data?.message || error.message);
          // Token expired or corrupted
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register user
  const registerUser = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      return { success: true };
    } catch (error) {
      console.error('Registration failed Context:', error);
      return {
        success: false,
        message: error.response?.data?.message || (error.code === 'ERR_NETWORK' || !error.response ? 'Server is offline or database is unreachable. Please try again later.' : 'Registration failed. Please try again.'),
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, name: data.name, email: data.email });
      return { success: true };
    } catch (error) {
      console.error('Login failed Context:', error);
      return {
        success: false,
        message: error.response?.data?.message || (error.code === 'ERR_NETWORK' || !error.response ? 'Server is offline or database is unreachable. Please try again later.' : 'Invalid email or password.'),
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
