import React from 'react';
import Sidebar from './Sidebar';
import UseGetAllEmployees from '../../hooks/UseGetAllEmployees';
import '../../assets/styles/DeleteEmployee.css'; // Ensure you import your CSS file
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ADMIN_API_ENDPOINT } from '../../utils/constant';
import { useSelector } from 'react-redux';

const DeleteEmployee = () => {
  const { employees, loading, error } = UseGetAllEmployees();
  const { id: adminId } = useParams();
  const organizationId=useSelector(store=>store.admin.organizationId);
  const adminID=useSelector(store=>store.employee.employeeId);
  const navigate=useNavigate();
  const handleDelete = async(employeeId) => {
    console.log(`Delete employee with ID: ${employeeId}`);
    try {
      const response=await axios.delete(`${ADMIN_API_ENDPOINT}/deleteemployee/${employeeId}/${organizationId}`);
      if(response.data.success)
      {
        navigate(`/adminHome/${adminID}`)
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error fetching employees: {error.message}</p>;

  return (
    <div className='delete-employee-layout'>
      <Sidebar />
      <div className='employee-list-container'>
        {employees.map((employee) => (
          <div key={employee._id} className='employee-box'>
            <div className='profile' style={{ width: '30%' }}>
              {employee.profilePhoto ? (
              <img src={employee.profilePhoto} alt="Profile" className="profile-image" />
            ) : (
              <div className="profile-image-placeholder">No Image</div>
            )}
              <h3>{employee.empname}</h3>
            </div>
            <div className='details' style={{ width: '70%' }}>
              <p className='detail-heading'>Email:</p>
              <p>{employee.mail}</p>
              <p className='detail-heading'>Age:</p>
              <p>{employee.age}</p>
              <p className='detail-heading'>Status:</p>
              <p>{employee.Employeestatus}</p>
              <p className='detail-heading'>Rating:</p>
              <p>{employee.rating}</p>
              <p className='detail-heading'>Projects Pending:</p>
              <p>{employee.projectspending}</p>
              {employee._id !== adminId && ( // Conditional rendering
                <button onClick={() => handleDelete(employee._id)} className='delete-button'>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteEmployee;
