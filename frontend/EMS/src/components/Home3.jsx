import React from 'react';
import '../assets/styles/Home3.css';
import Logo1 from '../assets/Images/Logo1.png'; // Importing images
import Logo2 from '../assets/Images/Logo2.png';
import Logo3 from '../assets/Images/Logo3.png';
import Logo4 from '../assets/Images/Logo4.png';
import Logo5 from '../assets/Images/Logo5.png';
import Logo6 from '../assets/Images/Logo6.png';

const Home3 = () => {
  return (
    <div className='Home3-main'>
      <h2>100+ Organizations Trust Us</h2>
      <div className="logos">
        <img src={Logo1} alt='Logo 1'/>
        <img src={Logo2} alt='Logo 2'/>
        <img src={Logo3} alt='Logo 3'/>
        <img src={Logo4} alt='Logo 4'/>
        <img src={Logo5} alt='Logo 5'/>
        <img src={Logo6} alt='Logo 6'/>
      </div>
    </div>
  );
}

export default Home3;
