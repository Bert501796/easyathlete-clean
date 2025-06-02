import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StravaRedirect = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('⏳ Connecting to Strava...');
  const [accessToken, setAccessToken] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [activitiesUrl, setActivitiesUrl] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state'); // userId
    const userId = localStorage.getItem('easyathlete_user_id');

    if (!code || !userId || state !== userId) {
      setStatus('❌ Invalid state or code. Redirecting...');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const exchangeToken = async () => {
      try {
        const response = await fetch('https://easyathlete-backend-production.up.railway.app/strava/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, userId }),
        });

        if (!response.ok) throw new Error('Token exchange failed');

        const data = await response.json();
        setAccessToken(data.access_token);
        localStorage.setItem('strava_access_token', data.access_token);
        setStatus('✅ Strava connected successfully!');
      } catch (err) {
        console.error(err);
        setStatus('❌ Failed to connect to Strava.');
      }
    };

    exchangeToken();
  }, [navigate]);

  const handleFetchActivities = async () => {
    const userId = localStorage.getItem('easyathlete_user_id');
    const token = accessToken || localStorage.getItem('strava_access_token');

    if (!token || !userId) {
      setStatus('❌ Missing userId or token');
      return;
    }

    setFetching(true);
    setStatus('📡 Fetching activities...');

    try {
      const res = await fetch('https://easyathlete-backend-production.up.railway.app/strava/fetch-activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken: token, userId }),
      });

      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();

      setStatus('✅ Activities stored in Cloudinary!');
      setActivitiesUrl(data.cloudinaryUrl);
    } catch (err) {
      console.error(err);
      setStatus('❌ Error fetching activities');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Strava Redirect</h2>
      <p className="mb-4">{status}</p>

      {accessToken && !fetching && (
        <button
          onClick={handleFetchActivities}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Fetch My Strava Activities →
        </button>
      )}

      {activitiesUrl && (
        <div className="mt-4 text-sm text-gray-600">
          <a href={activitiesUrl} target="_blank" rel="noopener noreferrer" className="underline">
            View stored JSON
          </a>
        </div>
      )}
    </div>
  );
};

export default StravaRedirect;
