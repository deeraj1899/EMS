import React, { useState, useEffect } from 'react';
import UseGetAllEmployeeSubmittedWorks from '../../hooks/UseGetAllEmployeeSubmittedWorks';
import message from '../../assets/Images/message.png';
import { useNavigate } from 'react-router-dom';

const SubmittedWorkreview = () => {
  const { submittedWorks, loading, error } = UseGetAllEmployeeSubmittedWorks();
  const [selectedWork, setSelectedWorkState] = useState(null); 
  const navigate = useNavigate();

  const handleImageClick = (work) => {
    navigate(`/employeeHome/review-work/review`, {
      state: {
        submittedWorkId: work._id,
        submittedBy: work.submitted_by?.empname || 'N/A',
        githubLink: work.githubLink,
        title: work.title,
        description: work.description,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <button 
          onClick={() => navigate("/EmployeeHome")} 
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          ← Back
        </button>
        
        {loading && <p className="text-center text-gray-500">Loading submitted works...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {submittedWorks.length > 0 ? (
          <div className="space-y-4">
            {submittedWorks.map((work, index) => (
              <div key={work._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-xl font-semibold text-gray-800">{work.title}</h3>
                  <p className="text-gray-600">{work.description}</p>
                  <div className="flex items-center justify-between">
                    <a 
                      href={work.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                    <img 
                      src={message} 
                      alt="Review" 
                      className="w-8 h-8 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleImageClick(work)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No submitted works found.</p>
        )}
      </div>
    </div>
  );
};

export default SubmittedWorkreview;
