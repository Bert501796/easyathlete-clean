// src/pages/Progress/progress.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle } from "lucide-react";

const activityOptions = ["Run", "Ride", "Swim"];

const formatMetricName = (name) =>
  name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const Progress = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityType, setActivityType] = useState("Run");
  const [timeRange, setTimeRange] = useState("6months");
  const userId = localStorage.getItem("easyathlete_mongo_id");

  const fetchTrends = async (type) => {
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/ml/progress",
        {
          userId,
          activityType: type,
        }
      );
      setTrends(res.data?.trends || []);
    } catch (err) {
      setError("Failed to fetch progress trends.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTrends(activityType);
    }
  }, [userId, activityType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  const grouped = trends.reduce((acc, entry) => {
    if (!acc[entry.segment_type]) acc[entry.segment_type] = [];
    acc[entry.segment_type].push(entry);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Performance Dashboard</h1>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div>
          <label className="mr-2 font-medium">Activity type:</label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="p-2 border rounded"
          >
            {activityOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No trend data found for this activity type.
        </div>
      ) : (
        Object.entries(grouped).map(([segmentType, entries]) => (
          <div key={segmentType} className="mb-10">
            <h2 className="text-xl font-semibold mb-2 capitalize">🔁 {segmentType} Segments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(new Set(entries.map((e) => e.metric))).map((metric) => {
                const metricSeries = entries.filter((e) => e.metric === metric);
                return (
                  <div
                    key={metric}
                    className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
                  >
                    <h3 className="text-md font-semibold mb-2">
                      {formatMetricName(metric)}
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {metricSeries.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-medium mr-1">{item.week}:</span>
                          {item.value?.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Progress;
