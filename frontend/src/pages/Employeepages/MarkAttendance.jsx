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
  const [isFlipped, setIsFlipped] = useState(false);

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
    setIsFlipped(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
    <div className="min-h-screen bg-gradient-to-b from-[#12172b] to-[#1e1e2f] text-white font-['Inter'] flex flex-col items-center pt-24 px-8 pb-8">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-white text-gray-800 px-6 py-4 shadow z-50">
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
            className="bg-blue-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover‘bg-blue-800 hover:-translate-y-1"
          >
            Back
          </button>
          <button
            onClick={() => navigate("/EmployeeHome/attendance-records")}
            className="bg-cyan-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:bg-cyan-700 hover:-translate-y-1"
          >
            View Records
          </button>
        </div>

        <div className="bg-[#2a2e47] p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h2 className="font-bold text-2xl text-white mb-6">Mark Your Attendance</h2>
          <div className="w-[300 [300px] h-[200px] mx-auto mb-8 perspective-[1000px]">
            <div className={`relative w-full h-full transition-transform duration-[600ms] ease-in-out transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-[#323b5c] flex items-center justify-center">
                <div className="cursor-pointer p-4 text-center" onClick={handleFlip}>
                  <span className="text-lg font-semibold text-gray-200 transition-colors duration-300 hover:text-[#6c7ac2]">
                    Mark as Present
                  </span>
                </div>
              </div>
              <div className="absolute w-full h-full backface-hidden rounded-xl shadow-lg bg-[#3a4366] rotate-y-180 flex items-center justify-center">
                <div className="p-4 flex flex-col items-center gap-4">
                  <p className="text-lg text-gray-200 font-semibold">Confirm Attendance?</p>
                  <button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className={`bg-green-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:bg-green-800 hover:-translate-y-1 ${loading ? 'bg-[#555a78] cursor-not-allowed' : ''}`}
                  >
                    {loading ? "Checking..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p className="text-indigo-300 text-base mb-6 p-2 rounded-lg bg-indigo-300/10 transition-opacity duration-300">
            Click the card to mark your attendance
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#2a2e47] p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h3 className="text-indigo-300 text-lg mb-4 font-semibold">
              Confirm Attendance
            </h3>
            <p className="text-gray-300 mb-4">Are you sure you want to mark your attendance?</p>
            <div className="flex justify-between">
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className={`bg-green-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:bg-green-700 hover:-translate-y-1 ${loading ? 'bg-[#555a78] cursor-not-allowed' : ''}`}
              >
                {loading ? "Checking..." : "Confirm"}
              </button>
              <button
                onClick={closeModal}
                className="bg-red-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:bg-red-700 hover:-translate-y-1"
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