import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import register from '../assets/Images/register.png';
import toast from "react-hot-toast";
import { AUTH_API_ENDPOINT } from '../utils/constant';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CreateOrganizationForm = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [organization, setOrganizationState] = useState({
        organization_name: "",
        mail: "",
        adminname: "",
        adminDepartment: "",
        departments: [""],
        organizationLogo: null,
        employeeStatus: "Admin",
        price: 0,
        duration: 0,
    });

    const [validationErrors, setValidationErrors] = useState({
        organization_name: '',
        mail: '',
        adminname: '',
        adminDepartment: '',
        departments: '',
        organizationLogo: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name !== 'mail') { // Prevent changes to mail field
            setOrganizationState((prev) => ({
                ...prev,
                [name]: value,
            }));
            validateField(name, value);
        }
    };

    const handleDepartmentChange = (index, value) => {
        const updatedDepartments = [...organization.departments];
        updatedDepartments[index] = value;
        setOrganizationState((prev) => ({
            ...prev,
            departments: updatedDepartments,
        }));
        validateField('departments', updatedDepartments);
    };

    const handleSingleDepartmentChange = (index) => (e) => {
        handleDepartmentChange(index, e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setOrganizationState((prev) => ({
            ...prev,
            organizationLogo: file,
        }));
        validateField('organizationLogo', file);
    };

    const addDepartment = () => {
        if (organization.departments.length < 5) {
            setOrganizationState((prev) => ({
                ...prev,
                departments: [...prev.departments, ""],
            }));
        } else {
            setValidationErrors((prev) => ({
                ...prev,
                departments: 'Maximum 5 departments allowed',
            }));
        }
    };

    const validateField = (name, value) => {
        const errors = { ...validationErrors };
        if (name === 'organization_name') {
            errors.organization_name = value.trim() === '' ? 'Organization name is required' : '';
        } else if (name === 'mail') {
            errors.mail = !EMAIL_REGEX.test(organization.mail) ? 'Invalid email address' : '';
        } else if (name === 'adminname') {
            errors.adminname = value.trim() === '' ? 'Admin name is required' : '';
        } else if (name === 'departments') {
            errors.departments = value.some((dept) => dept.trim() === '') ? 'Department names cannot be empty' : '';
        } else if (name === 'adminDepartment') {
            errors.adminDepartment = value.trim() === '' ? 'Admin department is required' : '';
        } else if (name === 'organizationLogo') {
            errors.organizationLogo = value ? '' : 'Organization logo is required';
        }
        setValidationErrors(errors);
    };

    const validateForm = () => {
        const { organization_name, mail, adminname, departments, adminDepartment, organizationLogo } = organization;
        let valid = true;
        const errors = {};

        if (organization_name.trim() === '') {
            errors.organization_name = 'Organization name is mandatory';
            valid = false;
        }
        if (!EMAIL_REGEX.test(mail)) {
            errors.mail = 'Invalid email address';
            valid = false;
        }
        if (adminname.trim() === '') {
            errors.adminname = 'Admin name is required';
            valid = false;
        }
        if (departments.some((dept) => dept.trim() === '')) {
            errors.departments = 'Department names cannot be empty';
            valid = false;
        }
        if (adminDepartment.trim() === '') {
            errors.adminDepartment = 'Admin department is required';
            valid = false;
        }
        if (!organizationLogo) {
            errors.organizationLogo = 'Organization logo is required';
            valid = false;
        }

        setValidationErrors(errors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('organization_name', organization.organization_name);
        formData.append('mail', organization.mail);
        formData.append('adminname', organization.adminname);
        formData.append('adminDepartment', organization.adminDepartment);
        formData.append('departments', JSON.stringify(organization.departments));
        formData.append('employeeStatus', organization.employeeStatus);
        formData.append('organizationLogo', organization.organizationLogo);
        formData.append('price', organization.price);
        formData.append('duration', organization.duration);

        try {
            const response = await fetch(`${AUTH_API_ENDPOINT}/register`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Organization registered successfully!");
                navigate('/');
            } else {
                toast.error(`Registration failed: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <NavLink to="/" className="text-blue-600 mb-6">Home</NavLink>
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="organization_name"
                            value={organization.organization_name}
                            onChange={handleInputChange}
                            placeholder="Organization Name"
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {validationErrors.organization_name && (
                            <p className="text-red-500 text-sm">{validationErrors.organization_name}</p>
                        )}

                        <input
                            type="email"
                            name="mail"
                            value={organization.mail}
                            onChange={handleInputChange}
                            placeholder="Email"
                            readOnly
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                        />
                        {validationErrors.mail && <p className="text-red-500 text-sm">{validationErrors.mail}</p>}

                        <input
                            type="text"
                            name="adminname"
                            value={organization.adminname}
                            onChange={handleInputChange}
                            placeholder="Admin Name"
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {validationErrors.adminname && (
                            <p className="text-red-500 text-sm">{validationErrors.adminname}</p>
                        )}

                        {organization.departments.map((dept, index) => (
                            <input
                                key={index}
                                type="text"
                                value={dept}
                                onChange={handleSingleDepartmentChange(index)}
                                placeholder={`Department ${index + 1}`}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        ))}
                        {validationErrors.departments && (
                            <p className="text-red-500 text-sm">{validationErrors.departments}</p>
                        )}

                        {organization.departments.length < 5 && (
                            <button
                                type="button"
                                onClick={addDepartment}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Add Department
                            </button>
                        )}

                        <select
                            name="adminDepartment"
                            value={organization.adminDepartment}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select Admin Department</option>
                            {organization.departments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {validationErrors.adminDepartment && (
                            <p className="text-red-500 text-sm">{validationErrors.adminDepartment}</p>
                        )}

                        <input
                            type="file"
                            name="organizationLogo"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                        {validationErrors.organizationLogo && (
                            <p className="text-red-500 text-sm">{validationErrors.organizationLogo}</p>
                        )}

                        {organization.organizationLogo && (
                            <img
                                src={URL.createObjectURL(organization.organizationLogo)}
                                alt="Preview"
                                className="w-32 h-32 object-cover mt-2 rounded border"
                            />
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${
                                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                            } text-white px-4 py-2 rounded`}
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
                    <img src={register} alt="Register" className="max-h-96 object-contain" />
                </div>
            </div>
        </div>
    );
};

export default CreateOrganizationForm;