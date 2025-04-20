// src/App.js
import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import QuestionForm from "./components/QuestionForm";
import ChartSelector from "./components/ChartSelector";

function App() {
  const [uploadKey, setUploadKey] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [charts, setCharts] = useState([]);
  const [tables, setTables] = useState([]);

  const handleUploadComplete = (payload) => {
    console.log("✅ Upload response (in App):", payload);
    console.log("📄 Summary (raw):", payload?.summary);
    console.log("📄 Summary (trimmed):", (payload?.summary ?? "").trim());

    const summaryText = (payload?.summary ?? "").trim();
    setSummary(summaryText);
    setUploadMessage(payload?.message ?? "Upload completed");
    setCharts(
      Array.isArray(payload?.chartRecommendations)
        ? payload.chartRecommendations
        : []
    );
    setTables(Array.isArray(payload?.tables) ? payload.tables : []);
    setUploadKey((prev) => prev + 1);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 FinsightAI</h1>

      <FileUpload onUploadComplete={handleUploadComplete} />

      <div style={{ marginTop: 10 }}>
        {uploadMessage && <p style={{ color: "green" }}>✅ {uploadMessage}</p>}
        {summary.trim() && (
          <div>
            <h3>📋 Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>

      <QuestionForm key={uploadKey} />

      {charts.length > 0 && tables.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>📈 Recommended Charts</h3>
          <ChartSelector chartRecommendations={charts} tables={tables} />
        </div>
      )}
    </div>
  );
}

export default App;
