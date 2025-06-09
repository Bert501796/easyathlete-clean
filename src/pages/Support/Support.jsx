import React from 'react';
import { Link } from 'react-router-dom';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold mb-4">Need Help?</h1>
      <p className="mb-6 text-gray-700 max-w-lg">
        If you're experiencing issues or have feedback, we're here to help.
        Please don’t hesitate to get in touch with us.
      </p>
      
      <a
        href="mailto:bverschoren@gmail.com"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition mb-8"
      >
        Contact EasyAthlete
      </a>

      <p className="text-gray-600 text-sm">
        You can also review our <Link to="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> for more information about your rights and how your data is handled.
      </p>
    </div>
  );
};

export default Support;
