import React from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Calendar,
  Building,
  Star,
  ClipboardList,
  Crown,
  CheckCircle,
  LogOut,
  Home,
  Briefcase,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useGetEmployeeDetails from "../../hooks/useGetEmployeeDetails";

const EmployeeHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const employeeId = useSelector((state) => state.auth.employee?._id);
  const { employee, loading, error } = useGetEmployeeDetails(employeeId);
    const organization = useSelector((state) => state.auth.organization);

  const navItems = [
    { label: "Home", icon: <Home />, path: "/EmployeeHome" },
    { label: "Projects", icon: <Briefcase />, path: "/EmployeeHome/Works" },
    { label: "Reviews", icon: <MessageSquare />, path: "/EmployeeHome/reviews" },
    { label: "Leave Request", icon: <Calendar />, path: "/EmployeeHome/leave-request" },
    { label: "Settings", icon: <Settings />, path: "/EmployeeHome/settings" },
    { label: "Mark Attendance", icon: <CheckCircle />, path: "/EmployeeHome/mark-attendance" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div className="flex items-center gap-2">
          {organization?.organization_logo ? (
            <img
              src={organization.organization_logo}
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
          ) : (
            <span className="font-bold text-lg">Logo</span>
          )}
          <h1 className="text-xl font-semibold">Employee Dashboard</h1>
        </div>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition ${
                isActive(item.path) ? "bg-gray-200 text-blue-600 font-semibold" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {employee?.Employeestatus !== "Employee" && (
            <button
              onClick={() => navigate("/EmployeeHome/adminLogin")}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
            >
              <Crown />
              Admin Login
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 px-3 py-2 rounded-md hover:bg-red-100 transition"
          >
            <LogOut />
            Logout
          </button>
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          {employee?.profilePhoto ? (
            <img
              src={employee.profilePhoto}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl">
              No Image
            </div>
          )}
          <h2 className="text-2xl font-semibold mt-4">
            {employee?.empname}'s Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
            {/* Personal Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <User className="text-blue-500" />
                <h3 className="text-lg font-semibold">Personal Details</h3>
              </div>
              <p><span className="font-medium">Name:</span> {employee?.empname}</p>
              <p><span className="font-medium">Email:</span> {employee?.mail}</p>
            </div>

            {/* Department Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building className="text-green-500" />
                <h3 className="text-lg font-semibold">Department Info</h3>
              </div>
              <p><span className="font-medium">Department:</span> {employee?.departmentName}</p>
              <p><span className="font-medium">Status:</span> {employee?.Employeestatus}</p>
              <p><span className="font-medium">Rating:</span> {employee?.rating ?? "N/A"}</p>
            </div>

            {/* Projects Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="text-yellow-500" />
                <h3 className="text-lg font-semibold">Projects</h3>
              </div>
              <p><span className="font-medium">Pending:</span> {employee?.projectspending ?? "0"}</p>
            </div>

            {/* Admin Info */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="text-purple-500" />
                <h3 className="text-lg font-semibold">Admin Info</h3>
              </div>
              <p><span className="font-medium">Admin Name:</span> {organization?.adminname || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
