import React, { useState } from "react";
import FileUpload from "./FileUpload";
import QuestionForm from "./QuestionForm";
import ChartSelector from "./ChartSelector";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function HomePage() {
  const [uploadKey, setUploadKey] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [charts, setCharts] = useState([]);
  const [tables, setTables] = useState([]);
  const [facts, setFacts] = useState([]);

  const handleUploadComplete = (payload) => {
    console.log("✅ Upload response (in App):", payload);

    const message = payload?.message ?? "Upload completed";
    const summaryText = (payload?.summary ?? "").trim();
    const factsArray = payload?.facts ? JSON.parse(payload.facts) : [];

    console.log("📩 Message:", message);
    console.log("📄 Summary (raw):", payload?.summary);
    console.log("📄 Summary (trimmed):", summaryText);

    setUploadMessage(message);
    setSummary(summaryText);
    setCharts(
      Array.isArray(payload?.chartRecommendations)
        ? payload.chartRecommendations
        : []
    );
    setTables(Array.isArray(payload?.tables) ? payload.tables : []);
    setFacts(factsArray);
    setUploadKey((prev) => prev + 1);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 FinsightAI</h1>

      <FileUpload onUploadComplete={handleUploadComplete} />

      <div style={{ marginTop: 10 }}>
        {uploadMessage && <p style={{ color: "green" }}>✅ {uploadMessage}</p>}
        {summary && (
          <div>
            <h3>📋 Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>

      <QuestionForm key={uploadKey} />

      {facts.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>📊 Key Insights</h3>
          <BarChart width={500} height={300} data={facts}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
            />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      )}

      {charts.length > 0 && tables.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>📈 Recommended Charts</h3>
          <ChartSelector chartRecommendations={charts} tables={tables} />
        </div>
      )}
    </div>
  );
}

export default HomePage;
