import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function GroupedInsightCharts({ facts }) {
  if (!Array.isArray(facts) || facts.length === 0) return null;

  // Filter groups with at least 2 data points
  const validGroups = facts.filter(
    (group) => Array.isArray(group.data) && group.data.length > 1
  );

  return (
    <div>
      <h3>📊 Key Insights</h3>
      {validGroups.map((group, idx) => {
        const { title, data } = group;
        const chartKey = `chart-${idx}`;
        const isPie = data.length <= 3;

        return (
          <div key={chartKey} style={{ marginBottom: 40 }}>
            <h4>{title}</h4>

            <ResponsiveContainer width="100%" height={300}>
              {isPie ? (
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {data.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10 }}
                    angle={-30}
                    interval={0}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

export default GroupedInsightCharts;
