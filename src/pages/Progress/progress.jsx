import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle } from "lucide-react";

const activityOptions = ["Run", "Ride", "Swim"];

const Progress = ({ user }) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityType, setActivityType] = useState("Run");

  const fetchTrends = async (type) => {
    setLoading(true);
    try {
      const res = await axios.post("/ml/progress", {
        userId: user?.customUserId,
        activityType: type,
      });
      setTrends(res.data || []);
    } catch (err) {
      setError("Failed to fetch progress trends.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.customUserId) {
      fetchTrends(activityType);
    }
  }, [user, activityType]);

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
    <div className="p-4">
      {/* Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select activity type:
        </label>
        <select
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          className="w-full md:w-64 border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {activityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {trends.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No trend data found for this activity type.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
