// import React from 'react';

// import EmployerButton from './components/EmployerButton'; 
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LandingPage from './components/LandingPage';
// import JobSeekerFlow from './components/JobSeekerFlow';
// import EducatorFlow from './components/EducatorFlow';
// import DashboardSeeker from './components/DashboardSeeker';
// import DashboardEducator from './components/DashboardEducator';
// import TargetRolePage from './components/TargetRolePage'; // Import the new component
// import LearningPathDashboard from './components/LearningPathDashboard';
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route exact path="/" element={<LandingPage />} />
//         <Route path="/job-seeker" element={<TargetRolePage />} /> {/* New route */}
//         <Route path="/job-seeker-dashboard" element={<DashboardSeeker />} />
//         <Route path="/job-seeker-flow" element={<JobSeekerFlow />} />
//         <Route path="/educator" element={<EducatorFlow />} />
//         <Route path="/educator-dashboard" element={<DashboardEducator />} />
//         <Route path="/employer" element={<EmployerButton />} /> {/* Add new route for Employer */}
//         <Route path="/learning-paths" element={<LearningPathDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React from 'react';
import './App.css';
import ParticleBackground from './three/ParticleBackground';

/**
 * App - Cybersecurity / Hacker Interface
 * - High-tech Matrix-style UI
 * - Antigravity Three.js particle background
 * - Glassmorphism cards and terminal-style buttons
 */
const App = () => {
  return (
    <div className="app-shell">
      <ParticleBackground />
      <div className="grid-overlay" />
      <div className="scanlines" />
      <div className="matrix-glow" />

      <div style={{
        position: 'fixed',
        top: '14px',
        left: '16px',
        padding: '8px 12px',
        border: '1px solid rgba(0,255,65,0.35)',
        borderRadius: '10px',
        background: 'rgba(10,10,10,0.55)',
        boxShadow: '0 0 14px rgba(0,255,65,0.2)',
        color: '#9fffb5',
        fontSize: '12px',
        letterSpacing: '0.04em',
        zIndex: 10
      }}>
        <div>STATUS: ONLINE</div>
        <div>MODE: MATRIX HUD</div>
      </div>

      <div className="content-container">
        <div className="headline">
          <h1>
            <span className="accent glow-text">NeoShield</span> // Cyber Defense Terminal
          </h1>
          <p className="subtext">
            Secure ingest of resumes and AI-driven gap analysis visualized in a live data stream.
          </p>
        </div>

        <div className="cards">
          <section className="glass-card">
            <div className="card-title">
              <span className="dot" aria-hidden="true" />
              Upload Resume
              <span className="badge">INPUT</span>
            </div>
            <div className="divider" />
            <p className="card-body">
              Drop your resume to initiate skills parsing, entity extraction, and threat-surface checks.
              Files are processed in-memory for secure handling.
            </p>
            <button className="terminal-button" aria-label="Upload resume">
              {'>'} upload --resume
            </button>
          </section>

          <section className="glass-card">
            <div className="card-title">
              <span className="dot" aria-hidden="true" />
              Analysis Results
              <span className="badge">OUTPUT</span>
            </div>
            <div className="divider" />
            <p className="card-body">
              View AI-driven gap detection, prioritized learning paths, and realtime scoring. Visual indicators
              pulse based on detected confidence.
            </p>
            <button className="terminal-button" aria-label="View analysis results">
              {'>'} view --report
            </button>
          </section>

          <section className="glass-card">
            <div className="card-title">
              <span className="dot" aria-hidden="true" />
              Live Telemetry
              <span className="badge">STATUS</span>
            </div>
            <div className="divider" />
            <p className="card-body">
              Streams: Particle field velocity, frame timings, and GPU utilization. Mouse proximity subtly
              perturbs the data grid to simulate intrusion detection.
            </p>
            <button className="terminal-button" aria-label="Open telemetry">
              {'>'} open --telemetry
            </button>
          </section>
        </div>

        <div className="footer-note">
          Matrix interface ready. All systems nominal. Awaiting next command...
        </div>
      </div>
    </div>
  );
};

export default App;
