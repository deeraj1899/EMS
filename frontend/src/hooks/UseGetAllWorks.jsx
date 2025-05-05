import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EMPLOYEE_API_ENDPOINT } from '../utils/constant';

const UseGetAllWorks = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const employeeId = useSelector((store) => store.auth.employee?._id);

  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${EMPLOYEE_API_ENDPOINT}/getallworks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("employeeToken")}`,
        },
        withCredentials:true
      });
      if (response.data.success) {
        setWorks(response.data.works);
      } else {
        setError(response.data.message || "Failed to fetch works");
      }
    } catch (error) {
      setError(error.message || "Error fetching works");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) fetchWorks();
  }, [employeeId]);

  return { works, loading, error, refetch: fetchWorks };
};

export default UseGetAllWorks;
