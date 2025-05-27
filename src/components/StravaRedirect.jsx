import React, { useEffect, useState } from 'react';

const StravaRedirect = () => {
  const [status, setStatus] = useState('Connecting to Strava...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      setStatus('❌ Authorization code not found in URL.');
      return;
    }

    const exchangeToken = async () => {
      try {
        // Step 1: Exchange code for access token
        const response = await fetch(`${import.meta.env.VITE_API_URL}/strava/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok || !data.access_token) {
          throw new Error(data.error || 'Failed to retrieve token');
        }

        const accessToken = data.access_token;
        localStorage.setItem('strava_token', accessToken);

        // Step 2: Fetch recent activities
        const activitiesRes = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const activities = await activitiesRes.json();

        // Step 3: Store in localStorage
        localStorage.setItem('strava_activities', JSON.stringify(activities));

        // Step 4: Redirect to /connect
        window.location.href = '/connect';
      } catch (error) {
        console.error(error);
        setStatus(`❌ ${error.message}`);
      }
    };

    exchangeToken();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Strava Redirect</h2>
      <p>{status}</p>
    </div>
  );
};

export default StravaRedirect;
