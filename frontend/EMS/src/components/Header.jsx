import React from 'react';
import '../assets/styles/header.css';
import { NavLink } from 'react-router-dom';
import companyLogo from '../assets/Images/CompanyLogo.png'

const Header = () => {
  return (
    <div>
      <nav className='header-navbar'>
        <div className='logo-container'>
          <img src={companyLogo} alt='Company Logo' />
        </div>
        <div className='title-container'>
          <h2>Employee Review System</h2>
        </div>
        <div className='button-container'>
          <NavLink to="/LoginasEmp">
            <button className='btn login-btn'>Login as Employee</button>
          </NavLink>
          <NavLink to="/create-organization">
            <button className='btn create-btn'>Create Organization</button>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Header;
