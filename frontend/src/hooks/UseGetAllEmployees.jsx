// UseGetAllEmployees.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ADMIN_API_ENDPOINT } from '../utils/constant';

const UseGetAllEmployees = () => {
  const organizationId = useSelector(store => store.auth.employee.organization);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_ENDPOINT}/getallemployees/${organizationId}`, { withCredentials: true });
        console.log(response);
        
        setEmployees(response.data.employees); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to fetch employees');
        setLoading(false);
      }
    };

    if (organizationId) { 
      fetchEmployees();
    }
  }, [organizationId]);

  return { employees, loading, error };
};

export default UseGetAllEmployees;
