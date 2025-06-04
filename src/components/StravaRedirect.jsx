// src/pages/StravaRedirect.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StravaRedirect = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('⏳ Connecting to Strava...');

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

    const connectStrava = async () => {
      try {
        // Exchange the authorization code for access token
        const response = await fetch('https://easyathlete-backend-production.up.railway.app/strava/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, userId }),
        });

        if (!response.ok) throw new Error('Token exchange failed');

        const data = await response.json();
        const token = data.access_token;
        localStorage.setItem('strava_access_token', token);
        setStatus('✅ Strava connected! Fetching activities...');

        // Fetch activities
        const res = await fetch('https://easyathlete-backend-production.up.railway.app/strava/fetch-activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken: token, userId }),
        });

        if (!res.ok) throw new Error('Failed to fetch activities');

        setStatus('✅ Activities fetched! Redirecting to onboarding...');
        setTimeout(() => navigate('/onboarding'), 2000);
      } catch (err) {
        console.error(err);
        setStatus('❌ Strava connection or fetch failed. Redirecting...');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    connectStrava();
  }, [navigate]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Strava Redirect</h2>
      <p className="mb-4">{status}</p>
    </div>
  );
};

export default StravaRedirect;
