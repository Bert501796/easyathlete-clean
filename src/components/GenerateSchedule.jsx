import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerateSchedule = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!userId) {
        console.error('❌ No user ID found.');
        return;
      }

      try {
        const res = await fetch(`https://easyathlete-backend-production.up.railway.app/ai-prompt/${userId}`);
        if (!res.ok) throw new Error('Failed to generate schedule');

        const data = await res.json();
        console.log('✅ Schedule generated and saved:', data);

        // Navigate to the schedule page to view it
        navigate('/schedule');
      } catch (err) {
        console.error('❌ Schedule generation failed:', err);
        // You could show an error screen or fallback here if needed
      }
    };

    fetchSchedule();
  }, [navigate, userId]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">⏳ Creating your training schedule...</h2>
      <img
        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGN0a2R2ZXg1OWM4YTh5MzBmcnBneDBpcnpoNGFwMnRzeHR4bzF4ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/f3iwJFOVOwuy7K6FFw/giphy.gif"
        alt="Loading..."
        className="mx-auto w-40"
      />
      <p className="mt-4 text-gray-600">Please hold on while your plan is being generated.</p>
    </div>
  );
};

export default GenerateSchedule;
