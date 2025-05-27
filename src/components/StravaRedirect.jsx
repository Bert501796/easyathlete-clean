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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/strava/exchange`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code }),
});


        const data = await response.json();

        if (!response.ok || !data.access_token) {
          throw new Error(data.error || 'Failed to retrieve token');
        }

        localStorage.setItem('strava_token', data.access_token);
        setStatus('✅ Strava connected! You can now continue.');
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
