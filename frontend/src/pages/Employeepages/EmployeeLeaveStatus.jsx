import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { LEAVE_API_ENDPOINT } from "../../utils/constant";

import { useNavigate } from "react-router-dom";

const EmployeeLeaveStatus = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const { employee } = useSelector((state) => state.auth);
    const employeeId = employee?._id;
    const navigate = useNavigate();

    useEffect(() => {
        if (employeeId) {
            fetchLeaveRequests();
        } else {
            setError("Employee ID not found. Please log in again.");
            setLoading(false);
            navigate("/login");
        }
    }, [employeeId, navigate]);

    const fetchLeaveRequests = async () => {
        try {
            const { data } = await axios.get(`${LEAVE_API_ENDPOINT}/leave/status`, { withCredentials: true });
            console.log("📌 Leave Requests API Response:", data);
            setLeaveRequests(data.requests || []);
        } catch (err) {
            console.error("Error fetching leave requests:", err);
            setError(err.response?.data?.message || "Error fetching leave requests.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusColor = (status) => {
        return status === "Pending" ? "#f39c12" : status === "Approved" ? "#28a745" : "#e74c3c";
    };

    return (
        <>
           
            <div className="min-h-screen flex flex-col items-center pt-20 pb-8 px-4 bg-gradient-to-b from-[#12172b] to-[#1e1e2f] font-['Inter',sans-serif]">
                <div className="w-full max-w-4xl text-center">
                    <h2 className="text-2xl font-bold text-white mb-8">My Leave Requests</h2>
                    {loading ? (
                        <p className="text-indigo-300 text-base">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-base p-2 bg-red-500/10 rounded-lg">{error}</p>
                    ) : leaveRequests.length === 0 ? (
                        <p className="text-gray-300 text-base">No leave requests found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            {leaveRequests.map((request) => (
                                <div
                                    key={request._id}
                                    className={`bg-[#2a2e47] rounded-xl p-6 shadow-lg shadow-black/30 cursor-pointer transition-all duration-300 overflow-hidden ${
                                        expandedId === request._id ? "h-auto shadow-[#6c7ac2]/40" : "h-24 hover:-translate-y-1 hover:shadow-[#6c7ac2]/30"
                                    }`}
                                    onClick={() => toggleExpand(request._id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: getStatusColor(request.status) }}
                                        ></span>
                                        <h3 className="text-base font-semibold text-gray-200 flex-grow text-left">
                                            {formatDate(request.startDate)} - {formatDate(request.endDate)}
                                        </h3>
                                        <span
                                            className="text-sm font-bold uppercase flex-shrink-0"
                                            style={{ color: getStatusColor(request.status) }}
                                        >
                                            {request.status}
                                        </span>
                                    </div>
                                    <div
                                        className={`mt-4 transition-all duration-300 overflow-hidden ${
                                            expandedId === request._id ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <p className="text-sm text-gray-200 text-left line-clamp-3">
                                            Reason: {request.reason}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmployeeLeaveStatus;