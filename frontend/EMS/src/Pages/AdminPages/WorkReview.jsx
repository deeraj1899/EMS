import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import useGetAllReviews from '../../hooks/UseGetAllReviews';
import '../../assets/styles/WorkReview.css';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';
import { clearSelectedWork } from '../../redux/SubmitWorkSlice';
import { useNavigate } from 'react-router-dom';

const WorkReview = () => {
  const dispatch = useDispatch(); // Add this line to use dispatch
  const { submittedWorkId, submittedBy, githubLink, title, description } = useSelector(state => state.SubmitWork);
  const organization = useSelector(store => store.admin.organizationId);
  const employee = useSelector(store => store.employee.employeeId);
  const [newComment, setNewComment] = useState('');
  const { comments, error, loading, refetch } = useGetAllReviews(submittedWorkId || null);
  const navigate = useNavigate();

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${ADMIN_API_ENDPOINT}/addreview`, {
        organization,
        Reviewedby: employee,
        WorkContent: submittedWorkId,
        ReviewContent: newComment
      });
      refetch();
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!submittedWorkId) {
    return <p>Loading submitted work...</p>; 
  }

  const handleback = () => {
    dispatch(clearSelectedWork()); 
    navigate(`/adminHome/review-work/${employee}`);
  }

  return (
    <div className="work-review-container">
      <button onClick={handleback}>Back</button>
      <h2>{title}</h2>
      <p>{description}</p>
      <p><strong>Submitted By:</strong> {submittedBy}</p>
      <a href={githubLink} target="_blank" rel="noopener noreferrer">GitHub Link</a>

      <div className="comments-section">
        <h3>Comments:</h3>
        {loading ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p>Error loading comments.</p>
        ) : comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <p><strong>{comment.Reviewedby.empname}:</strong> {comment.ReviewContent}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="add-comment">
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            placeholder="Enter your comment here"
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default WorkReview;
