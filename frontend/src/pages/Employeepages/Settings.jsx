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
      const res = await axios.post(`${EMPLOYEE_API_ENDPOINT}/changepassword`, { password }, { withCredentials: true });
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
      const res = await axios.post(`${EMPLOYEE_API_ENDPOINT}/updateProfile`, formData, { withCredentials: true });
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
    <div className="min-h-screen bg-gradient-to-b from-[#12172b] to-[#1e1e2f] text-white font-['Inter'] flex flex-col items-center pt-20 px-8 pb-8">
      <div className="w-full max-w-xl text-center">
        <button
          className="bg-gray-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer mb-8 transition-all duration-300 shadow-lg hover:bg-gray-700 hover:-translate-y-1"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold mb-8 text-white">Settings</h2>

        {/* Cube Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveSection('password')}
            className={`bg-[#2a2e47] text-gray-200 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300 hover:bg-[#444a68] hover:scale-105 ${
              activeSection === 'password' ? 'bg-[#6c7ac2] text-white scale-105' : ''
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`bg-[#2a2e47] text-gray-200 py-3 px-6 rounded-lg text-base font-semibold transition-all duration-300 hover:bg-[#444a68] hover:scale-105 ${
              activeSection === 'profile' ? 'bg-[#6c7ac2] text-white scale-105' : ''
            }`}
          >
            Update Profile
          </button>
        </div>

        {/* 3D Cube Wrapper with Perspective */}
        <div className="perspective-[1000px]">
          <div
            className={`relative w-full h-[400px] [transform-style:preserve-3d] transition-transform duration-[600ms] ease-in-out ${
              activeSection === 'profile' ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* Front Face (Password) */}
            <div
              className="absolute w-full h-full bg-[#2a2e47]/90 rounded-xl p-8 shadow-xl flex justify-center items-center [backface-visibility:hidden] [transform:translateZ(200px)]"
            >
              <form onSubmit={handlePasswordChange} className="flex flex-col w-full">
                <h3 className="text-xl font-bold mb-6 text-indigo-300">Change Password</h3>
                <label className="mb-4 text-base font-semibold text-gray-200 text-left">New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-3 py-3 bg-[#444a68] text-gray-200 rounded-lg text-sm mt-2 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#6c7ac2]/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="mb-4 text-base font-semibold text-gray-200 text-left mt-4">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-3 py-3 bg-[#444a68] text-gray-200 rounded-lg text-sm mt-2 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#6c7ac2]/50"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-green-600 text-white py-3 rounded-lg text-sm font-semibold mt-4 transition-all duration-300 hover:bg-green-700 hover:scale-105 shadow-md ${
                    loading ? 'bg-gray-600 cursor-not-allowed transform-none' : ''
                  }`}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Back Face (Profile) */}
            <div
              className="absolute w-full h-full bg-[#2a2e47]/90 rounded-xl p-8 shadow-xl flex justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(200px)]"
            >
              <form onSubmit={handleProfileUpdate} className="flex flex-col w-full">
                <h3 className="text-xl font-bold mb-6 text-indigo-300">Update Profile</h3>
                <label className="mb-4 text-base font-semibold text-gray-200 text-left">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-3 bg-[#444a68] text-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-600 file:text-white file:cursor-pointer"
                  onChange={(e) => setProfilePic(e.target.files?.[0])}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-green-600 text-white py-3 rounded-lg text-sm font-semibold mt-4 transition-all duration-300 hover:bg-green-700 hover:scale-105 shadow-md ${
                    loading ? 'bg-gray-600 cursor-not-allowed transform-none' : ''
                  }`}
                >
                  {loading ? 'Uploading...' : 'Upload Picture'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;