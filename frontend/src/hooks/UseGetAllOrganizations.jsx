import axios from 'axios';
import { useEffect, useState } from 'react';
import { ADMIN_API_ENDPOINT } from '../utils/constant';

const UseGetAllOrganizations = () => {
  const [organizationData, setOrganizationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrganizations = async () => {
      try {
        const response = await axios.get(`${ADMIN_API_ENDPOINT}/getallorganizations`);
        if (response.data.success) {
          setOrganizationData(response.data.organizations);
        } else {
          console.error('Failed to fetch organizations:', response.data.message);
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching organizations:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrganizations();
  }, []);

  return { organizationData, loading, error };
};

export default UseGetAllOrganizations;
