import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectAccounts = () => {
  const navigate = useNavigate();

  const clientId = '161074';
  const redirectUri =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5173/strava-redirect'
      : 'https://easyathlete.vercel.app/strava-redirect';

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=auto&scope=read,activity:read_all`;

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Connect your accounts</h2>
      <p className="mb-6">You can connect one or both platforms, or skip this step.</p>

      <div className="flex flex-col gap-4 items-center">
        <a
          href={stravaAuthUrl}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          🔗 Connect with Strava
        </a>

        <button
          className="bg-gray-400 text-white px-6 py-2 rounded cursor-not-allowed opacity-50"
          disabled
        >
          ⏳ Garmin coming soon
        </button>

        <button
          className="mt-6 text-blue-600 underline"
          onClick={() => navigate('/schedule')}
        >
          Skip & Continue Without Connecting
        </button>
      </div>
    </div>
  );
};

export default ConnectAccounts;
