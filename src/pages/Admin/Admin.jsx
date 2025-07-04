import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [status, setStatus] = useState('');
  const [stravaLinked, setStravaLinked] = useState(false);
  const userId = localStorage.getItem('easyathlete_mongo_id'); // ✅ correct and existing
  //const testActivityId = '14648230897';
  const API_BASE = 'https://easyathlete-backend-production.up.railway.app';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stravaLinked') === '1') {
      setStravaLinked(true);
    }
  }, []);

  const handleRefetchActivities = async () => {
    setStatus('🔁 Refreshing token...');
    try {
      const refreshRes = await fetch(`${API_BASE}/strava/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const refreshText = await refreshRes.text();
      let refreshData;
      try {
        refreshData = JSON.parse(refreshText);
      } catch {
        throw new Error('Refresh response is not valid JSON');
      }

      if (!refreshRes.ok) throw new Error(refreshData.error || 'Failed to refresh token');
      const accessToken = refreshData.accessToken;
      if (!accessToken) throw new Error('No access token returned from refresh');

      setStatus('✅ Token ready. Fetching activities...');

   //   const fetchRes = await fetch(`${API_BASE}/strava/fetch-activities?testActivityId=${testActivityId}`, {
        const fetchRes = await fetch(`${API_BASE}/strava/fetch-activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, userId, forceRefetch: true,  // ✅ Enable full pagination
    limit: 400 })
      });

      const fetchText = await fetchRes.text();
      let fetchData;
      try {
        fetchData = JSON.parse(fetchText);
      } catch {
        throw new Error('Fetch response is not valid JSON');
      }

      if (!fetchRes.ok) throw new Error(fetchData.error || 'Failed to fetch activities');
      setStatus(`✅ ${fetchData.count} activities (re)fetched and stored`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  const handleConnectStrava = async () => {
    try {
      setStatus('🔗 Generating Strava authorization link...');
      const res = await fetch(`${API_BASE}/strava/auth/admin-initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();
      if (!res.ok || !data.authUrl) {
        throw new Error(data.error || 'Failed to generate Strava link');
      }

      setStatus('➡️ Redirecting to Strava...');
      window.location.href = data.authUrl;
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  const handlePredictBestEfforts = async () => {
    try {
      setStatus('📈 Running best-effort prediction...');

      const res = await fetch(`${API_BASE}/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Prediction failed');

      setStatus(`✅ Prediction complete: ${JSON.stringify(data.result, null, 2)}`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">🛠️ Admin Panel</h2>

      {stravaLinked && (
        <div className="bg-green-100 text-green-800 p-4 rounded">
          ✅ Successfully connected to Strava!
        </div>
      )}

      <button
        onClick={handleConnectStrava}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
      >
        🔗 Connect This User to Strava
      </button>

      <button
        onClick={handleRefetchActivities}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        🔄 Re-fetch Strava Activities (Single Test Activity)
      </button>

      <button
        onClick={handlePredictBestEfforts}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
      >
        📊 Predict Best Effort Times (ML)
      </button>

      <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{status}</div>
    </div>
  );
};

export default Admin;
