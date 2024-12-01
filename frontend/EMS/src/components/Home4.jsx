import React, { useState } from 'react';
import "../assets/styles/Home4.css";

const Home4 = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (activeTab === 'reviews') {
      return (
        <div className="reviews-container">
          <div className="review-card">
            <div className="review-heading">
              <h2>Victor J.</h2>
              <hr className="review-divider" />
            </div>
            <div className="review-content">
              <h4>
                ERS has been an absolute game-changer for me in terms of my professional growth and development. 
                The user-friendly interface and intuitive design have made it incredibly easy for me to navigate and utilize the platform.
              </h4>
            </div>
          </div>
          <div className="review-card">
            <div className="review-heading">
              <h2>Shreya P.</h2>
              <hr className="review-divider" />
            </div>
            <div className="review-content">
              <h4>
                I tried to avoid having 10 different platforms to manage our employees and there is no other platform that combines engagement, growth, and feedback like ERS does.
              </h4>
            </div>
          </div>
          <div className="review-card">
            <div className="review-heading">
              <h2>Anushka Sharma</h2>
              <hr className="review-divider" />
            </div>
            <div className="review-content">
              <h4>
                Having everything in one platform gives us insights on what we can do to support or address areas of opportunity.
              </h4>
            </div>
          </div>
          <div className="review-card">
            <div className="review-heading">
              <h2>Daniel Jones</h2>
              <hr className="review-divider" />
            </div>
            <div className="review-content">
              <h4>
                We chose ERS because it did performance management really well and had the functions we were looking for.
              </h4>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'updates') {
      return (
        <div className="updates-container">
          <h1>....NO UPDATES...STAY TUNED</h1>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="tabs-container">
        <h3 className={activeTab === 'reviews' ? 'active-tab' : ''} onClick={() => handleTabClick('reviews')}>Reviews</h3>
        <h3 className={activeTab === 'updates' ? 'active-tab' : ''} onClick={() => handleTabClick('updates')}>Updates</h3>
      </div>
      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home4;
