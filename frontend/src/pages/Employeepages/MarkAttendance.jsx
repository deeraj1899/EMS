import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Briefcase, MessageSquare, Calendar, Settings,
  CheckCircle, LogOut, Crown
} from "lucide-react";
import { toast } from "react-hot-toast";
import { ATTENDANCE_API_ENDPOINT } from "../../utils/constant";

const navItems = [
  { label: "Home", icon: <Home />, path: "/employee-dashboard" },
  { label: "Projects", icon: <Briefcase />, path: "/EmployeeHome/Works" },
  { label: "Reviews", icon: <MessageSquare />, path: "/EmployeeHome/reviews" },
  { label: "Leave Request", icon: <Calendar />, path: "/EmployeeHome/leave-request" },
  { label: "Settings", icon: <Settings />, path: "/EmployeeHome/settings" },
  { label: "Mark Attendance", icon: <CheckCircle />, path: "/EmployeeHome/mark-attendance" },
];

const MarkAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = useSelector((state) => state.auth.employee);
  const organization = useSelector((state) => state.auth.organization);
  const employeeId = employee?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = (path) => location.pathname === path;

  const openModal = () => {
    if (!employeeId) {
      toast.error("Employee ID is missing.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const payload = { employeeId };
      const response = await axios.post(
        `${ATTENDANCE_API_ENDPOINT}/check-in`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        closeModal();
      } else {
        toast.error(response.data.message || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error?.response?.data?.message || "Error marking attendance.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#12172b] to-[#1e1e2f] text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-white text-gray-800 px-6 py-4 shadow">
        <div className="flex items-center gap-2">
          {organization?.organization_logo ? (
            <img src={organization.organization_logo} alt="Logo" className="w-10 h-10 object-contain" />
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

      {/* Content */}
      <div className="p-6 flex flex-col items-center">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate("/employee-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/EmployeeHome/attendance-records")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md"
          >
            View Records
          </button>
        </div>

        <div className="bg-[#2a2e47] p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-indigo-300 font-semibold text-lg mb-4">Mark Your Attendance</h2>
          <button
            onClick={openModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Mark as Present
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#2a2e47] p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-indigo-300 text-lg mb-4 font-medium">
              Confirm Attendance
            </h3>
            <p className="text-gray-300 mb-4">Are you sure you want to mark your attendance?</p>
            <div className="flex justify-between">
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Checking..." : "Confirm"}
              </button>
              <button
                onClick={closeModal}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;