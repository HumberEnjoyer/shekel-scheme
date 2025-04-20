import React, { useState, useEffect } from 'react';

function Comments({ nftId, token, isLoggedIn }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch comments
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/nft/${nftId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Load comments on mount and when nftId changes
    useEffect(() => {
        fetchComments();
    }, [nftId]);

    // Add new comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/nft/${nftId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                const data = await response.json();
                setComments(prevComments => [data, ...prevComments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    // Delete comment
    const handleDelete = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setComments(prevComments => 
                    prevComments.filter(comment => comment._id !== commentId)
                );
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="comments-section mt-4">
            <h4>Comments</h4>
            
            {isLoggedIn && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading || !newComment.trim()}
                        >
                            {loading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="text-muted">No comments yet</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="comment card mb-2">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h6 className="card-subtitle mb-2 text-muted">
                                        {comment.user.username}
                                    </h6>
                                    <small className="text-muted">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                <p className="card-text">{comment.text}</p>
                                {token && comment.user._id === token.userId && (
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(comment._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Comments;
