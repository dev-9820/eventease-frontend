import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('ee_auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      setUser(parsed.user);
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('ee_auth', JSON.stringify({ token, user }));
    setUser(user);
    return user;
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data;
    localStorage.setItem('ee_auth', JSON.stringify({ token, user }));
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem('ee_auth');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
