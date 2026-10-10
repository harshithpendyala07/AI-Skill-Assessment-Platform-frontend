import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Auth check error:", err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser({
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      targetRole: res.data.targetRole
    });
    return res.data;
  };

  const register = async (name, email, password, role = 'STUDENT', targetRole = 'Full Stack Developer') => {
    const res = await api.post('/auth/register', { name, email, password, role, targetRole });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser({
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
      targetRole: res.data.targetRole
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
