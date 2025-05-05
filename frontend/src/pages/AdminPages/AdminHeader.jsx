import React from "react";
import { useSelector } from "react-redux";
import {
  FaSignOutAlt, FaUserPlus, FaTasks, FaClipboardCheck,
  FaCalendarCheck, FaUserMinus, FaPaperPlane, FaEye
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { EMPLOYEE_API_ENDPOINT } from "../../utils/constant";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { organization, employee } = useSelector(state => state.auth);

  const handleLogOut = async () => {
    await axios.get(`${EMPLOYEE_API_ENDPOINT}/logout`, { withCredentials: true });
    toast.success("Logged out successfully");
    navigate('/');
  };

  const isAdmin = employee?.Employeestatus === 'Admin';
  const isManager = employee?.Employeestatus === 'Manager';

  return (
    <header className="bg-white shadow-md px-6 py-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center space-x-4">
        {organization?.organization_logo ? (
          <img src={organization.organization_logo} alt="Org Logo" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">N/A</div>
        )}
        <div>
          <h2 className="text-lg font-semibold">{employee?.empname || 'Unknown Admin'}</h2>
          <p className="text-sm text-gray-500">{employee?.Employeestatus || 'Role N/A'}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center mt-4 md:mt-0 gap-4">
        {/* Admin-only actions */}
        {isAdmin && (
          <>
            <Link to={`/adminHome/add-employee`} className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <FaUserPlus /> Add Employee
            </Link>
            <Link to={`/adminHome/delete-employee`} className="flex items-center gap-2 text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              <FaUserMinus /> Delete Employee
            </Link>
            <Link to={`/adminHome/promote-employee`} className="flex items-center gap-2 text-sm px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              <FaPaperPlane /> Promote Employee
            </Link>
          </>
        )}

        {/* Admin and Manager shared actions */}
        {(isAdmin || isManager) && (
          <>
            <Link to={`/adminHome/add-work`} className="flex items-center gap-2 text-sm px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <FaTasks /> Assign Work
            </Link>
            <Link to={`/adminHome/review-work`} className="flex items-center gap-2 text-sm px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
              <FaClipboardCheck /> Review Work
            </Link>
            <Link to={`/adminHome/approve-leave`} className="flex items-center gap-2 text-sm px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              <FaCalendarCheck /> Leave Requests
            </Link>
            <Link to={`/adminHome/view-attendance`} className="flex items-center gap-2 text-sm px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
              <FaEye /> View Attendance
            </Link>
          </>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 text-sm px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;