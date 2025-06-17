import React, { useState } from 'react';

const Admin = () => {
  const [status, setStatus] = useState('');
  const userId = '684451aa149305eb4092db0b'; // Replace with real userId from auth context or props

  const handleRefetchActivities = async () => {
    setStatus('🔁 Refreshing token...');

    try {
      // 1. Refresh token if needed
      const refreshRes = await fetch('/strava/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const refreshData = await refreshRes.json();
      if (!refreshRes.ok) throw new Error(refreshData.error || 'Failed to refresh token');

      const accessToken = refreshData.accessToken;
      setStatus('✅ Token ready. Fetching activities...');

      // 2. Fetch activities
      const fetchRes = await fetch('/strava/fetch-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, userId })
      });

      const fetchData = await fetchRes.json();
      if (!fetchRes.ok) throw new Error(fetchData.error || 'Failed to fetch activities');

      setStatus(`✅ ${fetchData.count} activities (re)fetched and stored`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">🛠️ Admin Panel</h2>
      <button
        onClick={handleRefetchActivities}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        🔄 Re-fetch Strava Activities
      </button>
      <div className="text-sm text-gray-700 mt-2">{status}</div>
    </div>
  );
};

export default Admin;
