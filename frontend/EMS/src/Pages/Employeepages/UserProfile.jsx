import React from 'react';
import { useSelector } from 'react-redux';
import '../../assets/styles/UserProfile.css'; 

const UserProfile = () => {
  const employee = useSelector((state) => state.employee.employeeData); 
  const adminName = useSelector((state) => state.auth.adminname);

  return (
    <div className="user-profile">
      <div className="user-profile-container">
        <div className="profile-image-container">
          {employee.profilePhoto ? (
            <img src={employee.profilePhoto} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">No Image</div>
          )}
        </div>
      <h2>{employee.empname}'s Profile</h2>
      <div className="info-table">
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{employee.empname}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{employee.mail}</td>
            </tr>
            <tr>
              <td>Age:</td>
              <td>{employee.age}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>{employee.Employeestatus}</td>
            </tr>
            <tr>
              <td>Rating:</td>
              <td>{employee.rating}</td>
            </tr>
            <tr>
              <td>Projects Pending:</td>
              <td>{employee.projectspending}</td>
            </tr>
            <tr>
              <td>Admin:</td>
              <td>{adminName}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default UserProfile;
