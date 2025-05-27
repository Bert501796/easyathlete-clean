// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import OnboardingChatbot from './components/OnboardingChatbot';
import ConnectAccounts from './components/ConnectAccounts';
import StravaRedirect from './components/StravaRedirect';

const Home = ({ answers, onComplete }) => {
  const navigate = useNavigate();

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

  const handleOnboardingComplete = (data) => {
    console.log('✅ Onboarding complete:', data);
    localStorage.setItem('onboarding_answers', JSON.stringify(data));
    setAnswers(data);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home answers={answers} onComplete={handleOnboardingComplete} />}
        />
        <Route path="/connect" element={<ConnectAccounts />} />
        <Route path="/strava-redirect" element={<StravaRedirect />} />
      </Routes>
    </Router>
  );
}
