import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ADMIN_API_ENDPOINT, DEPARTMENT_API_ENDPOINT } from '../../utils/constant';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const AddEmployee = () => {
  const [loading, setLoading] = useState(false);
  const organizationId = useSelector((store) => store.auth.employee.organization);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    empname: '',
    mail: '',
    password: '',
    department: '',
    Employeestatus: 'Employee',
    rating: 2,
    projectspending: 0,
    age: '', // Added age field
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${DEPARTMENT_API_ENDPOINT}/organization/${organizationId}/departments`);
        setDepartments(response.data.departments || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setError('Failed to load departments');
        toast.error('Failed to load departments');
      }
    };

    if (organizationId) {
      fetchDepartments();
    } else {
      setError('Organization ID not found. Please log in again.');
      toast.error('Organization ID not found');
    }
  }, [organizationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) || '' : value, // Convert age to integer, allow empty string for clearing
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${ADMIN_API_ENDPOINT}/addemployee/${organizationId}`,
        formData,
        { withCredentials: true }
      );
      setFormData({
        empname: '',
        mail: '',
        password: '',
        department: '',
        Employeestatus: 'Employee',
        rating: 2,
        projectspending: 0,
        age: '', // Reset age field
      });
      toast.success("Employee Added Successfully");
      navigate(-1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error in adding employee";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-gray-50">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mb-6"
          onClick={() => navigate(-1)}
        >
          Back to Dashboard
        </button>
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Add New Employee</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="empname" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="empname"
                name="empname"
                value={formData.empname}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="mail" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="mail"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="100"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={!departments.length}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{departments.length ? 'Select a Department' : 'No departments available'}</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !organizationId || !formData.department}
              className="w-full mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
            >
              {loading ? 'Loading...' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;