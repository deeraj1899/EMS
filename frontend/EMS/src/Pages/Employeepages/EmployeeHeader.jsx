import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/EmployeeHeader.css';
import useGetEmployeeData from '../../hooks/UseGetEmployeeData';
import { useSelector, useDispatch } from 'react-redux';
import { resetEmployee } from '../../redux/employeeSlice';
import { resetadminname } from '../../redux/authSlice';
import { setLoading } from '../../redux/LoadSlice';
import Loading from '../../components/Loading'; 
import { resetadmin } from '../../redux/adminSlice';

const EmployeeHeader = () => {
  useGetEmployeeData();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const employeedata = useSelector((state) => state.employee.employeeData);
  const profilePhoto = employeedata?.profilePhoto;
  const employeestatus = employeedata?.Employeestatus;
  const isLoading = useSelector((state) => state.load.isLoading);
  const Logo=useSelector(store=>store.admin.organizationLogo);
  const handleLogOut = async () => {
    dispatch(setLoading(true));
    dispatch(resetEmployee());
    dispatch(resetadmin());
    dispatch(resetadminname());
    setTimeout(() => {
      dispatch(setLoading(false));
      window.location.href = '/';
    }, 1000); 
  };

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    dispatch(setLoading(true));
    navigate(path);
    setTimeout(() => dispatch(setLoading(false)), 1000); 
  };

  return (
    <div className="header">
      {isLoading && <Loading />}
      <div className="header__logo">
        {Logo ? <img src={Logo} alt="Organization Logo" /> : <strong>Logo</strong>}
      </div>
      <nav className="navbar">
        <ul className="navbar__menu">
          <li className={`navbar__item ${isActive('/EmployeeHome') ? 'active' : ''}`}>
            <a onClick={() => handleNavigation('/EmployeeHome')} className="navbar__link">
              <i data-feather="folder"></i>
              <span>Home</span>
            </a>
          </li>
          <li className={`navbar__item ${isActive('/EmployeeHome/Works') ? 'active' : ''}`}>
            <a onClick={() => handleNavigation('/EmployeeHome/Works')} className="navbar__link">
              <i data-feather="folder"></i>
              <span>Projects</span>
            </a>
          </li>
          <li className={`navbar__item ${isActive('/EmployeeHome/reviews') ? 'active' : ''}`}>
            <a onClick={() => handleNavigation('/EmployeeHome/reviews')} className="navbar__link">
              <i data-feather="message-square"></i>
              <span>Reviews</span>
            </a>
          </li>
          <li className={`navbar__item ${isActive('/announcements') ? 'active' : ''}`}>
            <a onClick={() => handleNavigation('/announcements')} className="navbar__link">
              <i data-feather="users"></i>
              <span>Announcements</span>
            </a>
          </li>
          <li className={`navbar__item ${isActive('/EmployeeHome/settings') ? 'active' : ''}`}>
            <a onClick={() => handleNavigation('/EmployeeHome/settings')} className="navbar__link">
              <i data-feather="settings"></i>
              <span>Settings</span>
            </a>
          </li>
          {employeestatus !== 'Employee' && (
            <li className={`navbar__item ${isActive('/EmployeeHome/adminLogin') ? 'active' : ''}`}>
              <a onClick={() => handleNavigation('/EmployeeHome/adminLogin')} className="navbar__link">
                <i data-feather="help-circle"></i>
                <span>Admin Login</span>
              </a>
            </li>
          )}
          <li className="navbar__item">
            <a onClick={handleLogOut} className="navbar__link logout">
              <i data-feather="log-out"></i>
              <span>LogOut</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default EmployeeHeader;
