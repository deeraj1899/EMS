import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useGetAllReviews from '../../hooks/useGetAllReviews';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';

const WorkReviewEmp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    submittedWorkId,
    submittedBy,
    githubLink,
    title,
    description,
  } = location.state || {};

  const employee = useSelector((state) => state.auth?.employee?._id);
  const organization = useSelector((state) => state.auth?.employee?.organization);

  const { comments, setComments, error, loading } = useGetAllReviews(submittedWorkId || null);

  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (error) {
      toast.error('Failed to load reviews');
    }
  }, [error]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!employee || !organization) {
      toast.error('Missing employee or organization ID.');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty.');
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
      toast.error('Failed to submit the comment.');
    }
  };

  if (!submittedWorkId) {
    return (
      <p className="text-center text-gray-600">
        No submitted work selected to view reviews.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back
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
          <h3 className="text-lg font-medium text-gray-800 mb-2">Reviews:</h3>
          {loading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-gray-800">
                    <strong>{comment.Reviewedby.empname}</strong> ({new Date(comment.createdAt).toLocaleString()})
                  </p>
                  <p className="text-sm text-gray-700">{comment.ReviewContent}</p>
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

export default WorkReviewEmp;
