import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import AdminHeader from "./AdminHeader";
import { ATTENDANCE_API_ENDPOINT } from "../../utils/constant";

const AdminView = () => {
  const navigate = useNavigate();
  const [employeeStatus, setEmployeeStatus] = useState([]);
  const [summary, setSummary] = useState({ present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeStatus = async () => {
      try {
        const response = await axios.get(`${ATTENDANCE_API_ENDPOINT}/attendance-status-today`, { withCredentials: true });
        console.log("📌 Admin API Response:", response.data);
        setEmployeeStatus(response.data.employeeStatus || []);
        setSummary(response.data.counts || { present: 0, late: 0, absent: 0 });
      } catch (error) {
        console.error("❌ Error fetching admin attendance status:", error);
        toast.error(error?.response?.data?.message || "Error fetching attendance status.");
      }
      setLoading(false);
    };
    fetchEmployeeStatus();
  }, []);

  return (
    <AttendanceTable
      employeeStatus={employeeStatus}
      summary={summary}
      loading={loading}
      navigate={navigate}
      isManager={false}
    />
  );
};

const ManagerView = ({ managerId, organizationId }) => {
  const navigate = useNavigate();
  const [employeeStatus, setEmployeeStatus] = useState([]);
  const [summary, setSummary] = useState({ present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartmentEmployeeStatus = async () => {
      try {
        const response = await axios.get(
          `${ATTENDANCE_API_ENDPOINT}/department-attendance-status-today/${organizationId}/${managerId}`,
          { withCredentials: true }
        );
        console.log("📌 Manager API Response:", response.data);
        setEmployeeStatus(response.data.employeeStatus || []);
        setSummary(response.data.counts || { present: 0, late: 0, absent: 0 });
      } catch (error) {
        console.error("❌ Error fetching department attendance status:", error);
        toast.error(error?.response?.data?.message || "Error fetching department attendance status.");
      }
      setLoading(false);
    };
    if (organizationId && managerId) {
      fetchDepartmentEmployeeStatus();
    }
  }, [organizationId, managerId]);

  return (
    <AttendanceTable
      employeeStatus={employeeStatus}
      summary={summary}
      loading={loading}
      navigate={navigate}
      isManager={true}
    />
  );
};

const AttendanceTable = ({ employeeStatus, summary, loading, navigate, isManager }) => {
  return (
    <div className="p-5 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isManager ? "Department Attendance Status for Today" : "Employee Attendance Status for Today"}
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading employee status...</p>
      ) : (
        <>
          <div className="flex justify-around w-full p-4 bg-green-100 rounded-lg mb-4">
            <p><strong className="text-green-800">Present:</strong> {summary.present}</p>
            <p><strong className="text-yellow-800">Late:</strong> {summary.late}</p>
            <p><strong className="text-red-800">Absent:</strong> {summary.absent}</p>
          </div>
          {employeeStatus.length > 0 ? (
            <table className="w-full border-collapse mt-5 bg-white shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Employee Name</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Check-in Time</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {employeeStatus.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{record.employeeName}</td>
                    <td className="py-2 px-4">{record.status}</td>
                    <td className="py-2 px-4">{record.checkInTime}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => navigate("/adminHome/view-attendance-records", { state: { employeeId: record.employeeId } })}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        View Records
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">
              No attendance records found for today {isManager ? "in your department" : "in the organization"}.
            </p>
          )}
        </>
      )}
    </div>
  );
};

const ViewAttendance = () => {
  const navigate = useNavigate();
  const { employee } = useSelector((state) => state.auth);
  const adminId = employee?._id;
  const adminRole = employee?.Employeestatus;
  const isManager = adminRole === "Manager";
  const organizationId = useSelector((state) => state.auth.organization);

  useEffect(() => {
    console.log("adminId from state.auth:", adminId);
    if (!adminId) {
      console.log("Navigating to login due to missing adminId");
      toast.error("Invalid or missing admin ID. Please log in again.");
      navigate('/login');
      return;
    }
  }, [adminId, navigate]);

  return (
    <>
      <AdminHeader />
      <div className="p-5">
        {isManager ? (
          <ManagerView managerId={adminId} organizationId={organizationId} />
        ) : (
          <AdminView />
        )}
      </div>
    </>
  );
};

export default ViewAttendance;