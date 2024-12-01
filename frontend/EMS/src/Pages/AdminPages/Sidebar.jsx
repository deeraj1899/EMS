import React from 'react';
import profile from '../../assets/Images/Profile.jpeg';
import { NavLink, useParams } from 'react-router-dom';
import '../../assets/styles/sidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/LoadSlice';
import { resetEmployee } from '../../redux/employeeSlice';
import { resetadminname } from '../../redux/authSlice';
import { resetadmin } from '../../redux/adminSlice';

const Sidebar = () => {
  const adminname = useSelector(store => store.auth.adminname);
  const { id: adminId } = useParams();
  const dispatch = useDispatch();
  const employee = useSelector((state) => state.employee.employeeData);
  const handleLogOut = async () => {
    dispatch(setLoading(true));
    dispatch(resetEmployee());
    dispatch(resetadminname());
    dispatch(resetadmin());
    setTimeout(() => {
      dispatch(setLoading(false));
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-top">
        <div className="profilepic">
        {employee.profilePhoto ? (
            <img src={employee.profilePhoto} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">No Image</div>
          )}
        </div>
        <h2 className="profile-name">{adminname}</h2>
      </div>
      <div className="sidebar-bottom">
        <nav className="sidebar-nav">
          <NavLink
            to={`/adminHome/add-employee/${adminId}`}
            className={({ isActive }) => (isActive ? 'active-link sidebar-link' : 'sidebar-link')}
          >
            Add Employee
          </NavLink>
          <NavLink
            to={`/adminHome/delete-employee/${adminId}`}
            className={({ isActive }) => (isActive ? 'active-link sidebar-link' : 'sidebar-link')}
          >
            Delete Employee
          </NavLink>
          <NavLink
            to={`/adminHome/promote-employee/${adminId}`}
            className={({ isActive }) => (isActive ? 'active-link sidebar-link' : 'sidebar-link')}
          >
            Promote Employee
          </NavLink>
          <NavLink
            to={`/adminHome/add-work/${adminId}`}
            className={({ isActive }) => (isActive ? 'active-link sidebar-link' : 'sidebar-link')}
          >
            Add Work
          </NavLink>
          <NavLink
            to={`/adminHome/review-work/${adminId}`}
            className={({ isActive }) => (isActive ? 'active-link sidebar-link' : 'sidebar-link')}
          >
            Review Work
          </NavLink>
          <NavLink
            to="#"
            onClick={handleLogOut}
            className="sidebar-link"
          >
            Logout
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
