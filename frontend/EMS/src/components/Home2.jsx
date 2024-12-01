import React from 'react';
import '../assets/styles/Home2.css';
import Homee2 from '../assets/Images/Home2.jpg'

const Home2 = () => {
  return (
    <div className="Home2-main">
      <div className="Home2-Left">
        <div className="head1">
          <h1>Create Your Organization and Track Your Employees Effortlessly</h1>
        </div>
        <div className="head2">
          <img src={Homee2} alt="Header" />
        </div>
        <div className="head3">
          <h3>Performance Management Software that slashes 90% admin workload</h3>
        </div>
      </div>
      
    </div>
  );
};

export default Home2;
