import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiHelpCircle, FiTool, FiArrowRight, FiShield } from 'react-icons/fi';

const ReasoningPage = ({ pipelineData }) => {
  const navigate = useNavigate();

  const anomalies = pipelineData?.anomalies || [
    {
      id: 'ANOM_001',
      code: 'ERR_MISSING_START',
      title: 'Missing Entry Flow (Start Node)',
      severity: 'CRITICAL',
      confidence: 0.96,
      reason: 'Graph traversal cannot establish a deterministic entry point because no oval START symbol exists.',
      possible_cause: 'Diagram designer omitted initial initialization boundary.',
      suggested_repair: 'Inject a START node at top center [X: 50%, Y: 5%] and draw directed edge to first process block.'
    },
    {
      id: 'ANOM_002',
      code: 'ERR_DECISION_BRANCH',
      title: 'Incomplete Condition Branching',
      severity: 'HIGH',
      confidence: 0.97,
      reason: 'Decision block [node_4] evaluates a conditional expression but only provides 1 outgoing path.',
      possible_cause: 'Missing alternative branch (e.g. missing NO path).',
      suggested_repair: 'Add explicit second outgoing edge with NO condition label to alternate handler.'
    }
  ];

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-success';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            AI Anomaly <span className="gradient-text">Reasoning Engine</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Diagnostic root cause analysis and severity breakdown for diagram structural anomalies.
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/healing')}>
          <span>Execute Self-Healing</span>
          <FiArrowRight />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {anomalies.map((anom) => (
          <motion.div
            key={anom.id}
            whileHover={{ scale: 1.005 }}
            className="glass-card"
            style={{
              padding: '24px',
              borderRadius: '16px',
              borderLeft: `5px solid ${anom.severity === 'CRITICAL' ? '#F43F5E' : anom.severity === 'HIGH' ? '#F59E0B' : '#10B981'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${getSeverityBadge(anom.severity)}`}>{anom.severity}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{anom.id} / {anom.code}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#FFF', marginTop: '8px' }}>{anom.title}</h3>
              </div>

              <div className="glass-panel" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Diagnostic Confidence: <strong style={{ color: '#10B981' }}>{(anom.confidence * 100).toFixed(0)}%</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div className="glass-panel" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FDA4AF', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <FiAlertTriangle />
                  <span>ANOMALY REASON & CAUSE</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{anom.reason}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}><strong>Likely Cause:</strong> {anom.possible_cause}</p>
              </div>

              <div className="glass-panel" style={{ padding: '14px', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6EE7B7', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <FiTool />
                  <span>SUGGESTED SELF-HEALING REPAIR</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{anom.suggested_repair}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReasoningPage;
