// src/pages/Dashboard/DashboardTabs.jsx
import React, { useState } from 'react';
import TrainingSchedule from '../TrainingSchedule/TrainingSchedule';
import Insights from '../Insights/Insights'; // Make sure this component exists

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'schedule' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('schedule')}
        >
          🏋️ My Training Schedule
        </button>
        <button
          className={`ml-6 px-4 py-2 font-semibold ${activeTab === 'insights' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('insights')}
        >
          📊 Insights
        </button>
      </div>

      <div>
        {activeTab === 'schedule' && <TrainingSchedule />}
        {activeTab === 'insights' && <Insights />}
      </div>
    </div>
  );
};

export default DashboardTabs;
