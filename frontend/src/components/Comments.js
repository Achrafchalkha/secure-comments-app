import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Comments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  // Simulate fetching the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser) {
      // Redirect to login if no user is logged in
      navigate('/login');
    }

    // Load comments from localStorage
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage and redirect to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // VULNERABLE BY DESIGN: No sanitization of input for XSS testing
    const comment = {
      id: Date.now(),
      text: newComment,
      author: currentUser?.email || 'Anonymous',
      date: new Date().toLocaleDateString(),
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
    setNewComment('');
  };

  return (
    <div className="comments-container">
      <div className="comments-header">
        <h2>Comments</h2>
        <div className="user-info">
          <span>Logged in as {currentUser?.email || 'Guest'}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Post Comment</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.author}</strong>
                <span>{comment.date}</span>
              </div>
              {/* VULNERABLE: Using dangerouslySetInnerHTML for XSS testing */}
              <div dangerouslySetInnerHTML={{ __html: comment.text }} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;