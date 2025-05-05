import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LEAVE_API_ENDPOINT } from "../../utils/constant";
import { useSelector } from "react-redux";

const LeaveRequest = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [leaveData, setLeaveData] = useState({ startDate: "", endDate: "", leaveType: "", reason: "" });
    const [leaveBalance, setLeaveBalance] = useState(null);
    const [error, setError] = useState("");
    const { employee } = useSelector((state) => state.auth);
    const employeeId = employee?._id;

    useEffect(() => {
        if (employeeId) {
            fetchLeaveData();
        } else {
            setError("Employee ID not found. Please log in again.");
            navigate("/login");
        }
    }, [employeeId, navigate]);

    const fetchLeaveData = async () => {
        try {
            const response = await axios.get(`${LEAVE_API_ENDPOINT}/leave/status`, { withCredentials: true });
            console.log("📌 Leave Balance API Response:", response.data);
            setLeaveBalance(response.data.balance);
        } catch (error) {
            console.error("Failed to fetch leave balance:", error);
            setError(error.response?.data?.message || "Failed to fetch leave balance.");
        }
    };

    const handleChange = (e) => {
        setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (step === 1 && leaveData.startDate && leaveData.leaveType) setStep(2);
        else if (step === 2 && leaveData.endDate) setStep(3);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post(`${LEAVE_API_ENDPOINT}/apply`, leaveData, { withCredentials: true });
            console.log("📌 Leave Submit API Response:", response.data);
            alert("Leave request submitted successfully.");
            setLeaveBalance(response.data.leaveBalances);
            navigate(-1);
        } catch (error) {
            console.error("Error submitting leave request:", error);
            setError(error.response?.data?.message || "Please try again.");
        }
    };

    return (
        <>
           
            <div className="min-h-screen flex flex-col items-center pt-20 pb-8 px-4 bg-gradient-to-b from-[#12172b] to-[#1e1e2f] font-['Inter',sans-serif]">
                <div className="bg-[#2a2e47] p-6 rounded-2xl w-full max-w-md shadow-lg shadow-black/30 text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">Request a Leave</h2>

                    <button
                        onClick={() => navigate("/EmployeeHome/leavestatus")}
                        className="bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold text-base mb-8 hover:bg-teal-600 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20"
                    >
                        📋 View My Leave Requests
                    </button>

                    <div className="leave-balance mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Leave Balance</h3>
                        {leaveBalance ? (
                            Object.entries(leaveBalance).map(([type, { total, used }]) => (
                                <p key={type} className="text-gray-300">
                                    {type}: {used}/{total} used ({total - used} remaining)
                                </p>
                            ))
                        ) : error ? (
                            <p className="text-red-400">{error}</p>
                        ) : (
                            <p className="text-gray-400">Loading balance...</p>
                        )}
                    </div>

                    <div className="bg-[#323b5c] p-6 rounded-xl shadow-md shadow-black/20">
                        <div className="flex justify-between max-w-[200px] mx-auto mb-6">
                            {[1, 2, 3].map((num) => (
                                <span
                                    key={num}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-gray-300 transition-all duration-300 ${
                                        step >= num ? "bg-indigo-400 scale-110" : "bg-[#555a78]"
                                    }`}
                                >
                                    {num}
                                </span>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="relative min-h-[200px]">
                            <div className={`absolute top-0 left-0 w-full transition-all duration-300 ${step === 1 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}>
                                <label className="text-indigo-300 font-semibold text-base mb-2 block text-left">Leave Type</label>
                                <select
                                    name="leaveType"
                                    value={leaveData.leaveType}
                                    onChange={handleChange}
                                    required
                                    className="bg-[#444a68] text-gray-200 p-3 rounded-lg w-full text-base focus:outline-none focus:border-2 focus:border-indigo-400"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Official">Official</option>
                                    <option value="Vacation">Vacation</option>
                                </select>
                                <label className="text-indigo-300 font-semibold text-base mt-4 mb-2 block text-left">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={leaveData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="bg-[#444a68] text-gray-200 p-3 rounded-lg w-full text-base focus:outline-none focus:border-2 focus:border-indigo-400"
                                />
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!leaveData.startDate || !leaveData.leaveType}
                                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20 disabled:bg-[#555a78] disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Next
                                </button>
                            </div>

                            <div className={`absolute top-0 left-0 w-full transition-all duration-300 ${step === 2 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}>
                                <label className="text-indigo-300 font-semibold text-base mb-2 block text-left">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={leaveData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="bg-[#444a68] text-gray-200 p-3 rounded-lg w-full text-base focus:outline-none focus:border-2 focus:border-indigo-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="mt-4 mr-4 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold text-base hover:bg-gray-600 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!leaveData.endDate}
                                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20 disabled:bg-[#555a78] disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Next
                                </button>
                            </div>

                            {error && <p className="text-red-400 text-sm mt-2 text-left">{error}</p>}

                            <div className={`absolute top-0 left-0 w-full transition-all duration-300 ${step === 3 ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}>
                                <label className="text-indigo-300 font-semibold text-base mb-2 block text-left">Reason</label>
                                <textarea
                                    name="reason"
                                    value={leaveData.reason}
                                    onChange={handleChange}
                                    required
                                    className="bg-[#444a68] text-gray-200 p-3 rounded-lg w-full h-24 resize-none text-base focus:outline-none focus:border-2 focus:border-indigo-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="mt-4 mr-4 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold text-base hover:bg-gray-600 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={!leaveData.reason}
                                    className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold text-base hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20 disabled:bg-[#555a78] disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="mt-8 px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold text-base hover:bg-gray-600 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-black/20"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </>
    );
};

export default LeaveRequest;