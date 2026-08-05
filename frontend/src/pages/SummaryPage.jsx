import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBox, FiType, FiClock, FiCheckCircle, FiGrid, FiArrowRight, FiShield } from 'react-icons/fi';

const SummaryPage = ({ pipelineData }) => {
  const navigate = useNavigate();

  const summary = pipelineData?.summary || {
    diagram_type: 'Flowchart Diagram',
    total_symbols: 6,
    total_arrows: 5,
    total_text_segments: 6,
    processing_time: 0.42,
    confidence_score: 0.95
  };

  const validation = pipelineData?.validation || { is_valid: false, total_errors: 2 };

  const stats = [
    { title: 'Diagram Category', value: summary.diagram_type, icon: FiGrid, color: '#8B5CF6' },
    { title: 'Detected Symbols', value: summary.total_symbols, icon: FiBox, color: '#3B82F6' },
    { title: 'Text Segments (OCR)', value: summary.total_text_segments, icon: FiType, color: '#06B6D4' },
    { title: 'Processing Latency', value: `${summary.processing_time} s`, icon: FiClock, color: '#10B981' },
    { title: 'Confidence Rating', value: `${(summary.confidence_score * 100).toFixed(1)}%`, icon: FiCheckCircle, color: '#F59E0B' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <div className="badge badge-medium" style={{ marginBottom: '8px' }}>STAGE 3 OF 8</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
          Diagram Analysis <span className="gradient-text">Summary</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          High-level metrics and extraction overview from the multi-modal AI engine.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="glass-card" style={{ padding: '20px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.title}</span>
                <div style={{ padding: '6px', borderRadius: '8px', background: `${s.color}20`, color: s.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#FFF', fontWeight: 800 }}>{s.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Validation Status Banner */}
      <div className="glass-card" style={{
        padding: '24px',
        borderRadius: '16px',
        borderLeft: validation.is_valid ? '5px solid #10B981' : '5px solid #F43F5E',
        background: validation.is_valid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span className={`badge ${validation.is_valid ? 'badge-success' : 'badge-critical'}`}>
            {validation.is_valid ? 'VALID TOPOLOGY' : 'ANOMALIES DETECTED'}
          </span>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginTop: '8px', marginBottom: '4px' }}>
            {validation.is_valid ? 'Technical Diagram Passed Structural & Semantic Rules' : `Detected ${validation.total_errors} Anomaly/Anomalies in Flow Topology`}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            {validation.is_valid ? 'Control flow transitions are properly bounded.' : 'AI Anomaly Reasoner ready to diagnose root causes and apply self-healing.'}
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/details')}>
          <span>Inspect Diagram Details</span>
          <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default SummaryPage;
