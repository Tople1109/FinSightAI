import React, { useState } from "react";
import FileUpload from "./FileUpload";
import QuestionForm from "./QuestionForm";
import ChartSelector from "./ChartSelector";
import Header from "./Header";
import GroupedInsightCharts from "./GroupedInsightCharts";
import "./HomePage.css";

function HomePage() {
  const [uploadKey, setUploadKey] = useState(0);
  const [uploadMessage, setUploadMessage] = useState("");
  const [summary, setSummary] = useState("");
  const [charts, setCharts] = useState([]);
  const [tables, setTables] = useState([]);
  const [facts, setFacts] = useState([]);

  const handleUploadComplete = (payload) => {
    const message = payload?.message ?? "Upload completed";
    const summaryText = (payload?.summary ?? "").trim();
    const factsArray = Array.isArray(payload?.facts) ? payload.facts : [];

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
    <div className="homepage-wrapper">
      <Header />
      <h2>Welcome to FinSightAI</h2>
      <p>
        FinSightAI makes it effortless to extract insights from any PDF report.
        Upload your document and instantly ask natural‑language questions about
        its contents.
      </p>
      <section className="features-section">
        <h3 className="feature-heading">Key Features</h3>
        <ul>
          <li>
            📄 <strong>PDF Parsing:</strong> Automatically extract text, tables,
            and headings.
          </li>
          <li>
            🤖 <strong>AI Q&A:</strong> Ask anything in plain English.
          </li>
          <li>
            🔒 <strong>Secure:</strong> All processing is done on our private
            servers.
          </li>
        </ul>
      </section>

      <FileUpload onUploadComplete={handleUploadComplete} />

      <div className="upload-status">
        {uploadMessage && <p className="success-message">✅ {uploadMessage}</p>}
        {summary && (
          <div className="summary-box">
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
