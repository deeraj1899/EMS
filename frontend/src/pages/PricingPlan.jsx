import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { AUTH_API_ENDPOINT } from '../utils/constant.js';

const stripePromise = loadStripe('pk_test_51R1DCqEDDB0vcEP5eG8ENk9UOlghBKw0fR6JWJwu5YKNhnbbWCbZtkDUigiweY2ArWRXxPkUjMycg0iCVEpeIAS3002c97XwMZ');

const PricingPlan = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async (planType) => {
    setLoading(true);
    try {
      navigate('/create-organization');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-4 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Choose a Pricing Plan</h1>
      <p className="text-xl text-gray-600 max-w-xl text-center mb-12">
        Subscribe now and unlock all features for your organization. Choose from a 6-month or 12-month plan below.
      </p>

      <div className="mb-6">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full max-w-md border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-8 flex-wrap justify-center">
        {[
          { label: '6-Month Plan', desc: 'Full access for half a year.', amount: '₹12,000', key: '6month' },
          { label: '12-Month Plan', desc: 'Best value with priority support.', amount: '₹20,000', key: '12month' }
        ].map((plan) => (
          <div key={plan.key} className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-72 text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{plan.label}</h2>
            <p className="text-gray-600 mb-6">{plan.desc}</p>
            <div className="text-3xl font-bold text-gray-900 mb-6">{plan.amount}</div>
            <button
              onClick={() => handleCheckout(plan.key)}
              disabled={loading || !email}
              className={`py-2 px-6 rounded-lg text-white ${loading || !email ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlan;
