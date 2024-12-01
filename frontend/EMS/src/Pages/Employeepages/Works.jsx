import React, { useState } from 'react';
import axios from 'axios';
import EmployeeHeader from './EmployeeHeader';
import UseGetAllWorks from '../../hooks/UseGetAllWorks';
import '../../assets/styles/Works.css';
import { useSelector } from 'react-redux';
import { EMPLOYEE_API_ENDPOINT } from '../../utils/constant';

const Works = () => {
  const { works, loading, error, refetch } = UseGetAllWorks();
  const employeeId = useSelector(store => store.employee.employeeId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [githubLink, setGithubLink] = useState('');

  const openModal = (work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGithubLink('');
  };

  const handleSubmit = async () => {
    if (!githubLink) return alert("Please provide a GitHub link.");

    try {
      const submittedWork = {
        submitted_by:employeeId,
        assigned_by: selectedWork.assigned_by,
        title: selectedWork.title,
        description: selectedWork.description,
        due_date: selectedWork.due_date,
        githubLink,
      };

      const response = await axios.post(`${EMPLOYEE_API_ENDPOINT}/submitwork/${employeeId}`, submittedWork);

      if (response.data.success) {
        await axios.delete(`${EMPLOYEE_API_ENDPOINT}/removework/${employeeId}/${selectedWork._id}`);
        await refetch();
        alert("Work submitted successfully!");
        closeModal();
      } else {
        alert("Failed to submit work.");
      }
    } catch (error) {
      console.error('Error submitting work:', error);
    }
  };

  return (
    <div className='Works-page-Container'>
      <EmployeeHeader />
      <div className="works-layout">
        {loading && <p>Loading works...</p>} 
        {error && <p>Error fetching works: {error.message}</p>}
        {works.length > 0 ? (
          works.map((work) => (
            <div key={work._id} className="work-item">
              <h3>{work.title}</h3>
              <div className="work-description">
                <p>{work.description}</p>
              </div>
              <div className="work-footer">
                <p className="assigned-by">Assigned By: {work.assigned_by?.empname || 'Unknown'}</p>
                <p className="due-date">Due: {new Date(work.due_date).toLocaleDateString()}</p>
                <button onClick={() => openModal(work)} className="submit-button">Submit</button>
              </div>
            </div>
          ))
        ) : (
          <p>No work assignments found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Submit GitHub Repository Link</h3>
            <input
              type="text"
              placeholder="Enter GitHub link"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="github-input"
            />
            <div className="modal-actions">
              <button onClick={handleSubmit} className="modal-submit">Submit</button>
              <button onClick={closeModal} className="modal-close">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;
