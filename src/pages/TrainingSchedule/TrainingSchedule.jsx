// src/pages/TrainingSchedule.jsx
import React, { useEffect, useState } from 'react';

const TrainingSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const userId = localStorage.getItem('easyathlete_user_id'); // get the user ID

 useEffect(() => {
    const loadSchedule = async () => {
      // Step 1: Try localStorage
      const stored = localStorage.getItem('training_schedule');
      if (stored) {
        try {
          setSchedule(JSON.parse(stored));
          return;
        } catch (e) {
          console.error('❌ Failed to parse training schedule:', e);
        }
      }

      // Step 2: Fetch latest file from Cloudinary
      if (userId) {
        try {
          const expression = `folder="easyathlete/${userId}/schedule" AND resource_type="raw"`;
          const cloudinarySearchUrl = `https://res.cloudinary.com/dcptv15au/raw/upload`;
          const apiUrl = `https://api.cloudinary.com/v1_1/dcptv15au/resources/search`;

          const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${btoa(
                `${import.meta.env.VITE_CLOUDINARY_API_KEY}:${import.meta.env.VITE_CLOUDINARY_API_SECRET}`
              )}`
            },
            body: JSON.stringify({
              expression,
              sort_by: [{ public_id: 'desc' }],
              max_results: 1
            })
          });

          const data = await res.json();
          const latest = data.resources?.[0];

          if (latest?.secure_url) {
            const fileRes = await fetch(latest.secure_url);
            if (!fileRes.ok) throw new Error(`Failed to fetch latest training schedule file`);

            const json = await fileRes.json();
            setSchedule(json);
            localStorage.setItem('training_schedule', JSON.stringify(json));
          } else {
            console.warn('⚠️ No training schedule file found in Cloudinary.');
          }
        } catch (err) {
          console.error('❌ Failed to fetch training schedule from Cloudinary:', err);
        }
      }
    };

    loadSchedule();
  }, [userId]);

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