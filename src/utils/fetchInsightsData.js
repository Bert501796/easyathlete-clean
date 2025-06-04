export const fetchLatestInsightsJson = async (userId) => {
  const cacheKey = `strava_insights_${userId}`;
  const cacheTimestampKey = `${cacheKey}_timestamp`;

  const cached = localStorage.getItem(cacheKey);
  const lastFetched = localStorage.getItem(cacheTimestampKey);
  const now = Date.now();

  // Use cached version if less than 30 minutes old
  if (cached && lastFetched && now - parseInt(lastFetched, 10) < 30 * 60 * 1000) {
    return JSON.parse(cached);
  }

  try {
    const res = await fetch(`https://easyathlete-backend-production.up.railway.app/strava/insights/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch insights');

    const json = await res.json();

    // Cache the new result
    localStorage.setItem(cacheKey, JSON.stringify(json));
    localStorage.setItem(cacheTimestampKey, now.toString());

    return json;
  } catch (err) {
    console.error('❌ Failed to fetch latest insights:', err);
    if (cached) {
      console.warn('⚠️ Using stale cached data');
      return JSON.parse(cached);
    }
    throw err;
  }
};
