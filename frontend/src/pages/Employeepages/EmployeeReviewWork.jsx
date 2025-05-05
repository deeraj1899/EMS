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
    <div className="min-h-screen bg-gradient-to-b from-[#12172b] to-[#1e1e2f] text-white font-['Inter'] flex flex-col items-center pt-20 px-8 pb-8">
      <div className="w-full max-w-5xl text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Submitted Works</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white py-3 px-6 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:bg-gray-700 hover:-translate-y-1"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-indigo-300 text-lg my-8">Loading submitted works...</p>
        ) : error ? (
          <p className="text-red-400 text-lg my-8 p-2 bg-red-400/10 rounded-lg">{error}</p>
        ) : submittedWorks.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 p-4">
            {submittedWorks.map((work, index) => (
              <div
                key={work._id}
                className="perspective-[1000px] transition-transform duration-500 animate-slideIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-[#2a2e47] rounded-xl p-6 shadow-xl transition-all duration-300 transform-style-3d hover:[transform:rotateY(10deg)_rotateX(10deg)] hover:shadow-[0_8px_20px_rgba(108,122,194,0.4)]">
                  <h3 className="text-xl font-bold text-white mb-3 whitespace-nowrap overflow-hidden text-ellipsis sm:text-lg">{work.title}</h3>
                  <p className="text-sm text-gray-200 mb-4 line-clamp-3 sm:line-clamp-2">{work.description}</p>
                  <div className="flex justify-between items-center">
                    <a
                      href={work.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6c7ac2] text-sm font-semibold hover:text-indigo-300 transition-colors duration-300"
                    >
                      View GitHub
                    </a>
                    <img
                      src={message}
                      alt="Review"
                      className="w-6 h-6 cursor-pointer transition-transform duration-300 hover:scale-125"
                      onClick={() => handleImageClick(work)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-200 text-lg my-8">No submitted works found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeReviewWork;