import React from 'react';
import { useNavigate } from 'react-router-dom';

const Paywall = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/signup');
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Unlock Your Personalized Training Plan</h2>
      <p className="mb-6 text-gray-600">
        We’ve created your plan based on your goals and training background. <br />
        To unlock your full plan and weekly updates, continue below.
      </p>

      <button
        onClick={handleProceed}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        🚀 Proceed to Signup
      </button>

      <p className="mt-4 text-sm text-gray-400">* Payment integration coming soon</p>
    </div>
  );
};

export default Paywall;
