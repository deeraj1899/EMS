import React, { useState } from 'react';
import '../../assets/styles/settings.css';
import EmployeeHeader from './EmployeeHeader';
import axios from 'axios';
import { EMPLOYEE_API_ENDPOINT } from '../../utils/constant';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../redux/LoadSlice';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('changePassword');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const employeeId = useSelector((store) => store.employee.employeeId);
  const isLoading = useSelector((store) => store.load.isLoading);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    file: null,
  });

  const changeFileHandler = (e) => {
    setFormData({ ...formData, file: e.target.files?.[0] });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`${EMPLOYEE_API_ENDPOINT}/changepassword/${employeeId}`, {
        password,
      });
      if (response.status === 200) {
        setSuccessMessage('Password successfully updated.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setErrorMessage('Failed to update password. Please try again.');
    } finally {
      setPassword('');
      setConfirmPassword('');
      dispatch(setLoading(false));
    }
  };

  const handleUpdateInformation = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`${EMPLOYEE_API_ENDPOINT}/updateProfile/${employeeId}`, formDataToSend);
      if (response.status === 200) {
        setSuccessMessage('Profile information successfully updated.');
        setFormData({ file: null });
      }
    } catch (error) {
      console.error('Error updating profile information:', error);
      setErrorMessage('Failed to update profile information. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderContent = () => {
    if (activeTab === 'changePassword') {
      return (
        <div className="settings-info">
          <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <label>
              New Password:
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </label>
            <label>
              Confirm Password:
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Submit'}
            </button>
          </form>
        </div>
      );
    } else if (activeTab === 'updateInformation') {
      return (
        <div className="settings-info">
          <form className="settings-form" onSubmit={handleUpdateInformation}>
            <label>
              Profile Picture
              <input 
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Submit'}
            </button>
          </form>
        </div>
      );
    }
  };

  return (
    <div className="settings-container">
      <EmployeeHeader />
      <h2>Settings</h2>
      <div className="tabs-container">
        <h3
          className={activeTab === 'changePassword' ? 'active-tab' : ''}
          onClick={() => handleTabClick('changePassword')}
        >
          Change Password
        </h3>
        <h3
          className={activeTab === 'updateInformation' ? 'active-tab' : ''}
          onClick={() => handleTabClick('updateInformation')}
        >
          Update Information
        </h3>
      </div>
      {isLoading && <p className="loading-indicator">Loading...</p>}
      <div className="content-container">{renderContent()}</div>
    </div>
  );
};

export default Settings;
