// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (!email || !password) {
      return false;
    }
    
    // Get valid users from localStorage or use default
    const validUsers = JSON.parse(localStorage.getItem('validUsers')) || [
      { email: 'user@example.com', password: 'password123' },
      { email: 'admin@example.com', password: 'admin123' }
    ];
    
    const user = validUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = { email: user.email, name: user.email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }
    
    return false;
  };

  const signup = (email, password) => {
    // Basic validation - still vulnerable but checks for empty inputs
    if (!email || !password) {
      return false;
    }
    
    // Get existing users from localStorage or initialize empty array
    let validUsers = JSON.parse(localStorage.getItem('validUsers')) || [
      { email: 'user@example.com', password: 'password123' },
      { email: 'admin@example.com', password: 'admin123' }
    ];
    
    // Check if email already exists
    const existingUser = validUsers.find(u => u.email === email);
    if (existingUser) {
      return false; // Email already in use
    }
    
    // Add new user
    validUsers.push({ email, password });
    localStorage.setItem('validUsers', JSON.stringify(validUsers));
    
    // Log in the new user
    const userData = { email, name: email.split('@')[0] };
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}