import React from 'react';
import EmployeeHeader from './EmployeeHeader';
import UseGetAllEmployeeSubmittedWorks from '../../hooks/UseGetAllEmployeeSubmittedWorks';
import message from '../../assets/Images/message.png'; // Import message icon if needed
import { useDispatch } from 'react-redux';
import { setSelectedWork } from '../../redux/SubmitWorkSlice';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/SubmittedWorkreview.css'

const SubmittedWorkreview = () => {
  const { submittedWorks, loading, error } = UseGetAllEmployeeSubmittedWorks();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageClick = (work) => {
    dispatch(setSelectedWork({
      submittedWorkId: work._id,
      submittedBy: work.submitted_by ? work.submitted_by.empname : 'N/A',
      githubLink: work.githubLink,
      title: work.title,
      description: work.description,
    }));
    navigate(`/employeeHome/review-work/${work._id}`); 
  };

  return (
    <div className='SubmittedWorkreview-container'>
      <EmployeeHeader />
      <div className="SubmittedWorkreview-layout">
        {loading && <p>Loading submitted works...</p>}
        {error && <p>{error}</p>}
        {submittedWorks.length > 0 ? (
          submittedWorks.map(work => (
            <div className="submittedWorkCard" key={work._id}>
              <h3>{work.title}</h3>
              <p>{work.description}</p>
              <div className="submittedWorkDetails">
                <p>Submitted By: {work.submitted_by ? work.submitted_by.empname : 'N/A'}</p>
                <a href={work.githubLink} target="_blank" rel="noopener noreferrer">GitHub Link</a>
                <img 
                  src={message} 
                  onClick={() => handleImageClick(work)} 
                  alt="Message Icon" 
                  className="message-icon"
                />
              </div>
            </div>
          ))
        ) : (
          <p>No submitted works found.</p>
        )}
      </div>
    </div>
  );
};

export default SubmittedWorkreview;
