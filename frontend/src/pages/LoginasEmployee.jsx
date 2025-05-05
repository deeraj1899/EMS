import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';
import { setUser } from '../redux/authSlice';
import Login from '../assets/Images/login.png';
import { AUTH_API_ENDPOINT } from '../utils/constant';

const LoginasEmp = () => {
  const [credentials, setCredentials] = useState({
    organization_name: '',
    mail: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      const res = await axios.post(`${AUTH_API_ENDPOINT}/login`, credentials, {
        withCredentials: true
      });

      if (res.data.success) {
        dispatch(setUser(res.data.data));
        toast.success("Login successful");
        navigate('/employee-dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
        <div className="md:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${Login})` }}>
          <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
            <h2 className="text-white text-4xl font-bold">Welcome Back</h2>
          </div>
        </div>
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Organization Name</label>
              <input
                type="text"
                name="organization_name"
                value={credentials.organization_name}
                onChange={handleInputChange}
                required
                className="mt-2 px-4 py-2 w-full border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="relative">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  name="mail"
                  value={credentials.mail}
                  onChange={handleInputChange}
                  required
                  className="mt-2 px-4 py-2 pl-10 w-full border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Password</label>
              <div className="relative">
                <FiLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                  className="mt-2 px-4 py-2 pl-10 w-full border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate('/forgotpassword')}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-500 hover:underline"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginasEmp;
