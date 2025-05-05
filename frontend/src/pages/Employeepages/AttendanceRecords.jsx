import React, { useEffect, useState } from "react";
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

const AttendanceRecords = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const employee = useSelector((state) => state.auth.employee);
  const organization = useSelector((state) => state.auth.organization);
  const employeeId = employee?._id;

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchRecords = async () => {
      if (!employeeId) {
        toast.error("Employee ID is missing.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching records from:", `${ATTENDANCE_API_ENDPOINT}/view-attendance-records/${employeeId}`);
        const response = await axios.get(
          `${ATTENDANCE_API_ENDPOINT}/view-attendance-records/${employeeId}`,
          { withCredentials: true }
        );
        console.log("API Response:", response.data);
        const records = response.data.records || [];
        setAttendanceRecords(records.map(record => ({
          ...record,
          date: record.date || "N/A" // Fallback if date is missing
        })));
        if (records.length > 0) {
          toast.success("Attendance records fetched successfully!");
        } else {
          toast.info("No attendance records found.");
        }
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        console.log("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        toast.error(error?.response?.data?.message || "Error fetching attendance records.");
      }
      setLoading(false);
    };

    fetchRecords();
  }, [employeeId]);

  const handleLogout = () => {
    navigate("/");
  };

  const formatDate = (dateString) => {
    console.log("Formatting date:", dateString); // Debug the input
    if (!dateString || dateString === "N/A" || dateString === "Invalid Date") return "N/A";
    let date;
    try {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Try parsing as DD-MM-YYYY if it's a string in that format
        const [day, month, year] = dateString.split("-");
        if (day && month && year) {
          date = new Date(`${year}-${month}-${day}`);
        } else {
          // Try parsing as ISO or timestamp
          date = new Date(Number(dateString)); // For timestamps
        }
      }
      if (isNaN(date.getTime())) {
        console.warn("Unable to parse date:", dateString);
        return "N/A";
      }
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.warn("Date parsing error:", error, "for input:", dateString);
      return "N/A";
    }
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
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
        <button
          onClick={() => navigate("/employee-dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-6"
        >
          Back
        </button>

        <div className="bg-[#2a2e47] p-6 rounded-xl shadow-md w-full max-w-xl text-center">
          <h2 className="text-indigo-300 font-semibold text-lg mb-4">Attendance Records</h2>

          {loading ? (
            <p className="text-gray-300">Loading records...</p>
          ) : attendanceRecords.length > 0 ? (
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-indigo-400 to-[#2a2e47] rounded"></div>
              {attendanceRecords.map((record, index) => (
                <div
                  key={index}
                  className="relative flex justify-center mb-8 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full shadow-md hover:scale-125 transition-transform"></div>
                  <div className="bg-[#323b5c] p-4 rounded-lg shadow-md w-full max-w-xs ml-8 hover:-translate-y-1 hover:shadow-lg transition-all">
                    <div className="text-indigo-300 font-semibold text-left">
                      {formatDate(record.date)}
                    </div>
                    <div className="text-gray-300 text-sm mt-2 flex justify-between">
                      <p>
                        <span className="font-semibold text-gray-400">Check-in:</span>{" "}
                        {formatTime(record.checkInTime)}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-400">Status:</span>{" "}
                        {record.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No attendance records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;