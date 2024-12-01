import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../assets/styles/AdminForm.css'; 
import axios from "axios";
import { AUTH_API_ENDPOINT } from '../utils/constant';
import { resetOrganization } from '../redux/authSlice';

const AdminForm = () => {
  const [employee, setEmployee] = useState({
    password: '',
    age: '',
    Employeestatus: 'Admin',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const organization = useSelector((state) => state.auth.organization);
  const organizationName = organization?.organization_name || '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    if (employee.password.length < 6) {
      setError('Password must be at least 6 characters');
      valid = false;
    } else if (employee.age < 18) {
      setError('Age must be at least 18');
      valid = false;
    } else {
      setError('');
    }
    return valid;
  };

  const changeFileHandler = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("password", employee.password);
      formData.append("age", employee.age);
      formData.append("Employeestatus", employee.Employeestatus);
      formData.append("organizationName", organizationName);
      formData.append("file", file);
      const response = await axios.post(`${AUTH_API_ENDPOINT}/admindetails`, formData);
      setMessage(response.data.message);
      setError('');

      dispatch(resetOrganization());
      setTimeout(() => {
        navigate(`/`);
      }, 2000); 
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error.response?.data?.error || 'Server error');
      setMessage('');
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-content">
        <h1>Admin Form</h1>
        {organization && (
          <>
            <h2>Hello {organization.adminname}</h2>
            <h2>Organization Name: {organization.organization_name}</h2>
            <h2>Email: {organization.mail}</h2>
          </>
        )}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={employee.age}
              onChange={handleChange}
              required
            />
          </div>   
          <div>
            <label>Organization Logo:</label>
            <input 
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
            />
          </div>
          <button type="submit">Save Employee</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminForm;
