import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrganization, setLoading } from '../redux/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/styles/createorg.css';
import register from '../assets/Images/register.png';
import { AUTH_API_ENDPOINT } from '../utils/constant';

const CreateOrganizationForm = () => {
  const [organization, setOrganizationState] = useState({
    organization_name: "",
    mail: "",
    adminname: ""
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    organization_name: '',
    mail: '',
    adminname: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizationState(prevState => ({
      ...prevState,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...validationErrors };
    if (name === 'organization_name') {
      errors.organization_name = value.trim() === '' ? 'Organization name is required' : '';
    } else if (name === 'mail') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      errors.mail = !emailPattern.test(value) ? 'Invalid email address' : '';
    } else if (name === 'adminname') {
      errors.adminname = value.trim() === '' ? 'Admin name is required' : '';
    }
    setValidationErrors(errors);
  };

  const validateForm = () => {
    const { organization_name, mail, adminname } = organization;
    let valid = true;
    let errors = {};

    if (organization_name.trim() === '') {
      errors.organization_name = 'Organization name is required';
      valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(mail)) {
      errors.mail = 'Invalid email address';
      valid = false;
    }
    if (adminname.trim() === '') {
      errors.adminname = 'Admin name is required';
      valid = false;
    }

    setValidationErrors(errors);
    return valid;
  };

  const PostData = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError('Please fix the errors above.');
      return;
    }

    dispatch(setLoading(true));

    try {
      const { organization_name, mail, adminname } = organization;
      const res = await fetch(`${AUTH_API_ENDPOINT}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          organization_name,
          mail,
          adminname
        })
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        throw new Error('Invalid JSON response');
      }

      if (res.status === 201) {
        setMessage(data.message);
        setError('');
        dispatch(setOrganization({ organization_name, mail, adminname }));

        navigate(`/adminform`);
      } else {
        setError(data.error || 'Failed to register organization');
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to register organization:', error);
      setError('Failed to register organization');
      setMessage('');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="createOrgmain">
      <NavLink to='/'>Home</NavLink>
      <div className="createOrg">
        <div className="orgForm">
          <form method='POST' onSubmit={PostData}>
            <div className="itag">
              <i className="zmdi zmdi-library"></i>
              <input
                type="text"
                name="organization_name"
                value={organization.organization_name}
                onChange={handleInputChange}
                required
                placeholder='Organization Name'
              />
              {validationErrors.organization_name && <p className="error-message">{validationErrors.organization_name}</p>}
            </div>
            <div className="itag">
              <i className="zmdi zmdi-email"></i>
              <input 
                type="email"
                name="mail"
                value={organization.mail}
                onChange={handleInputChange}
                required
                placeholder='Email'
              />
              {validationErrors.mail && <p className="error-message">{validationErrors.mail}</p>}
            </div>
            <div className="itag">
              <i className="zmdi zmdi-account"></i>
              <input
                type="text"
                name="adminname"
                value={organization.adminname}
                onChange={handleInputChange}
                required
                placeholder='Admin Name'
              />
              {validationErrors.adminname && <p className="error-message">{validationErrors.adminname}</p>}
            </div>
            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </div>
        <div className="orgImage">
          <img src={register} alt="A girl is trying to do registration" />
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationForm;
