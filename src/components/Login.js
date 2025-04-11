import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  // When logged in state changes, navigate
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/comments');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      console.log('Login response:', response.data);
      
      // Store user data in localStorage
      const userData = {
        email: email,
        // Add any other user data you receive from the server
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Set logged in state to trigger navigation in useEffect
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to log in');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="auth-link">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;