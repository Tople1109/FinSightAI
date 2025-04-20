// WelcomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

import bgVideo from "./bg_0068.mp4"; // adjust path if needed

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* animated background */}
      <video
        className="bg-video"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="welcome-content">
        {/* ---------- your existing content ---------- */}
        <h1>Welcome to FinSightAI</h1>
        <p>
          FinSightAI makes it effortless to extract insights from any PDF
          report. Upload your document and instantly ask natural‑language
          questions about its contents.
        </p>

        <div className="buttons">
          <button className="btn-signin" onClick={() => navigate("/homepage")}>
            <span>Get Started Now</span>
          </button>
        </div>

        <div className="descpt-row">
          <div className="Descpt-container">
            <h2>Ask a question</h2>
            <p>
              Type any question about your PDF to get instant, data‑backed
              answers.
            </p>
          </div>
          <div className="Descpt-container">
            <h2>Top Risk</h2>
            <p>
              See the most critical risk factors our AI has identified in your
              report.
            </p>
          </div>
          <div className="Descpt-container">
            <h2>Insight Hub</h2>
            <p>
              Explore key analytics—revenue trends, quotes, and growth
              metrics—all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
