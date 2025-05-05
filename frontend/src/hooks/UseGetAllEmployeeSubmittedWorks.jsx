import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { EMPLOYEE_API_ENDPOINT } from '../utils/constant';

const UseGetAllEmployeeSubmittedWorks = () => {
  const employeeId = useSelector((store) => store.auth.employee?._id);
  const [submittedWorks, setSubmittedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllSubmittedWorks = async () => {
      if (!employeeId) {
        setError("No employee ID found");
        setLoading(false);
        return;
      }

      try {
        // console.log(employeeId);
        const response = await axios.get(`${EMPLOYEE_API_ENDPOINT}/getsubmittedworks`,
            {
                withCredentials:true
            }
        );
        // console.log(response.data); 
        setSubmittedWorks(response.data.submittedWorks);
      } catch (err) {
        console.error("Error details:", err); 
        if (err.response) {
          setError(err.response.data.message || "An error occurred while fetching submitted works.");
        } else if (err.request) {
          setError("No response received from the server.");
        } else {
          setError("Network error. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    getAllSubmittedWorks(); 
  }, [employeeId]); 

  return { submittedWorks, loading, error }; 
};

export default UseGetAllEmployeeSubmittedWorks;
