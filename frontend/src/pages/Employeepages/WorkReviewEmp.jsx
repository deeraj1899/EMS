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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      setIsDrawerOpen(false);
      toast.success('Comment submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit the comment.');
    }
  };

  if (!submittedWorkId) {
    return (
      <p className="text-center text-[#e5e7eb] text-base">
        No submitted work selected to view reviews.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12172b] to-[#1e1e2f] px-4 pt-20 pb-8 font-['Inter'] flex flex-col items-center text-white">
      <div className="w-full max-w-[900px] bg-[#2a2e47] rounded-2xl p-8 shadow-[0_4px_16px_rgba(0,0,0,0.3)] animate-[fadeIn_0.5s_ease_forwards]">
        <button
          className="mb-8 px-4 py-2 bg-[#6c757d] text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:bg-[#5a6268] hover:-translate-y-1"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-[#e5e7eb] mb-3">{description}</p>
        <p className="text-sm text-[#e5e7eb] mb-3">
          <strong>Submitted By:</strong> {submittedBy}
        </p>
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#6c7ac2] hover:text-[#a5b4fc] font-semibold block mb-6 transition-colors duration-300"
        >
          GitHub Link
        </a>

        <div className="mb-16">
          <h3 className="text-lg font-semibold text-white mb-2">Reviews:</h3>
          {loading ? (
            <p className="text-[#a5b4fc] text-base">Loading reviews...</p>
          ) : comments.length === 0 ? (
            <p className="text-[#e5e7eb] text-base">No reviews yet.</p>
          ) : (
            <div className="[column-count:2] [column-gap:1.5rem] max-sm:[column-count:1]">
              {comments.map((comment, index) => (
                <div
                  key={comment._id}
                  className="[break-inside:avoid] mb-6 perspective-[1000px] animate-[slideIn_0.5s_ease_forwards] [animation-delay:calc(0.1s_*_var(--index))]"
                  style={{ '--index': index }}
                >
                  <div className="bg-[#323b5c] p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 [transform-style:preserve-3d] hover:[transform:rotateX(5deg)_rotateY(5deg)] hover:shadow-[0_8px_20px_rgba(108,122,194,0.4)]">
                    <p className="text-sm font-semibold text-[#a5b4fc] mb-2">
                      {comment.Reviewedby.empname} ({new Date(comment.createdAt).toLocaleString()})
                    </p>
                    <p className="text-sm text-[#e5e7eb] line-clamp-4">{comment.ReviewContent}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-[#2a2e47] rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.3)] transition-transform duration-300 ${isDrawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-50px)]'} max-sm:max-w-full`}>
          <button
            className="w-full bg-[#6c7ac2] text-white py-3 rounded-t-2xl text-base font-semibold transition-colors duration-300 hover:bg-[#5a68a8]"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {isDrawerOpen ? 'Close' : 'Add Comment'}
          </button>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Add a Comment:</h3>
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="4"
                className="w-full bg-[#444a68] text-[#e5e7eb] p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6c7ac2] resize-none"
                placeholder="Enter your comment here..."
                required
              />
              <button
                type="submit"
                className="bg-[#28a745] text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-[#218838] hover:-translate-y-1 shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkReviewEmp;