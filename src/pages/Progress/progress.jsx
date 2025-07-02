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
const timeRangeOptions = ["3months", "6months"];

const formatMetricName = (name) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getDateRange = (range) => {
  const end = new Date();
  const start = new Date();
  if (range === "3months") start.setMonth(end.getMonth() - 3);
  else if (range === "6months") start.setMonth(end.getMonth() - 6);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

const Progress = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityType, setActivityType] = useState("Run");
  const [timeRange, setTimeRange] = useState("6months");
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
      const { startDate, endDate } = getDateRange(timeRange);
      fetchTrends(activityType, startDate, endDate);
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

  const groupByMetric = (entries) => {
    const metrics = {};
    const sessionMap = {}; // week -> sessions[]
    entries.forEach(({ metric, week, value, sessions }) => {
      if (!metrics[metric]) metrics[metric] = [];
      metrics[metric].push({ week, value });
      if (sessions && sessions.length) {
        sessionMap[week] = sessions;
      }
    });
    return { metrics, sessionMap };
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

  const all = trends.filter((t) => t.segment_type === "all");
  const { metrics, sessionMap } = groupByMetric(all);

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

        <div>
          <label className="mr-2 font-medium">Time range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded"
          >
            {timeRangeOptions.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      {all.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No trend data found for this activity type.
        </div>
      ) : (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">📈 Training Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(metrics).map(([metric, series]) => (
              <div
                key={metric}
                className="bg-white rounded-2xl shadow-md p-4 border border-gray-100"
              >
                <h3 className="text-md font-semibold mb-2">
                  {formatMetricName(metric)}
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload || !payload.length) return null;
                        const sessionData = sessionMap[label] || [];
                        return (
                          <div className="bg-white p-2 border rounded shadow text-sm max-w-xs">
                            <p className="font-semibold mb-1">Week: {label}</p>
                            <p>Value: {payload[0].value?.toFixed(2)}</p>
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
                      stroke="#8884d8"
                      dot={false}
                      name={formatMetricName(metric)}
                    />
                    {series.map((point, idx) =>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
