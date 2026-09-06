import React from 'react';
import { Link, Navigate } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="hero-section">
      <div className="hero-glow-blob-1"></div>
      <div className="hero-glow-blob-2"></div>

      <div className="hero-container">
        <div className="hero-badge">
          <i className="fa-solid fa-bolt"></i> The Premier Developer Network
        </div>

        <h1 className="hero-title">
          Connect, Build & Get Reviewed by{' '}
          <span className="hero-title-gradient">Top Developers</span>
        </h1>

        <p className="hero-subtitle">
          Showcase your skills, discover talented software engineers, share projects,
          and build your credibility through verified peer reviews and technical feedback.
        </p>

        <div className="hero-cta-group">
          <Link to="/register" className="btn-modern-primary">
            <i className="fa-solid fa-user-plus"></i> Join the Hub Free
          </Link>
          <Link to="/login" className="btn-modern-secondary">
            <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Account
          </Link>
        </div>

        <div className="hero-metrics">
          <div className="metric-item">
            <div className="metric-number">100%</div>
            <div className="metric-label">Verified Profiles</div>
          </div>
          <div className="metric-item">
            <div className="metric-number">MERN</div>
            <div className="metric-label">Full-Stack Stack</div>
          </div>
          <div className="metric-item">
            <div className="metric-number">5-Star</div>
            <div className="metric-label">Peer Reviews</div>
          </div>
          <div className="metric-item">
            <div className="metric-number">Fast</div>
            <div className="metric-label">Real-time Search</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
