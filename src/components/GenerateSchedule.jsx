// src/pages/GenerateSchedule.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerateSchedule = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('easyathlete_user_id');
  const athleteData = JSON.parse(localStorage.getItem('onboarding_answers')); // Or wherever it's stored

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!userId || !athleteData) {
        console.error('❌ Missing userId or athleteData');
        return;
      }

      try {
        const res = await fetch('https://easyathlete-backend-production.up.railway.app/generate-training-schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, athleteData })
        });

        if (!res.ok) throw new Error('Failed to generate schedule');

        const data = await res.json();
        console.log('✅ Schedule generated:', data.schedule);

        // 🧠 Store it for /schedule page
        localStorage.setItem('training_schedule', JSON.stringify(data.schedule));

        // 👣 Navigate to show the schedule
        navigate('/schedule');
      } catch (err) {
        console.error('❌ Schedule generation failed:', err);
      }
    };

    fetchSchedule();
  }, [navigate, userId, athleteData]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">⏳ Creating your training schedule...</h2>
      <img
        src="https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif"
        alt="Loading..."
        className="mx-auto w-40"
      />
      <p className="mt-4 text-gray-600">Please hold on while your plan is being generated.</p>
    </div>
  );
};

export default GenerateSchedule;
