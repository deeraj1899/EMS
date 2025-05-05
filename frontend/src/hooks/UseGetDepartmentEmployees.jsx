import { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_ENDPOINT } from '../utils/constant';

const UseGetDepartmentEmployees = ({ managerId }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartmentEmployees = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_ENDPOINT}/getdepartmentemployees/${managerId}`, {
          withCredentials: true,
        });

        setEmployees(response.data.employees);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching department employees:', err);
        setError('Failed to fetch department employees');
        setLoading(false);
      }
    };

    if (managerId) {
      fetchDepartmentEmployees();
    }
  }, [managerId]);

  return { employees, loading, error };
};

export default UseGetDepartmentEmployees;
