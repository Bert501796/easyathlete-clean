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
import HeartRateEfficiencyChart from './components/HeartRateEfficiencyChart';

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
  const [kpis, setKpis] = useState(null);
  const userId = localStorage.getItem('easyathlete_user_id');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const rawData = await fetchLatestInsightsJson(userId);
        const normalized = rawData.map((a) => ({
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

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchKpis = async () => {
      if (!userId) return;

      try {
        const days = timeframes.find(t => t.label === selectedTimeframe)?.days;
        const type = selectedType === 'All' ? '' : selectedType;
        const url = `https://easyathlete-backend-production.up.railway.app/insights/kpis/${userId}?${days ? `days=${days}` : ''}&${type ? `type=${type}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setKpis(data);
      } catch (err) {
        console.error('❌ Failed to fetch KPIs', err);
      }
    };

    fetchKpis();
  }, [userId, selectedType, selectedTimeframe]);

  const now = new Date();
  const timeframeDays = timeframes.find(t => t.label === selectedTimeframe)?.days;

  const filtered = activities.filter((a) => {
    const matchType = selectedType === 'All' || a.type === selectedType;
    const matchTime = !timeframeDays || (new Date(a.startDate) >= new Date(now - timeframeDays * 86400000));
    return matchType && matchTime;
  });

  const chartData = filtered
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map((a) => ({
      ...a,
      name: a.startDate?.slice(0, 10)
    }))
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

  const renderKpiCard = (label, value, unit = '') => (
    <div className="bg-white shadow rounded-lg p-4 text-center">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-xl font-semibold">{value}{unit}</p>
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

      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {renderKpiCard('Total Activities', kpis.totalActivities)}
          {renderKpiCard('Total Distance', kpis.totalDistanceKm, ' km')}
          {renderKpiCard('Total Time', kpis.totalTimeMin, ' min')}
          {renderKpiCard('Avg Pace', kpis.averagePace, ' min/km')}
          {renderKpiCard('Avg HR', kpis.averageHR, ' bpm')}
          {renderKpiCard('Avg HR Efficiency', kpis.averageHRE)}
          {renderKpiCard('Total Load', kpis.totalLoad)}
        </div>
      )}

      {renderChart(
        'Pace (min/km) per Activity',
        'paceMinPerKm',
        '#8884d8',
        'Shows how fast you ran or cycled per kilometer. Lower values indicate faster paces.'
      )}

      {filtered.length > 0 && (
        <div className="mb-10">
          <HeartRateEfficiencyChart data={chartData} />
          <p className="text-sm text-gray-600 mt-2">
            Represents how much speed you achieve per heartbeat. Higher values suggest better cardiovascular efficiency.
          </p>
        </div>
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

      {renderStackedHRZoneChart()}
    </div>
  );
};

export default Insights;
