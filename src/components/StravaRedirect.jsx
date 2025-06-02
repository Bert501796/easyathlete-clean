import React, { useEffect, useState } from 'react';

const StravaRedirect = () => {
  const [status, setStatus] = useState('Connecting to Strava...');

  // Only allow execution if 'code' param is present
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');

  if (!code) {
    console.warn("⛔ No authorization code in URL. Skipping StravaRedirect.");
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Strava Redirect</h2>
        <p>⛔ Invalid access. No code received.</p>
      </div>
    );
  }

  console.log("🧭 StravaRedirect mounted");
  console.log("✅ code from URL:", code);
  console.log("✅ state from URL:", state);

  useEffect(() => {
    const userId = localStorage.getItem('easyathlete_user_id');
    console.log("👤 userId from localStorage:", userId);

    if (!userId) {
      console.warn('❌ No user ID found. Redirecting to homepage.');
      setStatus('❌ No onboarding data found. Returning to start...');
      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
      return;
    }

    if (state && state !== userId) {
      console.warn('⚠️ State mismatch. Redirecting to homepage.');
      setStatus('⚠️ Authorization mismatch. Returning to start...');
      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
      return;
    }

    const exchangeToken = async () => {
      try {
        setStatus('🔄 Exchanging code with backend...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/strava/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, userId }),
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
  }, [code, state]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Strava Redirect</h2>
      <p>{status}</p>
    </div>
  );
};

export default StravaRedirect;
