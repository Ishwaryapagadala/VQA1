import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import SummaryPage from './pages/SummaryPage';
import DiagramDetailsPage from './pages/DiagramDetailsPage';
import ReasoningPage from './pages/ReasoningPage';
import SelfHealingPage from './pages/SelfHealingPage';
import VQAPage from './pages/VQAPage';
import ReportPage from './pages/ReportPage';

function App() {
  const [activeSession, setActiveSession] = useState(null);
  const [pipelineData, setPipelineData] = useState(null);

  const handleSessionCreated = (sessionId, data) => {
    setActiveSession(sessionId);
    setPipelineData(data);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="app-bg-glow" />
        
        <Sidebar activeSession={activeSession} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Navbar activeSession={activeSession} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/upload" element={<UploadPage onSessionCreated={handleSessionCreated} />} />
              <Route path="/dashboard" element={<DashboardPage pipelineData={pipelineData} />} />
              <Route path="/summary" element={<SummaryPage pipelineData={pipelineData} />} />
              <Route path="/details" element={<DiagramDetailsPage pipelineData={pipelineData} />} />
              <Route path="/reasoning" element={<ReasoningPage pipelineData={pipelineData} />} />
              <Route path="/healing" element={<SelfHealingPage pipelineData={pipelineData} activeSession={activeSession} />} />
              <Route path="/vqa" element={<VQAPage activeSession={activeSession} />} />
              <Route path="/report" element={<ReportPage activeSession={activeSession} pipelineData={pipelineData} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
