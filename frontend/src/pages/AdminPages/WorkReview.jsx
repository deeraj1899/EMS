import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useGetAllReviews from '../../hooks/useGetAllReviews';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';

const WorkReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    submittedWorkId,
    submittedBy,
    githubLink,
    title,
    description,
  } = location.state || {};

  const organization = useSelector((state) => state.auth?.organization?._id);
  const employee = useSelector((state) => state.auth?.employee?._id);

  const [newComment, setNewComment] = useState('');
  const { comments, setComments, error, loading } = useGetAllReviews(submittedWorkId || null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!organization || !employee) {
      toast.error('Organization or Employee ID is missing.');
      return;
    }

    try {
      const response = await axios.post(`${ADMIN_API_ENDPOINT}/addreview`, {
        organization,
        Reviewedby: employee,
        WorkContent: submittedWorkId,
        ReviewContent: newComment,
      });

      const newCommentObject = {
        _id: response.data.reviewId,
        Reviewedby: { empname: 'You' },
        ReviewContent: newComment,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [...prev, newCommentObject]);
      setNewComment('');
      toast.success('Comment submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit the comment. Please try again.');
    }
  };

  const startEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.ReviewContent);
  };

  const handleEditSubmit = async (commentId) => {
    try {
      const res = await axios.put(`${ADMIN_API_ENDPOINT}/editreview/${commentId}`, {
        ReviewContent: editContent,
      });

      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, ReviewContent: editContent } : c))
      );
      setEditingCommentId(null);
      toast.success('Comment updated successfully');
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${ADMIN_API_ENDPOINT}/deletereview/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  if (!submittedWorkId) {
    return <p className="text-center text-gray-600">No work has been submitted yet to review.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back to Dashboard
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Submitted By:</strong> {submittedBy}
        </p>
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-6"
        >
          GitHub Link
        </a>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Comments:</h3>
          {loading ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-800">
                    <strong>{comment.Reviewedby.empname}</strong> ({new Date(comment.createdAt).toLocaleString()})
                  </p>
                  {editingCommentId === comment._id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border rounded p-2 mt-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{comment.ReviewContent}</p>
                  )}

                  {comment.Reviewedby._id === employee && (
                    <div className="flex gap-3 mt-2 text-sm">
                      {editingCommentId === comment._id ? (
                        <>
                          <button onClick={() => handleEditSubmit(comment._id)} className="text-green-600">Save</button>
                          <button onClick={() => setEditingCommentId(null)} className="text-gray-600">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(comment)} className="text-blue-600">Edit</button>
                          <button onClick={() => handleDelete(comment._id)} className="text-red-600">Delete</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Add a Comment:</h3>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your comment here..."
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkReview;
