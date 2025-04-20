// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Welcome from "./components/welcome/WelcomePage";
import HomePage from "./components/homepage/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
