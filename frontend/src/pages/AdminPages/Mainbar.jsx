import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import UseGetDepartmentEmployees from '../../hooks/UseGetDepartmentEmployees';
import UseGetAllEmployees from '../../hooks/UseGetAllEmployees';

const EmployeeCard = ({ employee }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <div className="flex items-center space-x-4 mb-4">
      {employee.profilePhoto ? (
        <img src={employee.profilePhoto} alt={employee.empname} className="w-16 h-16 rounded-full object-cover" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">N/A</div>
      )}
      <div>
        <h3 className="text-lg font-semibold">{employee.empname}</h3>
        <p className="text-sm text-gray-500">{employee.departmentName}</p>
      </div>
    </div>
    <ul className="text-sm text-gray-700 space-y-1">
      <li><strong>Email:</strong> {employee.mail}</li>
      <li><strong>Age:</strong> {employee.age || 'N/A'}</li>
      <li><strong>Status:</strong> {employee.Employeestatus}</li>
      <li><strong>Rating:</strong> {employee.rating || 'N/A'}</li>
      <li><strong>Projects Pending:</strong> {employee.projectspending ?? 'N/A'}</li>
    </ul>
  </div>
);

const EmployeeList = ({ employees }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    {employees.length === 0 ? (
      <p className="text-center text-gray-500">No employees found.</p>
    ) : (
      employees.map(emp => <EmployeeCard key={emp._id} employee={emp} />)
    )}
  </div>
);

const AdminView = () => {
  const { employees, loading, error } = UseGetAllEmployees();
  if (loading) return <p className="text-center text-gray-600">Loading employees admin...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  return <EmployeeList employees={employees} />;
};

const ManagerView = ({ managerId }) => {
  const { employees, loading, error } = UseGetDepartmentEmployees({ managerId });
  if (loading) return <p className="text-center text-gray-600">Loading employees...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  return <EmployeeList employees={employees} />;
};

const Mainbar = () => {
    const navigate = useNavigate();
    const [isManager, setIsManager] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const employee = useSelector((state) => state.auth?.employee);
    
    const adminId = employee?._id;
    const adminRole = employee?.Employeestatus;
  
    useEffect(() => {
      if (!adminId) {
        toast.error('Invalid or missing admin ID. Please log in again.');
        // navigate('/');
        return;
      }
  
      setIsManager(adminRole === 'Manager');
      setRoleLoading(false);
    }, [adminId, adminRole, navigate]);
  
    if (roleLoading) return <p className="text-center text-gray-600 mt-6">Loading user role...</p>;
  
    return (
      <section className="px-6 py-6">
        {isManager ? <ManagerView managerId={adminId} /> : <AdminView />}
      </section>
    );
  };
  
  export default Mainbar;