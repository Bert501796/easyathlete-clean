import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrainingSchedule = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');
  const [expandedIndex, setExpandedIndex] = useState(null);
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

  const HeartZones = () => {
    const zones = [
      { name: 'Zone 1 (Recovery)', range: '100–120 bpm' },
      { name: 'Zone 2 (Endurance)', range: '121–140 bpm' },
      { name: 'Zone 3 (Tempo)', range: '141–155 bpm' },
      { name: 'Zone 4 (Threshold)', range: '156–170 bpm' },
      { name: 'Zone 5 (VO2 Max)', range: '171–185 bpm' }
    ];

    return (
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">🫀 Estimated Heart Rate Zones</h3>
        <ul className="space-y-2">
          {zones.map((zone, i) => (
            <li key={i} className="p-4 border rounded bg-white shadow">
              <strong>{zone.name}</strong>: {zone.range}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-600">VO2 Max estimate will be added soon.</p>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 EasyAthlete Dashboard</h2>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'schedule' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('schedule')}
        >
          My Training Schedule
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'zones' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('zones')}
        >
          My Heart Zones
        </button>
      </div>

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

      {!loading && activeTab === 'schedule' && schedule.length > 0 && Object.keys(groupedByWeek).map((week) => (
        <div key={week} className="mb-8 mt-6">
          <h3 className="text-xl font-semibold mb-4">Week {week}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedByWeek[week].map((session, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-bold">Day {session.day}</h4>
                  <button
                    className="text-blue-600 text-sm underline"
                    onClick={() => setExpandedIndex(expandedIndex === `${week}-${i}` ? null : `${week}-${i}`)}
                  >
                    {expandedIndex === `${week}-${i}` ? 'Hide details' : 'Show details'}
                  </button>
                </div>
                <p className="text-sm mb-1">
                  {sportIcons[session.sport] || '🏋️‍♂️'} {session.sport}
                </p>
                {session.sport !== 'Rest Day' ? (
                  <>
                    <p><strong>Duration:</strong> {session.durationMinutes} min</p>
                    <p><strong>Intensity:</strong> {session.intensityZone}</p>
                    {expandedIndex === `${week}-${i}` && (
                      <div className="mt-2 text-gray-600 text-sm">
                        <p><strong>Focus:</strong> {session.focus || 'General Endurance'}</p>
                        <p><strong>Details:</strong> {session.notes}</p>
                        {/* Optional: Visual component can go here */}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="italic text-gray-500">Rest and recovery</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!loading && activeTab === 'zones' && <HeartZones />}
    </div>
  );
};

export default TrainingSchedule;
