import React from 'react';
import "../assets/styles/Home5.css";

const Home5 = () => {
  return (
    <div className='Home5-main'>
      <h2>WHY US?</h2>
      <div className="boxx">
        <div className="row">
          <div className="left">
            <h2>Save time with automation</h2>
            <p>Easily create reusable review templates and set automated review cycles. 
            Harness employee data to trigger probation period or annual reviews, while invitations, notifications, and reminders ensure everyone completes their assessments.</p>
          </div>
          <div className="right">
            {/* <img src='/h51.jpg' alt='Pic -1'/> */}
          </div>
        </div>
        <div className="row">
          <div className="leftalt">
          {/* <img src='/h51.jpg' alt='Pic -1'/> */}
          </div>
          <div className="rightalt">
          <h2>Empower professional growth</h2>
            <p>Evaluate employee performance across key skills and competencies, tracking development over time. 
            Identify skill gaps, optimize team composition, allocate training budgets wisely, and make informed hiring decisions.</p>
          </div>
        </div>
        <div className="row">
          <div className="left">
            <h2>Tailor employee reviews to your needs</h2>
            <p>Utilize review data to track performance trends, compare teams or individuals, and identify high-potential employees. 
                Facilitate succession planning, target training investments effectively, and ensure fair, unbiased reviews</p>
          </div>
          <div className="right">
            {/* <img src='/h51.jpg' alt='Pic -1'/> */}
          </div>
        </div>
        <div className="row">
          <div className="leftalt">
          {/* <img src='/h51.jpg' alt='Pic -1'/> */}
          </div>
          <div className="rightalt">
          <h2>Reduce 90% admin work per employee evaluation cycle</h2>
            <p>Take complete control of performance review cycle with phase-wise management, previews and ability to make adjustments mid-cycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home5;
