// src/components/ChartSelector.js
import React from "react";
import {
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function ChartSelector({ chartRecommendations, tables }) {
  if (!Array.isArray(chartRecommendations)) return null;

  const safeRows = (data) => {
    if (!data || typeof data !== "object") return [];

    const columns = Object.keys(data);
    if (columns.length === 0) return [];

    const rowCount = Math.max(...columns.map((col) => data[col]?.length || 0));

    return Array.from({ length: rowCount }).map((_, i) => {
      const row = {};
      for (const col of columns) {
        const val = data[col]?.[i];
        row[col] =
          typeof val === "number" && !isNaN(val)
            ? val
            : typeof val === "string"
            ? val.trim()
            : null;
      }
      return row;
    });
  };

  return (
    <div>
      {chartRecommendations.map((rec, idx) => {
        const data = tables[rec.table_index];
        const rows = safeRows(data);
        const filteredRows = rows.filter((row) =>
          Object.values(row).some((v) => v !== null && v !== "")
        );

        if (filteredRows.length === 0) {
          return <p key={idx}>⚠️ Not enough data to render chart #{idx + 1}</p>;
        }

        if (rec.type === "scatter") {
          return (
            <div key={idx} style={{ marginBottom: 30 }}>
              <h4>
                Scatter Plot: {rec.x} vs {rec.y}
              </h4>
              <ScatterChart width={400} height={300}>
                <CartesianGrid />
                <XAxis dataKey={rec.x} name={rec.x} />
                <YAxis dataKey={rec.y} name={rec.y} />
                <Tooltip />
                <Scatter data={filteredRows} fill="#8884d8" />
              </ScatterChart>
            </div>
          );
        }

        if (rec.type === "histogram") {
          return (
            <div key={idx} style={{ marginBottom: 30 }}>
              <h4>Histogram: {rec.value}</h4>
              <BarChart width={400} height={300} data={filteredRows}>
                <CartesianGrid />
                <XAxis dataKey={rec.value} />
                <YAxis />
                <Tooltip />
                <Bar dataKey={rec.value} fill="#82ca9d" />
              </BarChart>
            </div>
          );
        }

        return <p key={idx}>⚠️ Chart type "{rec.type}" not supported yet.</p>;
      })}
    </div>
  );
}

export default ChartSelector;
