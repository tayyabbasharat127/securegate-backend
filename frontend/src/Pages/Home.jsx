import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="title">Suspicious Login Detection System</h1>
          <p className="subtitle">
            AI-powered security system that detects unusual logins using risk scoring,
            device fingerprinting, geolocation, and behavioral analysis.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn hero-btn">Login</Link>
            <Link to="/signup" className="btn hero-btn-outline">Sign Up</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <h2 className="section-title">Key Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <div className="icon">🔐</div>
            <h3>Smart Authentication</h3>
            <p>Password hashing, token-based auth & secure user validation.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🌍</div>
            <h3>Geolocation Tracking</h3>
            <p>Detects login location & flags unusual geographic changes.</p>
          </div>

          <div className="feature-card">
            <div className="icon">📱</div>
            <h3>Device Detection</h3>
            <p>Identifies new or unknown devices instantly.</p>
          </div>

          <div className="feature-card">
            <div className="icon">⚠️</div>
            <h3>Risk Score Engine</h3>
            <p>Scores login activity based on multiple risk factors.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🚨</div>
            <h3>Suspicious Login Alerts</h3>
            <p>Blocks high-risk login attempts automatically.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
