import { useState, useEffect } from 'react';
import axios from 'axios';
import { ADMIN_API_ENDPOINT } from '../utils/constant';

const useGetAllReviews = (submittedWorkId) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchComments = async () => {
      if (!submittedWorkId) {
        console.log('No submittedWorkId provided');
        return; 
      }
      setLoading(true);
      try {
        const url = `${ADMIN_API_ENDPOINT}/review/${submittedWorkId}`;
        const response = await axios.get(url);
        setComments(response.data.reviews); 
        setError(null);
      } catch (error) {
        setError(error);
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };    
    fetchComments(); 
  }, [submittedWorkId]); 

  return { comments, error, loading };
};
export default useGetAllReviews;
