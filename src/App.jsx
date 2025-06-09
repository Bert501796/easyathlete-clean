// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { Navigate } from 'react-router-dom';


import OnboardingChatbot from './components/OnboardingChatbot';
import ConnectAccounts from './components/ConnectAccounts';
import StravaRedirect from './components/StravaRedirect';
import GenerateSchedule from './components/GenerateSchedule';
import Insights from './pages/Insights/Insights';
import TrainingSchedule from './pages/TrainingSchedule/TrainingSchedule';
import Signup from './components/auth/Signup'; // ✅ updated path
import Login from './components/auth/Login';   // ✅ updated path
import Paywall from './components/payment/Paywall';
import DashboardTabs from './pages/Dashboard/DashboardTabs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';


const Home = ({ answers, onComplete }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('easyathlete_user_id');

useEffect(() => {
  const userId = localStorage.getItem('easyathlete_user_id');
  const onboardingStarted = localStorage.getItem('easyathlete_onboarding_messages');

  console.log('🧭 Router loaded at:', location.pathname);
  console.log('👤 LocalStorage userId:', userId);

  if (!userId && !onboardingStarted && !location.pathname.startsWith('/strava-redirect')) {
    console.warn('⛔ No onboarding started, redirecting to /');
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

  const handleOnboardingComplete = async (data) => {
    let userId = localStorage.getItem('easyathlete_user_id');

    if (!userId) {
      userId = `user_${crypto.randomUUID()}`;
      localStorage.setItem('easyathlete_user_id', userId);
      console.log('🆕 Generated userId:', userId);
    }

    console.log('📤 Submitting onboarding with:', { userId, onboardingData: data });

    try {
      await fetch('https://easyathlete-backend-production.up.railway.app/upload-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, onboardingData: data }),
      });

      console.log('✅ Onboarding complete:', data);
      localStorage.setItem('onboarding_answers', JSON.stringify(data));
      setAnswers(data);
    } catch (err) {
      console.error('❌ Failed to upload onboarding:', err);
    }
  };

  return (
  <>
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home answers={answers} onComplete={handleOnboardingComplete} />}
        />
        <Route path="/connect" element={<ConnectAccounts />} />
        <Route path="/strava-redirect" element={<StravaRedirect />} />
        <Route path="/schedule" element={<TrainingSchedule />} />
        <Route path="/generate" element={<GenerateSchedule />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pay" element={<Paywall />} />
        <Route path="/dashboard" element={<DashboardTabs />} />
        <Route path="/schedule" element={<Navigate to="/dashboard" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
    </Router>

    <img
      src="/assets/strava/powered_by_strava_black.png"
      alt="Powered by Strava"
      className="fixed top-4 right-4 h-3 md:h-5 z-50 opacity-80 hover:opacity-100 transition"
    />
  </>
);
}