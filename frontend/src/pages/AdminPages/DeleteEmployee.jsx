import React from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';
import UseGetAllEmployees from '../../hooks/UseGetAllEmployees';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DeleteEmployee = () => {
  const { employees, loading, error, refetch } = UseGetAllEmployees();
  const employeeId = useSelector((state) => state.auth.employee._id);
  const organizationId = useSelector((state) => state.auth.employee.organization);
    const navigate=useNavigate();
  const handleDelete = async (id) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this employee?');
      if (!confirm) return;

      await axios.delete(`${ADMIN_API_ENDPOINT}/delete/${id}/${organizationId}`, {
        withCredentials: true,
      });
      

      toast.success('Employee deleted successfully');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  if (loading) return <p className="text-center p-4">Loading employees...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error fetching employees.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Delete Employee</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Department</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees
              ?.filter((emp) => emp._id !== employeeId)
              .map((emp, index) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{emp.empname}</td>
                  <td className="border px-4 py-2">{emp.mail}</td>
                  <td className="border px-4 py-2">{emp.department?.name || 'N/A'}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeleteEmployee;
