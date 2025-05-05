import React from 'react';
import axios from 'axios';
import { ADMIN_API_ENDPOINT, EMPLOYEE_API_ENDPOINT } from '../../utils/constant';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import UseGetAllEmployees from '../../hooks/UseGetAllEmployees';
import { useNavigate } from 'react-router-dom';

const PromoteEmployee = () => {
  const { employee } = useSelector((state) => state.auth);
  const organizationId = employee?.organization;
    const navigate=useNavigate()
  const { employees: allEmployees, refetch } = UseGetAllEmployees();

  const promote = async (empId) => {
    try {
        
      await axios.put(`${ADMIN_API_ENDPOINT}/promote/${empId}`, {}, { withCredentials: true });
      toast.success('Employee promoted to Manager');
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to promote employee');
    }
  };

  const filteredEmployees = allEmployees?.filter(emp => emp._id !== employee?._id) || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Promote Employee</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp._id} className="border-b">
                <td className="py-2 px-4">{emp.empname}</td>
                <td className="py-2 px-4">{emp.email}</td>
                <td className="py-2 px-4">{emp.Employeestatus}</td>
                <td className="py-2 px-4">
                  {emp.Employeestatus !== 'Manager' ? (
                    <button
                      onClick={() => promote(emp._id)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    >
                      Promote
                    </button>
                  ) : (
                    <span className="text-gray-500">Already Manager</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No employees available for promotion.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoteEmployee;
