import React from 'react';

const StravaOverview = ({ activities }) => {
  if (!activities || activities.length === 0) return null;

  const sportCounts = activities.reduce((acc, act) => {
    const type = act.sport_type || act.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">📊 Your Activities Overview (Last Year)</h3>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(sportCounts).map(([type, count]) => (
          <li key={type} className="border rounded p-3 bg-white shadow-sm">
            <strong>{type}</strong>: {count} sessions
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StravaOverview;
