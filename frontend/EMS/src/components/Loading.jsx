import React from 'react';
import video2 from '../assets/videos/video-2.gif';

const Loading = () => {
  const spinnerStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  };

  return (
    <div style={spinnerStyles}>
      <img src={video2} alt="Loading..." />
    </div>
  );
};

export default Loading;
