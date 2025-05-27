import React, { useEffect, useState } from 'react';

const StravaRedirect = () => {
  const [status, setStatus] = useState('Connecting to Strava...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("🚨 useEffect triggered");
    console.log("✅ code from URL:", code);

    if (!code) {
      setStatus('❌ Authorization code not found in URL.');
      return;
    }

    const exchangeToken = async () => {
      try {
        console.log("📤 Sending code to backend...");
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
        console.log("📥 Received access token:", accessToken);
        localStorage.setItem('strava_token', accessToken);

        const activitiesRes = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=100', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const activities = await activitiesRes.json();
        console.log("✅ Activities fetched:", activities);

        localStorage.setItem('strava_activities', JSON.stringify(activities));
        window.location.href = '/connect';
      } catch (error) {
        console.error("❌ Error during Strava redirect flow:", error);
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
