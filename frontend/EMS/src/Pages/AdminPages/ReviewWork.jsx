import React from 'react';
import Sidebar from './Sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import UseGetAllSubmittedWorks from '../../hooks/UseGetAllSubmittedWorks';
import { setSelectedWork } from '../../redux/SubmitWorkSlice';
import '../../assets/styles/ReviewWork.css';
import message from '../../assets/Images/message.png';

const ReviewWork = () => {
    const { id: adminID } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { submittedWork, loading, error } = UseGetAllSubmittedWorks();
    const handleImageClick = (work) => 
    {
        dispatch(setSelectedWork({
            submittedWorkId: work._id,
            submittedBy: work.submitted_by ? work.submitted_by.empname : 'N/A',
            githubLink: work.githubLink,
            title: work.title,
            description: work.description,
        }));
        navigate(`/adminHome/review-work/${adminID}/review`);
    };
    return (
        <div className='Review-Work-container'>
            <Sidebar />
            <div className="Review-work-layout">
                {loading && <p>Loading submitted works...</p>}
                {error && <p>{error}</p>}
                {submittedWork.length > 0 ? (
                    submittedWork.map(work => (
                        <div className="submittedWorkBox" key={work._id}>
                            <h3>{work.title}</h3>
                            <p>{work.description}</p>
                            <div className="bottomRow">
                                <p>Submitted By: {work.submitted_by ? work.submitted_by.empname : 'N/A'}</p>
                                <a href={work.githubLink} target="_blank" rel="noopener noreferrer">GitHub Link</a>
                                <img 
                                    src={message} 
                                    onClick={() => handleImageClick(work)} 
                                    alt="Message Icon" 
                                    style={{ width: 20, height: 20, cursor: 'pointer' }} 
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No submitted works found for this admin.</p>
                )}
            </div>
        </div>
    );
};
export default ReviewWork;
