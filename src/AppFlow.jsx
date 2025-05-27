import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import OnboardingChatbot from './components/OnboardingChatbot';
import StravaRedirect from './components/StravaRedirect';
import StravaOverview from './components/StravaOverview';
import TrainingSchedule from './components/TrainingSchedule';
import StripeBuyButton from './components/StripeBuyButton';

export default function AppFlow() {
  const location = useLocation();

  const [onboardingData, setOnboardingData] = useState(null);
  const [stravaData, setStravaData] = useState(null);
  const [hasPaid, setHasPaid] = useState(() => {
    return localStorage.getItem('has_paid') === 'true';
  });

  useEffect(() => {
    const savedOnboarding = localStorage.getItem('onboarding_data');
    if (savedOnboarding) {
      try {
        const parsed = JSON.parse(savedOnboarding);
        if (
          parsed &&
          parsed.goal &&
          parsed.level &&
          parsed.daysPerWeek &&
          parsed.sports &&
          parsed.sports.length > 0
        ) {
          setOnboardingData(parsed);
        } else {
          console.log('🧩 Local onboarding was incomplete, resetting:', parsed);
          localStorage.removeItem('onboarding_data');
        }
      } catch (e) {
        console.error('Error parsing onboarding data:', e);
        localStorage.removeItem('onboarding_data');
      }
    }

    const savedStrava = localStorage.getItem('strava_activities');
    if (savedStrava) {
      try {
        setStravaData(JSON.parse(savedStrava));
      } catch (e) {
        console.error('Error parsing Strava data:', e);
        localStorage.removeItem('strava_activities');
      }
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      localStorage.setItem('has_paid', 'true');
      setHasPaid(true);
    }

    const handleMessage = (event) => {
      if (event.data === 'stripe_payment_success') {
        localStorage.setItem('has_paid', 'true');
        setHasPaid(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [location]);

  const handleOnboardingComplete = (data) => {
    setOnboardingData(data);
    localStorage.setItem('onboarding_data', JSON.stringify(data));
    localStorage.removeItem('has_paid');
    setHasPaid(false);
  };

  const handleStravaData = (data) => {
    setStravaData(data);
    localStorage.setItem('strava_activities', JSON.stringify(data));
  };

  console.log('🧠 Onboarding:', onboardingData);
  console.log('📊 Strava:', stravaData);
  console.log('💳 Paid?', hasPaid);

  if (!onboardingData || !onboardingData.goal || !onboardingData.level || !onboardingData.daysPerWeek || !onboardingData.sports || onboardingData.sports.length === 0) {
    return <OnboardingChatbot onComplete={handleOnboardingComplete} onboardingData={onboardingData} />;
  }

if (location.pathname === '/strava-redirect') {
  return <StravaRedirect onDataLoaded={handleStravaData} />;
}


  // if (!stravaData) {
  //   return (
  //     <div className="p-6 text-center">
  //       <p>⚠️ Strava data not found. Please reconnect your account.</p>
  //     </div>
  //   );
  // }

  if (!hasPaid) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">✅ You're Connected!</h2>
        <p className="mb-6">To access your personalized training plan, please complete your purchase:</p>
        <div className="flex justify-center">
          <StripeBuyButton />
        </div>
        <p className="mt-4 text-sm text-gray-500">Once your payment is complete, you will be redirected back here automatically.</p>
      </div>
    );
  }

return <TrainingSchedule onboarding={onboardingData} activities={stravaData || []} />;
}
