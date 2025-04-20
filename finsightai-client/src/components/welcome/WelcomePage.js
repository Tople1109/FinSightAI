import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/homepage");
  };

  return (
    <div
      className="container"
      style={{ backgroundImage: 'url("images/bg3.webp")' }}
    >
      <div className="welcome-content">
        <h1>Welcome to FinSightAI</h1>
        <p>
          FinSightAI makes it effortless to extract insights from any PDF
          report. Upload your document and instantly ask natural‑language
          questions about its contents.
        </p>

        <div className="buttons">
          <button className="btn-signin" onClick={handleClick}>
            <span>Get Started Now</span>
          </button>
        </div>

        {/* wrap the three cards in a flex‐row */}
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
