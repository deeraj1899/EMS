import React from 'react';
import Sidebar from './sidebar';
import Mainbar from './mainbar';

const AdminHome = () => {
  return (
    <div className="admin-home-container">
      <Sidebar />
      <Mainbar />
      <style jsx>{`
        .admin-home-container {
          display: flex;
          height: 100vh; 
        }
      `}</style>
    </div>
  );
}

export default AdminHome;
