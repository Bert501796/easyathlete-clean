// src/pages/Insights/Insights.jsx
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  {
    name: 'Run 1',
    paceMinPerKm: 5.2,
    hrEfficiency: 0.06,
    elevationPerKm: 20,
    estimatedLoad: 120,
  },
  {
    name: 'Run 2',
    paceMinPerKm: 5.0,
    hrEfficiency: 0.055,
    elevationPerKm: 15,
    estimatedLoad: 135,
  },
  {
    name: 'Run 3',
    paceMinPerKm: 4.8,
    hrEfficiency: 0.051,
    elevationPerKm: 25,
    estimatedLoad: 150,
  },
];

const Insights = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Later: fetch from Cloudinary or backend
    setData(dummyData);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📈 Performance Insights</h1>

      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-2">Pace (min/km) per Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
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
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
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
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
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
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
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
