import React, { useState } from 'react';
import axios from 'axios';
import '../assets/styles/Loginasemp.css';
import { useNavigate } from 'react-router-dom';
import { AUTH_API_ENDPOINT } from '../utils/constant';
import Login from '../assets/Images/login.png';
import { useDispatch } from 'react-redux';
import { setEmployeeId } from '../redux/employeeSlice';
import { setadminname, setorganizationId, setorganizationLogo } from '../redux/adminSlice';

const LoginasEmp = () => {
  const [credentials, setCredentials] = useState({
    organization_name: '',
    mail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${AUTH_API_ENDPOINT}/login`, credentials);
      if (response.data.success && response.data.employee) {
        const { employee, adminname, organization_name, organization_logo } = response.data;
        dispatch(setEmployeeId(employee._id)); 
        dispatch(setadminname(adminname));
        dispatch(setorganizationId(employee.organization));
        dispatch(setorganizationLogo(organization_logo));
        if (employee.profilePhoto) {
          dispatch(setProfilePhoto(employee.profilePhoto));
        }
        setMessage(response.data.message);
        setError('');
        navigate('/EmployeeHome');
      } else {
        setError(response.data.error || 'Invalid login credentials');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="iform">
            <input
              type="text"
              name="organization_name"
              value={credentials.organization_name}
              onChange={handleInputChange}
              required
              placeholder="Organization Name"
            />
          </div>
          <div className="iform">
            <i className="zmdi zmdi-email"></i>
            <input
              type="email"
              name="mail"
              value={credentials.mail}
              onChange={handleInputChange}
              required
              placeholder="Email"
            />
          </div>
          <div className="iform">
            <i className="zmdi zmdi-lock"></i>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Enter Your Password"
            />
          </div>
          <div className="forgot">
            <button type="button" onClick={() => navigate('/Forgetpassword')}>
              Forget Password
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
      </div>
      <div className="login-image">
        <img src={Login} alt="A boy is logging in" />
      </div>
      <div className="navigation-button">
        <button onClick={() => navigate('/')}>Home</button>
      </div>
    </div>
  );
};

export default LoginasEmp;
