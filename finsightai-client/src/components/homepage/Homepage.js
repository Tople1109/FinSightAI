import React, { useState } from "react";
import FileUpload from "./FileUpload";
import QuestionForm from "./QuestionForm";
import ChartSelector from "./ChartSelector";
import GroupedInsightCharts from "./GroupedInsightCharts";

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
    const factsArray = Array.isArray(payload?.facts) ? payload.facts : [];

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
      {facts.length > 0 && <GroupedInsightCharts facts={facts} />}
      <QuestionForm key={uploadKey} />
    </div>
  );
}

export default HomePage;
