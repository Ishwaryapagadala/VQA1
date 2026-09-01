import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BeforeAfterView from '../components/healing/BeforeAfterView';
import { FiCheckCircle, FiDownload, FiArrowRight, FiRefreshCw, FiZap } from 'react-icons/fi';

const SelfHealingPage = ({ pipelineData, activeSession }) => {
  const navigate = useNavigate();

  const rawImage = pipelineData?.preprocessing?.gray || pipelineData?.preprocessing?.morph;
  const healing = pipelineData?.healing || {
    repaired_image: '',
    repair_logs: [
      { step: 1, action: 'INJECT_START_NODE', details: 'Inserted START boundary oval node at top center [50% W, 40px H].', status: 'SUCCESS' },
      { step: 2, action: 'ADD_DECISION_BRANCH', details: 'Added missing NO condition branch from Decision [node_4] to Terminal [node_6].', status: 'SUCCESS' }
    ],
    total_repairs: 2
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            Self-Healing <span className="gradient-text">Engine</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Automated graph topological repair and visual diagram reconstruction.
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          <span>Proceed to Workflow</span>
          <FiArrowRight />
        </button>
      </div>

      {/* Interactive Before & After Canvas View */}
      <BeforeAfterView
        originalImage={rawImage}
        repairedImage={healing.repaired_image}
        totalRepairs={healing.total_repairs}
      />

      {/* Repair Log Table */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>
            Self-Healing Execution Log ({healing.repair_logs.length} Actions Applied)
          </h3>
          <a
            href={healing.repaired_image}
            download={`repaired_diagram_${activeSession?.slice(0, 6) || 'session'}.png`}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            <FiDownload />
            <span>Download Repaired Diagram Image</span>
          </a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Step #</th>
                <th style={{ padding: '12px' }}>Action Applied</th>
                <th style={{ padding: '12px' }}>Modification Details</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {healing.repair_logs.map((log) => (
                <tr key={log.step} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary-violet)' }}>#{log.step}</td>
                  <td style={{ padding: '12px', color: '#FFF', fontFamily: 'var(--font-mono)' }}>{log.action}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{log.details}</td>
                  <td style={{ padding: '12px' }}><span className="badge badge-success">{log.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default SelfHealingPage;
