import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import UseGetAllEmployees from '../../hooks/UseGetAllEmployees';
import UseGetDepartmentEmployees from '../../hooks/UseGetDepartmentEmployees';

const EmployeeTable = ({ employees, adminId, navigate, isManager, openModal }) => (
  <div className="p-6 w-full max-w-6xl mx-auto">
    <button
      onClick={() => navigate(-1)}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ← Back to Dashboard
    </button>
    <h1 className="text-3xl font-bold mb-6">
      {isManager ? 'Department Employees' : 'All Employees'}
    </h1>

    {employees.length === 0 ? (
      <p className="text-gray-500">
        No employees found {isManager ? 'in your department' : 'in the organization'}.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2">Sno</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Project's Pending</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Add Work</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {employees.map((employee, index) => (
              <tr key={employee._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{employee.empname}</td>
                <td className="px-4 py-2">{employee.mail}</td>
                <td className="px-4 py-2">{employee.projectspending}</td>
                <td className="px-4 py-2">{employee.Employeestatus}</td>
                <td className="px-4 py-2">
                  {employee.Employeestatus !== 'Admin' && employee._id !== adminId && (
                    <button
                      onClick={() => openModal(employee._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Add Work
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const AddWork = () => {
  const navigate = useNavigate();
  const employee = useSelector((state) => state.auth?.employee);
  const adminId = employee?._id;
  const adminRole = employee?.Employeestatus;
  const isManager = adminRole === 'Manager';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [work, setWork] = useState({ title: '', description: '', due_date: '' });
    const [Loading,setLoading]=useState(false);
  const { employees: allEmployees } = UseGetAllEmployees();
  const { employees: deptEmployees } = UseGetDepartmentEmployees({ managerId: adminId });

  useEffect(() => {
    if (!adminId) {
      toast.error('Unauthorized access. Please log in again.');
      navigate('/login');
    }
  }, [adminId, navigate]);

  const openModal = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployeeId(null);
    setWork({ title: '', description: '', due_date: '' });
  };

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setWork((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
        toast.error('No employee selected.');
        return;
    }

    try {
        setLoading(true);
        await axios.post(`${ADMIN_API_ENDPOINT}/addwork/${adminId}/${selectedEmployeeId}`, work);
        toast.success('Work added successfully');
        closeModal();
        setTimeout(() => {
            navigate(-1);
        }, 2000); 
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error adding work');
    }
};


  const tableProps = { adminId, navigate, openModal, isManager };

  return (
    <div className="min-h-screen bg-gray-50">
      {isManager ? (
        <EmployeeTable {...tableProps} employees={deptEmployees} />
      ) : (
        <EmployeeTable {...tableProps} employees={allEmployees} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Assign Work</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={work.title}
                  onChange={handleFormData}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <input
                  type="text"
                  name="description"
                  value={work.description}
                  onChange={handleFormData}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={work.due_date}
                  onChange={handleFormData}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {
                    Loading?"Adding":"Add work"
                }
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWork;
