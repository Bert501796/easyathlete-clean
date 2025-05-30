import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sportIcons = {
  Running: '🏃‍♂️',
  Cycling: '🚴‍♀️',
  Swimming: '🏊‍♂️',
  Walking: '🚶‍♂️',
  Strength: '🏋️‍♂️',
  'Strength Training': '🏋️‍♂️',
};

export default function TrainingSchedule({ onboarding }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const navigate = useNavigate();

  const fetchSchedule = async () => {
    if (!onboarding?.userId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://easyathlete-backend-production.up.railway.app/ai-prompt/${onboarding.userId}`);
      if (!res.ok) throw new Error('Failed to fetch training schedule');
      const data = await res.json();
      setSchedule(data.schedule);
      setShowSchedule(true);
    } catch (err) {
      console.error('❌ Schedule generation failed:', err);
      setError('Failed to generate training schedule.');
    } finally {
      setLoading(false);
    }
  };

  const groupedByWeek = schedule.reduce((acc, session) => {
    acc[session.week] = acc[session.week] || [];
    acc[session.week].push(session);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Your AI-Powered 4-Week Training Plan</h2>

      {!showSchedule && (
        <button
          onClick={fetchSchedule}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔮 Generate Your Training Schedule
        </button>
      )}

      {loading && <p className="mt-4">⏳ Generating your schedule...</p>}
      {error && <p className="text-red-500 mt-4">❌ {error}</p>}

      {showSchedule && Object.keys(groupedByWeek).map(week => (
        <div key={week} className="mb-8 mt-6">
          <h3 className="text-xl font-semibold mb-4">Week {week}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedByWeek[week].map((session, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow">
                <h4 className="text-md font-bold">Day {session.day}</h4>
                <p className="text-sm mb-1">
                  {sportIcons[session.sport] || '🏋️‍♂️'} {session.sport}
                </p>
                {session.sport !== 'Rest Day' && (
                  <>
                    <p><strong>Duration:</strong> {session.durationMinutes} min</p>
                    <p><strong>Intensity:</strong> {session.intensityZone}</p>
                    <p className="text-sm mt-2 text-gray-600">{session.notes}</p>
                  </>
                )}
                {session.sport === 'Rest Day' && (
                  <p className="italic text-gray-500">Rest and recovery</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!showSchedule && (
        <div className="mt-8">
          <button
            onClick={() => navigate('/connect')}
            className="text-blue-600 underline"
          >
            🔁 Back to Connect Page
          </button>
        </div>
      )}
    </div>
  );
}
