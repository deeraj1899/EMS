import React, { useState } from "react";
import axios from "axios";
import UseGetAllWorks from "../../hooks/UseGetAllWorks";
import { useSelector } from "react-redux";
import { EMPLOYEE_API_ENDPOINT } from "../../utils/constant";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home, Briefcase, MessageSquare, Calendar, Settings,
  CheckCircle, LogOut, Crown
} from "lucide-react";
import { toast } from "react-hot-toast";

const navItems = [
  { label: "Home", icon: <Home />, path: "/employee-dashboard" },
  { label: "Projects", icon: <Briefcase />, path: "/EmployeeHome/Works" },
  { label: "Reviews", icon: <MessageSquare />, path: "/EmployeeHome/reviews" },
  { label: "Leave Request", icon: <Calendar />, path: "/EmployeeHome/leave-request" },
  { label: "Settings", icon: <Settings />, path: "/EmployeeHome/settings" },
  { label: "Mark Attendance", icon: <CheckCircle />, path: "/EmployeeHome/mark-attendance" },
];

const Works = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { works, loading, error, refetch } = UseGetAllWorks();
  
  const employee = useSelector((state) => state.auth.employee);
  const organization = useSelector((state) => state.auth.organization);
  const employeeId = employee?._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [githubLink, setGithubLink] = useState("");

  const isActive = (path) => location.pathname === path;

  const openModal = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGithubLink("");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!githubLink) {
      toast.error("Please provide a GitHub link.");
      return;
    }

    try {
      const submittedWork = {
        submitted_by: employeeId,
        assigned_by: selectedWork.assigned_by._id,
        title: selectedWork.title,
        description: selectedWork.description,
        due_date: selectedWork.due_date,
        githubLink,
      };
      
      const response = await axios.post(`${EMPLOYEE_API_ENDPOINT}/submitwork`, submittedWork, {
        withCredentials: true,
      });

      if (response.data.success) {
        await axios.delete(`${EMPLOYEE_API_ENDPOINT}/removework/${selectedWork._id}`, {
          withCredentials: true,
        });
        
        await refetch();
        toast.success("Work submitted successfully!");
        closeModal();
      } else {
        toast.error("Failed to submit work.");
      }
    } catch (error) {
      console.error("Error submitting work:", error);
      toast.error("An error occurred while submitting work.");
    }
  };

  return (
    <div className="min-h-screen bg-[#12172b] text-white">
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
      <div className="p-6">
        <button
          onClick={() => navigate("/employee-dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-6"
        >
          Back
        </button>

        {loading && <p>Loading works...</p>}
        {error && <p>Error fetching works: {error}</p>}
        {works.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {works.map((work) => (
              <div key={work._id} className="bg-[#2a2e47] p-5 rounded-xl shadow-md">
                <h3 className="text-indigo-300 font-semibold text-lg">{work.title}</h3>
                <p className="text-gray-300">{work.description}</p>
                <div className="mt-3">
                  <p className="text-indigo-400">Assigned By: {work.assigned_by?.empname || "Unknown"}</p>
                  <p className="text-gray-300">
                    Due: {new Date(work.due_date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => openModal(work)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No work assignments found.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#2a2e47] p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h3 className="text-indigo-300 text-lg mb-4 font-medium">
              Submit GitHub Repository Link
            </h3>
            <input
              type="text"
              placeholder="Enter GitHub link"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full p-3 rounded-md bg-[#323b5c] text-white placeholder-gray-400 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Submit
              </button>
              <button
                onClick={closeModal}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;
