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
  ResponsiveContainer
} from 'recharts';

const Insights = () => {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
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

  const filtered = selectedType === 'All'
    ? activities
    : activities.filter((a) => a.type === selectedType);

  const chartData = filtered.map((a) => ({
    name: a.name || a.start_date?.slice(0, 10),
    paceMinPerKm: a.average_speed ? +(1000 / (a.average_speed * 60)).toFixed(2) : null,
    hrEfficiency: a.average_heartrate && a.average_speed
      ? +(a.average_speed / a.average_heartrate).toFixed(3)
      : null,
    elevationPerKm: a.total_elevation_gain && a.distance
      ? +(a.total_elevation_gain / (a.distance / 1000)).toFixed(1)
      : null,
    estimatedLoad: a.kilojoules || a.suffer_score || null
  })).filter(d => d.paceMinPerKm !== null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📈 Performance Insights</h1>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filter by activity type:</label>
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

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Pace (min/km) per Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="paceMinPerKm" fill="#8884d8" name="Pace (min/km)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Heart Rate Efficiency</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hrEfficiency" fill="#82ca9d" name="HR Efficiency" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Elevation per km</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="elevationPerKm" fill="#ffc658" name="Elevation/km" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Estimated Load</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="estimatedLoad" fill="#d84e4e" name="Load" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Insights;
