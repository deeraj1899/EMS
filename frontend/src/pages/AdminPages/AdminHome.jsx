// AdminHome.jsx
import React from 'react';
import AdminHeader from './AdminHeader';
import Mainbar from './Mainbar';

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <Mainbar />
    </div>
  );
};

export default AdminHome;