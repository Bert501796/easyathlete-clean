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
  LineChart,
  Line
} from 'recharts';
import FitnessTrendEChart from './components/FitnessTrendEChart';


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

        const normalized = data.map((a) => ({
          ...a,
          type: a.type === 'VirtualRide' ? 'Ride' : a.type
        }));

        setActivities(normalized);
        const types = Array.from(new Set(normalized.map((a) => a.type))).sort();
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

  const chartData = [...filtered]
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .map((a) => {
      const zoneSeconds = a.hrZoneBuckets || [];
      const totalZoneTime = zoneSeconds.reduce((sum, val) => sum + val, 0) || 1;
      return {
        name: a.start_date?.slice(0, 10),
        paceMinPerKm: a.average_speed ? +(1000 / (a.average_speed * 60)).toFixed(2) : null,
        hrEfficiency: a.average_heartrate && a.average_speed
          ? +(a.average_speed / a.average_heartrate).toFixed(3)
          : null,
        elevationPerKm: a.total_elevation_gain && a.distance
          ? +(a.total_elevation_gain / (a.distance / 1000)).toFixed(1)
          : null,
        estimatedLoad: a.kilojoules || a.suffer_score || null,
        fitness: a.fitness_score || null,
        week: a.start_date?.slice(0, 10).slice(0, 7),
        zone1: zoneSeconds[0] > 0 ? +(zoneSeconds[0] / totalZoneTime * 100).toFixed(1) : undefined,
        zone2: zoneSeconds[1] > 0 ? +(zoneSeconds[1] / totalZoneTime * 100).toFixed(1) : undefined,
        zone3: zoneSeconds[2] > 0 ? +(zoneSeconds[2] / totalZoneTime * 100).toFixed(1) : undefined,
        zone4: zoneSeconds[3] > 0 ? +(zoneSeconds[3] / totalZoneTime * 100).toFixed(1) : undefined,
        zone5: zoneSeconds[4] > 0 ? +(zoneSeconds[4] / totalZoneTime * 100).toFixed(1) : undefined
      };
    })
    .filter(d => d.paceMinPerKm !== null);

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
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

    const renderLineChart = (title, dataKey, color, explanation) => (
        <div className="mb-10">
            <h2 className="text-lg font-semibold mb-1">{title}</h2>
            <p className="text-sm text-gray-600 mb-2">{explanation}</p>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

  const renderStackedHRZoneChart = () => (
    <div className="mb-10">
      <h2 className="text-lg font-semibold mb-1">Heart Rate Zone Breakdown</h2>
      <p className="text-sm text-gray-600 mb-2">
        Percentage of time spent in each HR zone during workouts. Helps evaluate training intensity and distribution.
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Bar dataKey="zone5" stackId="a" fill="#313695" name="Zone 5" />
          <Bar dataKey="zone4" stackId="a" fill="#4575b4" name="Zone 4" />
          <Bar dataKey="zone3" stackId="a" fill="#74add1" name="Zone 3" />
          <Bar dataKey="zone2" stackId="a" fill="#abd9e9" name="Zone 2" />
          <Bar dataKey="zone1" stackId="a" fill="#e0f3f8" name="Zone 1" />
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
      
      {filtered.length > 0 && (
  <div className="mb-10">
    <h2 className="text-lg font-semibold mb-1">Fitness Trend Over Time</h2>
    <FitnessTrendEChart data={chartData} />
    <p className="text-sm text-gray-600 mt-2">
      Tracks overall fitness score to visualize long-term improvement or decline.
    </p>
  </div>
)}

      {renderStackedHRZoneChart()}
    </div>
  );
};

export default Insights;
