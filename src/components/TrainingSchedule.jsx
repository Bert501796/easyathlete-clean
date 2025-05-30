import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrainingSchedule = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!userId) {
        setError('❌ No user ID found. Please complete onboarding.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://easyathlete-backend-production.up.railway.app/ai-prompt/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch training schedule');
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
  }, [userId]);

  const sportIcons = {
    Running: '🏃‍♂️',
    Cycling: '🚴‍♀️',
    Swimming: '🏊‍♂️',
    Walking: '🚶‍♂️',
    Strength: '🏋️‍♂️',
    'Strength Training': '🏋️‍♂️'
  };

  const groupedByWeek = schedule.reduce((acc, session) => {
    acc[session.week] = acc[session.week] || [];
    acc[session.week].push(session);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Your AI-Powered 4-Week Training Plan</h2>

      {loading && (
        <div className="text-center">
          <p className="text-lg">🔮 Generating your training plan...</p>
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGN0a2R2ZXg1OWM4YTh5MzBmcnBneDBpcnpoNGFwMnRzeHR4bzF4ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/f3iwJFOVOwuy7K6FFw/giphy.gif"
            alt="Loading"
            className="mx-auto mt-4 w-40"
          />
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!loading && schedule.length > 0 && Object.keys(groupedByWeek).map((week) => (
        <div key={week} className="mb-8 mt-6">
          <h3 className="text-xl font-semibold mb-4">Week {week}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedByWeek[week].map((session, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow">
                <h4 className="text-md font-bold">Day {session.day}</h4>
                <p className="text-sm mb-1">
                  {sportIcons[session.sport] || '🏋️‍♂️'} {session.sport}
                </p>
                {session.sport !== 'Rest Day' ? (
                  <>
                    <p><strong>Duration:</strong> {session.durationMinutes} min</p>
                    <p><strong>Intensity:</strong> {session.intensityZone}</p>
                    <p className="text-sm mt-2 text-gray-600">{session.notes}</p>
                  </>
                ) : (
                  <p className="italic text-gray-500">Rest and recovery</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainingSchedule;
