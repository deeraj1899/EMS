import React, { useState } from 'react';
import EmployeeHeader from '../Employeepages/EmployeeHeader';
import '../../assets/styles/AdminLogin.css';
import axios from 'axios';
import { EMPLOYEE_API_ENDPOINT } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setadminname, setorganizationId } from '../../redux/adminSlice';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const dispatch=useDispatch();
  const employeeId = useSelector(store => store.employee.employeeId);
  const adminname=useSelector(store=>store.auth.adminname);
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();     
        try {
          const response = await axios.post(`${EMPLOYEE_API_ENDPOINT}/adminlogin/${employeeId}`, {
            mail: email,
            adminCode
          });
          if (response.data.success) {
            const organizationId=response.data.organizationId
            dispatch(setadminname(adminname));
            dispatch(setorganizationId(organizationId));
            navigate(`/adminHome/${employeeId}`);
          }
        } catch (error) {
          console.error("Error logging in:", error);
        }
      };
      
  

  return (
    <div className="admin-login">
      <EmployeeHeader />
      <div className="admin-login__box">
        <h2 className="admin-login__title">Admin Login</h2>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-login__field">
            <label htmlFor="adminCode">Admin Code:</label>
            <input
              type="password"
              id="adminCode"
              placeholder="Enter admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login__submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
