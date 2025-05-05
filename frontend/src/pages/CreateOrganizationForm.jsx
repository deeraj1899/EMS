import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import register from '../assets/Images/register.png';
import toast from "react-hot-toast";
import { AUTH_API_ENDPOINT } from '../utils/constant';

const CreateOrganizationForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [organization, setOrganization] = useState({
    organization_name: "",
    mail: "",
    adminname: "",
    adminDepartment: "",
    departments: [""],
    organizationLogo: null,
    employeeStatus: "Admin"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(organization).forEach(key => {
        formData.append(key, organization[key]);
      });

      const response = await fetch(`${AUTH_API_ENDPOINT}/auth/register`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
};

export default CreateOrganizationForm;