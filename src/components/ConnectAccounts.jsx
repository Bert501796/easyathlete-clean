import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectAccounts = () => {
  const navigate = useNavigate();
  const [stravaConnected, setStravaConnected] = useState(false);
  const [fitFiles, setFitFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');

  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const token = localStorage.getItem('strava_token');
    if (token) {
      setStravaConnected(true);
    }
  }, []);

  const clientId = '161074';
  const redirectUri =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5173/strava-redirect'
      : 'https://easyathlete.vercel.app/strava-redirect';

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=auto&scope=read,activity:read_all`;

  const handleFileChange = (event) => {
    setFitFiles(Array.from(event.target.files));
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!fitFiles || fitFiles.length === 0) {
      setUploadStatus('Please select one or more files first.');
      return;
    }

    if (!userId) {
      setUploadStatus('❌ No user found. Please complete onboarding first.');
      return;
    }

    const formData = new FormData();
    fitFiles.forEach((file) => {
      formData.append('fitFiles', file);
    });

    try {
      const response = await fetch(
        `https://easyathlete-backend-production.up.railway.app/upload-fit?userId=${userId}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        setUploadStatus('✅ Files uploaded successfully.');
        setFitFiles([]);
        navigate('/schedule');
      } else {
        setUploadStatus('❌ Upload failed. Try again.');
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('❌ An error occurred during upload.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Connect your accounts</h2>
      <p className="mb-6">You can connect one or both platforms, or skip this step.</p>

      <div className="flex flex-col gap-4 items-center">
        {stravaConnected ? (
          <p className="text-green-600">✅ Strava Connected</p>
        ) : (
          <a
            href={stravaAuthUrl}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            🔗 Connect with Strava
          </a>
        )}

        <div className="w-full text-center">
          <p className="text-gray-700 mt-4 mb-2">Or upload Garmin .fit files:</p>
          <input
            type="file"
            accept=".fit"
            multiple
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            ⬆️ Upload .fit Files
          </button>
          {uploadStatus && <p className="mt-2 text-sm">{uploadStatus}</p>}
        </div>

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

// ✅ This is required for Vercel to resolve the import from App.jsx
export default ConnectAccounts;
