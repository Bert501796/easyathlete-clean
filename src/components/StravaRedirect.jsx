import React, { useEffect, useState } from 'react';

console.log("🧭 StravaRedirect mounted");

const StravaRedirect = () => {
  const [status, setStatus] = useState('Connecting to Strava...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const userId = localStorage.getItem('easyathlete_user_id');
    const onboardingAnswers = localStorage.getItem('onboarding_answers');

    console.log("🚨 useEffect triggered");
    console.log("✅ code from URL:", code);
    console.log("✅ state from URL:", state);
    console.log("👤 userId from localStorage:", userId);
    console.log("📋 onboarding_answers:", onboardingAnswers ? '✅ Present' : '❌ Missing');

    // 1. Check if userId or onboarding is missing
    if (!userId || !onboardingAnswers) {
      console.warn('❌ No onboarding session. Redirecting...');
      setStatus('❌ Onboarding not complete. Returning to start...');
      setTimeout(() => {
        localStorage.clear();
        window.location.replace('/');
      }, 2000);
      return;
    }

    // 2. Code must be present
    if (!code) {
      setStatus('❌ Authorization code not found in URL.');
      return;
    }

    // 3. Optional: State validation (basic anti-CSRF)
    if (state && state !== userId) {
      console.warn('⚠️ State does not match userId. Redirecting...');
      setStatus('⚠️ Authorization mismatch. Returning to start...');
      setTimeout(() => {
        localStorage.clear();
        window.location.replace('/');
      }, 2000);
      return;
    }

    // 4. Exchange the code
    const exchangeToken = async () => {
      try {
        console.log("📤 Sending code + userId to backend...");
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
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Strava Redirect</h2>
      <p>{status}</p>
    </div>
  );
};

export default StravaRedirect;
