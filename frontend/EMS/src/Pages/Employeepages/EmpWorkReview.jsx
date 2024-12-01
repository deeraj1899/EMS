import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useGetAllReviews from '../../hooks/UseGetAllReviews';
import '../../assets/styles/EmpWorkReview.css';
import { ADMIN_API_ENDPOINT, EMPLOYEE_API_ENDPOINT } from '../../utils/constant';

const EmpWorkReview = () => {
  const { submittedWorkId, submittedBy, githubLink, title, description } = useSelector(state => state.SubmitWork);
  const organization = useSelector(store => store.admin.organizationId); 
  const employee = useSelector(store => store.employee.employeeId);
  const [newComment, setNewComment] = useState('');
  const { comments, error, loading, refetch } = useGetAllReviews(submittedWorkId || null);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!organization) {
      console.error('Organization ID is required.');
      return;
    }
    try {
      await axios.post(`${ADMIN_API_ENDPOINT}/addreview`, {
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

  return (
    <div className="emp-work-review-container">
      <h2>{title}</h2>
      <p>{description}</p>
      <p><strong>Submitted By:</strong> {submittedBy}</p>
      <a href={githubLink} target="_blank" rel="noopener noreferrer">GitHub Link</a>

      <div className="emp-comments-section">
        <h3>Comments:</h3>
        {loading ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p>Error loading comments.</p>
        ) : comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="emp-comment-item">
              <p><strong>{comment.Reviewedby.empname}:</strong> {comment.ReviewContent}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="emp-add-comment">
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

export default EmpWorkReview;
