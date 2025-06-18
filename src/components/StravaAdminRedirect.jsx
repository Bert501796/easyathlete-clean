import { useEffect } from 'react';

const StravaAdminRedirect = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const userId = params.get('state');

    if (!code || !userId) {
      window.location.href = '/dashboard?stravaLinked=0';
      return;
    }

    // Let the browser fully handle the redirect chain
    window.location.href = `https://easyathlete-backend-production.up.railway.app/strava/admin-redirect?code=${code}&state=${userId}`;
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">🔗 Finalizing Strava Connection...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
};

export default StravaAdminRedirect;
