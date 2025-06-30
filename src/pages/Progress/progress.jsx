// src/pages/Progress/progress.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle } from "lucide-react";

const activityOptions = ["Run", "Ride", "Swim"];
const timeRangeOptions = [
  { label: "Last 6 months", value: "6months" },
  { label: "Last year", value: "1year" },
];

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
      const endDate = new Date().toISOString().split("T")[0];
      let startDate = null;

      if (timeRange === "6months") {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        startDate = d.toISOString().split("T")[0];
      } else if (timeRange === "1year") {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        startDate = d.toISOString().split("T")[0];
      }

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/ml/progress",
        {
          userId,
          activityType: type,
          startDate,
          endDate,
        }
      );

      console.log("📦 Fetched trend data:", res.data);
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
  }, [userId, activityType, timeRange]);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Performance Progress</h1>

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
        <div>
          <label className="mr-2 font-medium">Time range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded"
          >
            {timeRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {trends.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No trend data found for this activity type.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((trend, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
            >
              <h3 className="text-lg font-semibold capitalize">
                {trend.segment_type} – {trend.metric}
              </h3>
              <p className="text-sm mt-1 text-gray-500">
                Trend:{" "}
                <span
                  className={
                    trend.trend_direction === "improving"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {trend.trend_direction}
                </span>
              </p>
              <p className="text-sm text-gray-500">Slope: {trend.slope}</p>
              <p className="text-sm text-gray-500">R²: {trend.r_squared}</p>
              <p className="text-sm text-gray-500">p-value: {trend.p_value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Progress;
