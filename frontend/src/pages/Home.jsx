import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import companyLogo from '../assets/Images/CompanyLogo.png';
import Homee2 from '../assets/Images/home.jpg';
import Logo1 from '../assets/Images/Logo1.png';
import Logo2 from '../assets/Images/Logo2.png';
import Logo3 from '../assets/Images/Logo3.png';
import Logo4 from '../assets/Images/Logo4.png';
import Logo5 from '../assets/Images/Logo5.png';
import Logo6 from '../assets/Images/Logo6.png';

const Home = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  const handleTabClick = (tab) => setActiveTab(tab);

  const renderContent = () => {
    if (activeTab === 'reviews') {
      return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 p-4">
          {[
            { name: 'Victor J.', text: 'ERS has been an absolute game-changer...' },
            { name: 'Shreya P.', text: 'I tried to avoid having 10 different platforms...' },
            { name: 'Anushka Sharma', text: 'Having everything in one platform gives us insights...' },
            { name: 'Daniel Jones', text: 'We chose ERS because it did performance management...' },
          ].map((review, index) => (
            <div key={index} className="bg-white shadow-lg rounded-2xl p-4 transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-semibold mb-2">{review.name}</h2>
              <hr className="mb-2" />
              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      );
    } else {
      return <div className="text-center p-8 text-gray-500 text-lg">....NO UPDATES...STAY TUNED</div>;
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center flex-wrap">
        <div className="flex items-center space-x-2">
          <img src={companyLogo} alt="Company Logo" className="h-10 w-10" />
          <h2 className="text-xl font-bold">Employee Management System</h2>
        </div>
        <div className="space-x-2">
          <Link to="/LoginasEmployee">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">Login as Employee</button>
          </Link>
          <Link to="/PricingPlan">
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">Create Organization</button>
          </Link>
        </div>
      </header>

      {/* Section 1 */}
      <section className="flex flex-col lg:flex-row items-center justify-between p-6 gap-8">
        <img src={Homee2} alt="Header" className="w-full lg:w-1/2 rounded-lg shadow-md" />
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold">Create Your Organization and Track Your Employees Effortlessly</h1>
          <h3 className="text-lg md:text-xl text-gray-600">Performance Management Software that slashes 90% admin workload</h3>
        </div>
      </section>

      {/* Section 2 */}
      <section className="p-6 bg-gray-100 text-center">
        <h2 className="text-xl font-semibold mb-6">100+ Organizations Trust Us</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center justify-center">
          {[Logo1, Logo2, Logo3, Logo4, Logo5, Logo6].map((logo, index) => (
            <img key={index} src={logo} alt={`Logo ${index + 1}`} className="h-12 mx-auto" />
          ))}
        </div>
      </section>

      {/* Section 3 - Tabs */}
      <section className="p-6">
        <div className="flex justify-center space-x-6 mb-4">
          <button onClick={() => handleTabClick('reviews')} className={`${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'} pb-1 text-lg transition`}>
            Reviews
          </button>
          <button onClick={() => handleTabClick('updates')} className={`${activeTab === 'updates' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'} pb-1 text-lg transition`}>
            Updates
          </button>
        </div>
        {renderContent()}
      </section>

      {/* Section 4 - Why Us */}
      <section className="p-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">WHY US?</h2>
        <div className="space-y-12">
          {[
            {
              title: 'Save time with automation',
              text: 'Easily create reusable review templates and set automated review cycles...'
            },
            {
              title: 'Empower professional growth',
              text: 'Evaluate employee performance across key skills and competencies...'
            },
            {
              title: 'Tailor employee reviews to your needs',
              text: 'Utilize review data to track performance trends...'
            },
            {
              title: 'Reduce 90% admin work per evaluation cycle',
              text: 'Take complete control of performance review cycle...'
            },
          ].map((item, index) => (
            <div key={index} className={`flex flex-col md:flex-row ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''} gap-8 items-center`}>              
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
              <div className="w-full md:w-1/2 h-40 bg-gray-100 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Employee Management System</h2>
            <p>Simplifying workforce management with intuitive tools and efficient solutions.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#about" className="hover:underline">About Us</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
              <li><a href="#faq" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p>Email: support@employeemanagement.com</p>
            <p>Phone: +1 (234) 567-890</p>
            <p>Address: 123 Corporate Way, Business City</p>
          </div>
        </div>
        <div className="bg-gray-900 text-center py-3">
          &copy; 2024 Employee Management System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;