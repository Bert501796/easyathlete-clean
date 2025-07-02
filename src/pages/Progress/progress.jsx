import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const activityOptions = ["Run", "Ride", "Swim"];
const timeRangeOptions = [
  { label: "Last week", value: "1week" },
  { label: "Last 4 weeks", value: "4weeks" },
  { label: "Last 3 months", value: "3months" },
  { label: "Last 6 months", value: "6months" },
  { label: "Last year", value: "1year" },
  { label: "Custom", value: "custom" },
];

const getDateRange = (range) => {
  const end = new Date();
  const start = new Date();
  switch (range) {
    case "1week":
      start.setDate(end.getDate() - 7);
      break;
    case "4weeks":
      start.setDate(end.getDate() - 28);
      break;
    case "3months":
      start.setMonth(end.getMonth() - 3);
      break;
    case "6months":
      start.setMonth(end.getMonth() - 6);
      break;
    case "1year":
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      return null;
  }
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

const getSymbol = (activityType) => {
  switch (activityType) {
    case "Run":
      return "circle";
    case "Ride":
      return "triangle";
    case "Swim":
      return "square";
    default:
      return "diamond";
  }
};

const Progress = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityType, setActivityType] = useState("Run");
  const [timeRange, setTimeRange] = useState("6months");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const userId = localStorage.getItem("easyathlete_mongo_id");

  const fetchTrends = async (type, startDate, endDate) => {
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/ml/progress",
        {
          userId,
          activityType: type,
          startDate,
          endDate,
        }
      );
      setTrends(res.data?.data || []);
    } catch (err) {
      setError("Failed to fetch progress trends.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const range = getDateRange(timeRange);
      if (timeRange === "custom") {
        if (customStart && customEnd) {
          fetchTrends(activityType, customStart, customEnd);
        }
      } else if (range) {
        fetchTrends(activityType, range.startDate, range.endDate);
      }
    }
  }, [userId, activityType, timeRange, customStart, customEnd]);

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

  const fitnessSeries = trends.filter(t => t.segment_type === "all" && t.metric === "fitness_index");
  const sessionMap = {};
  fitnessSeries.forEach(({ week, sessions }) => {
    if (sessions && sessions.length) {
      sessionMap[week] = sessions;
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Training Progress</h1>

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
            {timeRangeOptions.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {timeRange === "custom" && (
          <>
            <div>
              <label className="mr-2 font-medium">From:</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div>
              <label className="mr-2 font-medium">To:</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
          </>
        )}
      </div>

      {fitnessSeries.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No trend data found for this activity type.
        </div>
      ) : (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">💪 Fitness Index Over Time</h2>
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fitnessSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 1]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const sessionData = sessionMap[label] || [];
                    return (
                      <div className="bg-white p-2 border rounded shadow text-sm max-w-xs">
                        <p className="font-semibold mb-1">Week: {label}</p>
                        <p>Fitness Index: {payload[0].value?.toFixed(2)}</p>
                        {sessionData.length > 0 && (
                          <>
                            <p className="font-semibold mt-2">Sessions:</p>
                            {sessionData.map((s, i) => (
                              <div key={i} className="text-gray-700">
                                • <strong>{s.activity_type}</strong> — {s.activity_name} ({s.date.split("T")[0]})
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  dot={false}
                  name="Fitness Index"
                />
                {fitnessSeries.map((point, idx) =>
                  (sessionMap[point.week] || []).map((s, j) => (
                    <Line
                      key={`${idx}-${j}`}
                      type="monotone"
                      data={[{ week: point.week, value: point.value }]}
                      dataKey="value"
                      stroke="transparent"
                      dot={{
                        stroke: "black",
                        fill:
                          s.activity_type === "Run"
                            ? "#34D399"
                            : s.activity_type === "Ride"
                            ? "#60A5FA"
                            : "#F87171",
                        r: 4,
                        shape: getSymbol(s.activity_type),
                      }}
                    />
                  ))
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
