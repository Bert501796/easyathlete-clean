import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

import OnboardingChatbot from './components/OnboardingChatbot';
import ConnectAccounts from './components/ConnectAccounts';
import StravaRedirect from './components/StravaRedirect';
import GenerateSchedule from './components/GenerateSchedule';
import Insights from './pages/Insights/Insights';
import TrainingSchedule from './pages/TrainingSchedule/TrainingSchedule';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Paywall from './components/payment/Paywall';
import DashboardTabs from './pages/Dashboard/DashboardTabs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Support from './pages/Support/Support';

const Home = ({ answers, onComplete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const userId = localStorage.getItem('easyathlete_user_id');
    const onboardingStarted = localStorage.getItem('easyathlete_onboarding_messages');

    if (!userId && !onboardingStarted && !location.pathname.startsWith('/strava-redirect')) {
      navigate('/');
    }

    if (location.pathname === '/' && userId && !answers) {
      console.warn('⚠️ Unexpected redirect to onboarding, but userId exists. Check onboarding_answers in localStorage.');
    }
  }, [location.pathname, userId, answers, navigate]);

  if (!answers) {
    return <OnboardingChatbot onComplete={onComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Welcome to EasyAthlete 👋</h2>
        <p className="mb-2">Thanks for completing the onboarding.</p>
        <pre className="bg-gray-100 p-4 rounded text-left text-sm overflow-auto">
          {JSON.stringify(answers, null, 2)}
        </pre>
        <button
          className="mt-6 text-blue-600 underline"
          onClick={() => navigate('/connect')}
        >
          Continue to account connection →
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [answers, setAnswers] = useState(() => {
    const stored = localStorage.getItem('onboarding_answers');
    return stored ? JSON.parse(stored) : null;
  });
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const handleRevokeStrava = async () => {
    const userId = localStorage.getItem('easyathlete_user_id');
    if (!userId) return;
    try {
      await fetch(`https://easyathlete-backend-production.up.railway.app/auth/${userId}`, {
        method: 'DELETE',
      });
      localStorage.clear();
      alert('✅ Your data has been deleted and Strava access revoked.');
      window.location.href = '/';
    } catch (error) {
      alert('❌ Something went wrong. Please try again later.');
      console.error(error);
    }
  };

const isLoggedIn = !!localStorage.getItem('easyathlete_mongo_id');
  const isOnboarding = window.location.pathname === '/';

  return (
    <Router>
      <div className="fixed top-4 left-4 z-50 text-xs text-gray-600 flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            <a href="/dashboard" className="text-blue-600 font-medium hover:underline">Home</a>
            <a href="/support" className="hover:underline">Support</a>
            <details className="group relative">
              <summary className="cursor-pointer hover:underline">My Account</summary>
              <div className="absolute mt-2 bg-white border rounded shadow-lg text-sm z-50 w-48">
                <button onClick={() => window.location.href = 'mailto:support@easyathlete.com'} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Contact Support</button>
                <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Sign Out</button>
                <button onClick={() => setShowRevokeModal(true)} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100">Revoke Strava Access</button>
              </div>
            </details>
          </>
        ) : (
          <>
            {!isOnboarding && <a href="/" className="hover:underline">Home</a>}
            <a href="/login" className="text-blue-600 font-medium hover:underline">Sign In</a>
            <a href="/support" className="hover:underline">Support</a>
          </>
        )}
      </div>

      <img
        src="/assets/strava/powered_by_strava_black.png"
        alt="Powered by Strava"
        className="fixed top-4 right-4 h-4 md:h-5 z-40 object-contain"
      />

      <Routes>
        <Route path="/" element={<Home answers={answers} onComplete={setAnswers} />} />
        <Route path="/connect" element={<ConnectAccounts />} />
        <Route path="/strava-redirect" element={<StravaRedirect />} />
        <Route path="/schedule" element={<TrainingSchedule />} />
        <Route path="/generate" element={<GenerateSchedule />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pay" element={<Paywall />} />
        <Route path="/dashboard" element={<DashboardTabs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/support" element={<Support />} />
      </Routes>

      {showRevokeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p className="text-sm mb-6">
              This will permanently delete your EasyAthlete account and revoke access to your Strava data.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowRevokeModal(false)} className="text-gray-600 hover:underline">No</button>
              <button onClick={handleRevokeStrava} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}
