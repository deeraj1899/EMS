import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import message from '../../assets/Images/message.png';
import UseGetAllSubmittedWorks from '../../hooks/UseGetAllSubmittedWorks';
import { toast } from 'react-hot-toast';

const ReviewWork = () => {
  const navigate = useNavigate();
  const { submittedWork, loading, error } = UseGetAllSubmittedWorks();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleImageClick = (work) => {
    navigate(`/adminHome/review-work/review`, {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Review Submitted Work</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading submitted works...</p>
      ) : submittedWork.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submittedWork.map((work) => (
            <div key={work._id} className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{work.title}</h3>
              <p className="text-gray-600 mb-3">{work.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  Submitted by:{' '}
                  <span className="font-medium">{work.submitted_by?.empname || 'N/A'}</span>
                </p>
                <a
                  href={work.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub Link
                </a>
                <img
                  src={message}
                  alt="Message Icon"
                  onClick={() => handleImageClick(work)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No submitted works found for this admin.</p>
      )}
    </div>
  );
};

export default ReviewWork;
