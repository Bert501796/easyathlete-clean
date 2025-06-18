import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StravaAdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const userId = params.get('state');

    if (!code || !userId) {
      navigate('/admin?stravaLinked=0');
      return;
    }

    const finalizeStravaLink = async () => {
      try {
        const backendUrl = `https://easyathlete-backend-production.up.railway.app/strava/admin-redirect?code=${code}&state=${userId}`;
        const res = await fetch(backendUrl);
        if (res.ok) {
          navigate('/admin?stravaLinked=1');
        } else {
          navigate('/admin?stravaLinked=0');
        }
      } catch (err) {
        console.error(err);
        navigate('/admin?stravaLinked=0');
      }
    };

    finalizeStravaLink();
  }, [navigate]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h2 className="text-xl font-bold mb-4">🔗 Finalizing Strava Connection...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
};

export default StravaAdminRedirect;
