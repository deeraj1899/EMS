import React, { useState } from 'react';
import axios from 'axios';
import { EMPLOYEE_API_ENDPOINT } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('password');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const employeeId = localStorage.getItem('employeeId');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${EMPLOYEE_API_ENDPOINT}/changepassword`, { password },{withCredentials:true});
      if (res.status === 200) {
        toast.success('Password updated successfully.');
        setPassword('');
        setConfirmPassword('');
        navigate(-1);
      }
    } catch (err) {
      toast.error('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profilePic) {
      toast.error('Please select a profile picture.');
      return;
    }

    const formData = new FormData();
    formData.append('file', profilePic);

    try {
      setLoading(true);
      const res = await axios.post(`${EMPLOYEE_API_ENDPOINT}/updateProfile`, formData,{withCredentials:true});
      if (res.status === 200) {
        toast.success('Profile picture updated successfully.');
        setProfilePic(null);
        navigate(-1);
      }
    } catch (err) {
      toast.error('Failed to update profile picture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
        <button
          className="text-blue-600 mb-4 hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Settings</h2>
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveSection('password')}
            className={`px-4 py-2 rounded ${
              activeSection === 'password'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-4 py-2 rounded ${
              activeSection === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Update Profile
          </button>
        </div>
        {activeSection === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full border px-3 py-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {activeSection === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setProfilePic(e.target.files?.[0])}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              {loading ? 'Uploading...' : 'Upload Picture'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
