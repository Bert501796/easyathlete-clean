import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConnectAccounts = () => {
  const navigate = useNavigate();
  const [stravaConnected, setStravaConnected] = useState(false);
  const [fitFile, setFitFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

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
    setFitFile(event.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!fitFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('fitFile', fitFile);

    try {
      const response = await fetch('http://localhost:3001/upload-fit', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadStatus('✅ File uploaded successfully.');
        setFitFile(null);
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
          <p className="text-gray-700 mt-4 mb-2">Or upload a Garmin .fit file:</p>
          <input
            type="file"
            accept=".fit"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            ⬆️ Upload .fit File
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

export default ConnectAccounts;
