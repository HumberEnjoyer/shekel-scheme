import React, { useState, useEffect } from 'react';

function Comments({ nftId, token, isLoggedIn }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/nft/${nftId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [nftId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/nft/${nftId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      const data = await response.json();

      if (response.ok) {
        setComments((prev) => [data, ...prev]);
        setNewComment('');
      } else {
        console.error("Error posting comment:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Decode token if stored as string (temporary logic for checking userId)
  let currentUserId = null;
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.userId) currentUserId = storedUser.userId;
  } catch (e) {}

  return (
    <div className="mt-6">
      <h4 className="text-indigo-300 mb-4 text-lg font-semibold">Comments</h4>

      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
          <input
            type="text"
            className="flex-grow px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet</p>
        ) : (
            comments.map((comment) => (
                <div key={comment._id} className="bg-gray-800 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{comment.user?.username || "Deleted User"}</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white">{comment.text}</p>
                  {currentUserId === comment.user?._id && (
                    <button
                      className="mt-3 text-sm text-red-400 hover:underline"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
        )}
      </div>
    </div>
  );
}

export default Comments;
