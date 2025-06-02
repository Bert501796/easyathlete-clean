// src/pages/Insights/Insights.jsx
import React, { useEffect, useState } from 'react';
import { fetchLatestInsightsJson } from '../../utils/fetchInsightsData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line
} from 'recharts';

const timeframes = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', days: 90 },
  { label: 'Last 6 months', days: 180 },
  { label: 'Last year', days: 365 },
  { label: 'All', days: null }
];

const Insights = () => {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All');
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const fetchActivities = async () => {
      if (!userId) return;

      try {
        const data = await fetchLatestInsightsJson(userId);
        setActivities(data);

        const types = Array.from(new Set(data.map((a) => a.type))).sort();
        setActivityTypes(['All', ...types]);
      } catch (err) {
        console.error('❌ Failed to fetch activity insights', err);
      }
    };

    fetchActivities();
  }, [userId]);

  const now = new Date();
  const timeframeDays = timeframes.find(t => t.label === selectedTimeframe)?.days;

  const filtered = activities.filter((a) => {
    const matchType = selectedType === 'All' || a.type === selectedType;
    const matchTime = !timeframeDays || (new Date(a.start_date) >= new Date(now - timeframeDays * 86400000));
    return matchType && matchTime;
  });

  const chartData = filtered.map((a) => ({
    name: a.start_date?.slice(0, 10),
    paceMinPerKm: a.average_speed ? +(1000 / (a.average_speed * 60)).toFixed(2) : null,
    hrEfficiency: a.average_heartrate && a.average_speed
      ? +(a.average_speed / a.average_heartrate).toFixed(3)
      : null,
    elevationPerKm: a.total_elevation_gain && a.distance
      ? +(a.total_elevation_gain / (a.distance / 1000)).toFixed(1)
      : null,
    estimatedLoad: a.kilojoules || a.suffer_score || null
  })).filter(d => d.paceMinPerKm !== null);

  const renderChart = (title, dataKey, color, explanation) => (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">{explanation}</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} name={title} />
          <Line type="monotone" dataKey={dataKey} stroke="#000" dot={false} name="Trend" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📈 Performance Insights</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div>
          <label className="mr-2 font-medium">Activity type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border rounded"
          >
            {activityTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Timeframe:</label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="p-2 border rounded"
          >
            {timeframes.map(({ label }) => (
              <option key={label}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {renderChart(
        'Pace (min/km) per Activity',
        'paceMinPerKm',
        '#8884d8',
        'Shows how fast you ran or cycled per kilometer. Lower values indicate faster paces.'
      )}

      {renderChart(
        'Heart Rate Efficiency',
        'hrEfficiency',
        '#82ca9d',
        'Represents how much speed you achieve per heartbeat. Higher values suggest better cardiovascular efficiency.'
      )}

      {renderChart(
        'Elevation per km',
        'elevationPerKm',
        '#ffc658',
        'Indicates the climbing effort per kilometer. Helps assess hilliness of your routes.'
      )}

      {renderChart(
        'Estimated Load',
        'estimatedLoad',
        '#d84e4e',
        'Estimates workout intensity based on power or heart rate data.'
      )}
    </div>
  );
};

export default Insights;
