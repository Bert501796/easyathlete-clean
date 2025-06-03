import React, { useEffect, useState } from 'react';

const TrainingSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!userId) {
        console.warn('⚠️ No userId in localStorage');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://easyathlete-backend-production.up.railway.app/schedule/latest/${userId}`);
        if (!res.ok) throw new Error('Schedule not found or server error');

        const data = await res.json();
        setSchedule(data.schedule);
        localStorage.setItem('training_schedule', JSON.stringify(data.schedule));
      } catch (err) {
        console.error('❌ Failed to load schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading training schedule...</div>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700">No schedule found</h2>
        <p className="text-gray-500 mt-2">Please generate your training plan first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🏋️ Your Training Schedule</h1>
      {schedule.map((workout, idx) => (
        <div key={idx} className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{workout.day}</h2>
          <p className="text-sm text-gray-500 mb-2">Type: {workout.type}</p>
          <div className="whitespace-pre-line text-gray-800">{workout.aiOutput}</div>
        </div>
      ))}
    </div>
  );
};

export default TrainingSchedule;
