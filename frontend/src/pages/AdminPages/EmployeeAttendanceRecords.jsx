import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ATTENDANCE_API_ENDPOINT } from "../../utils/constant";
import AdminHeader from "./AdminHeader";

const EmployeeAttendanceRecords = () => {
  const { state } = useLocation();
  const employeeId = state?.employeeId;
  console.log("Employee ID from location state:", employeeId);
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    console.log("Formatting date:", dateString);
    if (!dateString || dateString === "N/A" || dateString === "Invalid Date") return "N/A";
    let date;
    try {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const [day, month, year] = dateString.split("-");
        if (day && month && year) {
          date = new Date(`${year}-${month}-${day}`);
        } else {
          date = new Date(Number(dateString));
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

  useEffect(() => {
    if (!employeeId) {
      setError("Employee ID is missing.");
      setLoading(false);
      return;
    }

    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(`${ATTENDANCE_API_ENDPOINT}/view-attendance-records/${employeeId}`, { withCredentials: true });
        console.log("📌 API Response:", response.data);
        setEmployee(response.data.employee);
        setAttendanceRecords(response.data.records);
      } catch (error) {
        console.error("❌ Error fetching attendance records:", error);
        setError(error?.response?.data?.message || "Error fetching attendance records.");
      }
      setLoading(false);
    };

    fetchAttendanceRecords();
  }, [employeeId]);

  return (
    <>
      <AdminHeader />
      <div className="p-5 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>

        {loading ? (
          <p className="text-gray-500">Loading attendance records...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : employee ? (
          <>
            <div className="text-center mb-5">
              <h3 className="text-lg font-medium">{employee.name}</h3>
              <p className="text-sm text-gray-600">Email: {employee.email}</p>
            </div>

            {attendanceRecords.length > 0 ? (
              <table className="w-full border-collapse mt-5 bg-white shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Check-in Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{formatDate(record.date)}</td>
                      <td className="py-2 px-4">{record.status}</td>
                      <td className="py-2 px-4">{record.checkInTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No attendance records available.</p>
            )}

            <button
              onClick={() => navigate(-1)}
              className="mt-5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Go Back
            </button>
          </>
        ) : (
          <p className="text-gray-500">Employee not found.</p>
        )}
      </div>
    </>
  );
};

export default EmployeeAttendanceRecords;