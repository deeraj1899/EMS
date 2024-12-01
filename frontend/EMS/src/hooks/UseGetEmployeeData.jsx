import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { EMPLOYEE_API_ENDPOINT } from '../utils/constant';
import { setEmployeeData } from '../redux/employeeSlice';
import { setadminname } from '../redux/authSlice';

const UseGetEmployeeData = () => {
  const dispatch = useDispatch();
  const employeeId = useSelector((state) => state.employee.employeeId);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId || typeof employeeId !== 'string') {
        console.error("Invalid employeeId:", employeeId);
        return;
      }

      try {
        const response = await axios.get(`${EMPLOYEE_API_ENDPOINT}/getemployeedetails/${employeeId}`);
        if (response.data.success) {
          const { employee, adminName } = response.data.data;
          dispatch(setEmployeeData(employee));
          dispatch(setadminname(adminName));
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [employeeId, dispatch]);

  return null;
};
export default UseGetEmployeeData;
