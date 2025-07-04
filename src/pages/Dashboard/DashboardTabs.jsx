import React, { useEffect, useState } from 'react';
import TrainingSchedule from '../TrainingSchedule/TrainingSchedule';
import Insights from '../Insights/Insights'; 
import Goals from '../Goals/Goals';
import Admin from '../Admin/Admin';
import Progress from '../Progress/progress';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('Admin');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stravaLinked') === '1') {
      setActiveTab('admin');
    }
  }, []);

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
        <button
          className={`ml-6 px-4 py-2 font-semibold ${activeTab === 'goals' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('goals')}
        >
          🎯 Goals
        </button>
        <button
          className={`ml-6 px-4 py-2 font-semibold ${activeTab === 'admin' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('admin')}
        >
          🔒 Admin
        </button>
        <button
          className={`ml-6 px-4 py-2 font-semibold ${activeTab === 'Progress' ? 'border-b-2 border-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('Progress')}
        >
          ♨️ Progress
        </button>
      </div>

      <div>
        {activeTab === 'schedule' && <TrainingSchedule />}
        {activeTab === 'insights' && <Insights />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'admin' && <Admin />}
        {activeTab === 'Progress' && <Progress />}

      </div>
    </div>
  );
};

export default DashboardTabs;

