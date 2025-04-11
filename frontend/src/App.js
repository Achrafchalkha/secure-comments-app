import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Comments from './components/Comments';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Secure Comments App</h1>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
