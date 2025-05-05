import { useEffect, useState } from "react";
import axios from "axios";
import { EMPLOYEE_API_ENDPOINT } from "../utils/constant";

const useGetEmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(`${EMPLOYEE_API_ENDPOINT}/getemployeedetails/`, {
          withCredentials: true,
        });
        setEmployee(data.employee);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  return { employee, loading, error };
};

export default useGetEmployeeDetails;
