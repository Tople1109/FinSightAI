import React from "react";
import logo from "./logo2.png"; // adjust path if your folder differs

export default function Header() {
  return (
    <div>
      <header className="app-header" style={{ backgroundColor: "#1f2a40" }}>
        <img src={logo} alt="FinSightAI" className="logo" />
      </header>
    </div>
  );
}
