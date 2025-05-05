import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, ShieldCheck, LogIn, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { EMPLOYEE_API_ENDPOINT } from "../../utils/constant";
import { Home, Briefcase, MessageSquare, Calendar, Settings, CheckCircle, Crown } from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { label: "Home", icon: <Home />, path: "/employee-dashboard" },
  { label: "Projects", icon: <Briefcase />, path: "/EmployeeHome/Works" },
  { label: "Reviews", icon: <MessageSquare />, path: "/EmployeeHome/reviews" },
  { label: "Leave Request", icon: <Calendar />, path: "/EmployeeHome/leave-request" },
  { label: "Settings", icon: <Settings />, path: "/EmployeeHome/settings" },
  { label: "Mark Attendance", icon: <CheckCircle />, path: "/EmployeeHome/mark-attendance" },
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const organization = useSelector((state) => state.auth.organization);
  const employee = useSelector((state) => state.auth.employee);

  const [email, setEmail] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
        const response = await axios.post(
            `${EMPLOYEE_API_ENDPOINT}/adminlogin`,
            { email, adminCode },
            { withCredentials: true }
          );
          
  
      if (response.data.success) {
        toast.success("Admin login successful");
        navigate("/adminDashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.response?.data?.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#12172b] text-white">
      <div className="flex items-center justify-between bg-white text-gray-800 px-6 py-4 shadow">
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
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <button
            onClick={() => navigate("/EmployeeHome")}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            <LogOut />
            Exit
          </button>
        </nav>
      </div>

      {/* Form */}
      <div className="flex justify-center items-center py-20 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-[#2a2e47] w-full max-w-md p-8 rounded-xl shadow-xl"
        >
          <h2 className="text-xl font-semibold text-center text-indigo-300 mb-6">Admin Login</h2>

          <div className="mb-4">
            <label className="block mb-2 text-gray-300">Email</label>
            <div className="flex items-center bg-[#323b5c] p-3 rounded-md">
              <Mail className="text-gray-400 mr-2" />
              <input
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-300">Admin Code</label>
            <div className="flex items-center bg-[#323b5c] p-3 rounded-md">
              <ShieldCheck className="text-gray-400 mr-2" />
              <input
                type="password"
                required
                placeholder="Enter admin code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : (
              <span className="flex items-center justify-center gap-2">
                <LogIn size={18} />
                Login
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
