import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar'; 
import '../../assets/styles/AddEmployee.css';

const AddEmployee = () => {
  
  const { id: employeeId } = useParams();
  const organizationId = useSelector(store => store.admin.organizationId);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    empname: '',
    mail: '',
    password: '',
    age: '',
    Employeestatus: 'Employee',
    rating: 2,
    projectspending: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      // console.log("from frontend");
      const response = await axios.post(
        `${ADMIN_API_ENDPOINT}/addemployee/${employeeId}/${organizationId}`,
        formData
      );
      console.log("Response from server:", response);
      setFormData({
        empname: '',
        mail: '',
        password: '',
        age: '',
        Employeestatus: 'Employee',
        rating: 2,
        projectspending: 0,
      });
      navigate(`/adminhome/${employeeId}`);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="addemployee-layout">
      <Sidebar />
      <div className="addemployee-container">
        <button className="back-button" onClick={() => navigate(`/adminhome/${employeeId}`)}>
          Back to Dashboard
        </button>
        <div className="form-container">
          <h2>Add New Employee</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="empname"
                value={formData.empname}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Age:
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Add Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
