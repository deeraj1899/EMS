import React, { useEffect } from 'react';
import message from '../../assets/Images/message.png';
import { useNavigate } from 'react-router-dom';
import UseGetAllEmployeeSubmittedWorks from '../../hooks/UseGetAllEmployeeSubmittedWorks';
import { toast } from 'react-hot-toast';

const EmployeeReviewWork = () => {
  const { submittedWorks, loading, error } = UseGetAllEmployeeSubmittedWorks();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to load submitted works.");
    }
  }, [error]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Submitted Works</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading submitted works...</p>
        ) : submittedWorks.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {submittedWorks.map((work) => (
              <div key={work._id} className="border border-gray-200 bg-gray-50 rounded-xl p-5 shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{work.title}</h3>
                <p className="text-gray-600 mb-4">{work.description}</p>
                <div className="flex justify-between items-center">
                  <a
                    href={work.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View GitHub
                  </a>
                  <img
                    src={message}
                    alt="Review"
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleImageClick(work)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No submitted works found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeReviewWork;
