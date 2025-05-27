import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';

const sportIcons = {
  Running: '🏃‍♂️',
  Cycling: '🚴‍♀️',
  Swimming: '🏊‍♂️',
  Walking: '🚶‍♂️',
  'Power Lifting': '🏋️‍♂️',
};

export default function TrainingSchedule({ onboarding, activities }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📥 Received onboarding:', onboarding);
    console.log('📥 Received activities:', activities);

    const fetchSchedule = async () => {
      if (!onboarding || !activities) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/generate_schedule_api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboarding, activities })
        });

        if (!res.ok) {
          throw new Error('Failed to fetch training schedule');
        }

        const data = await res.json();
        setSchedule(data.schedule);
      } catch (err) {
        console.error('❌ Schedule generation failed:', err);
        setError('Failed to generate training schedule.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [onboarding, activities]);

  if (!onboarding || !onboarding.sports || onboarding.sports.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-semibold">⚠️ Missing onboarding data. Please restart the onboarding process.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Your AI-Powered Training Plan</h2>

      {loading && <p>⏳ Generating your schedule...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {schedule.map((session, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-semibold text-lg">{session.date}</h3>
            <p className="text-sm">{sportIcons[session.sport] || '🏋️‍♂️'} {session.sport}</p>
            <p className="italic text-gray-600">{session.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
