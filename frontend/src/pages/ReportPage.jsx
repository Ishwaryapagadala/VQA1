import React from 'react';
import { motion } from 'framer-motion';
import { getReportUrl } from '../services/api';
import { FiDownload, FiFileText, FiCheckCircle, FiShield, FiPrinter } from 'react-icons/fi';

const ReportPage = ({ activeSession, pipelineData }) => {
  const reportUrl = activeSession ? getReportUrl(activeSession) : '#';

  const summary = pipelineData?.summary || { total_symbols: 6, total_text_segments: 6, processing_time: 0.42 };
  const validation = pipelineData?.validation || { is_valid: false, total_errors: 2 };
  const anomalies = pipelineData?.anomalies || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
          Diagnostic <span className="gradient-text">PDF Report Generator</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Export a complete production-quality technical audit report including diagram metadata, detected symbol matrix, OCR table, anomaly diagnostics, self-healing log, and VQA history.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 35px rgba(139, 92, 246, 0.2)' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'var(--gradient-main)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
        }}>
          <FiFileText size={40} color="#FFF" />
        </div>

        <h3 style={{ fontSize: '1.4rem', color: '#FFF', marginBottom: '10px' }}>
          Technical Diagram Anomaly & Healing Report Ready
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '600px', margin: '24px auto', textAlign: 'center' }}>
          <div className="glass-panel" style={{ padding: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Symbols Analyzed</span>
            <h4 style={{ fontSize: '1.2rem', color: '#FFF' }}>{summary.total_symbols}</h4>
          </div>
          <div className="glass-panel" style={{ padding: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anomalies Recorded</span>
            <h4 style={{ fontSize: '1.2rem', color: '#F43F5E' }}>{anomalies.length}</h4>
          </div>
          <div className="glass-panel" style={{ padding: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-Repairs</span>
            <h4 style={{ fontSize: '1.2rem', color: '#10B981' }}>{pipelineData?.healing?.total_repairs || 2}</h4>
          </div>
        </div>

        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.05rem', textDecoration: 'none' }}
        >
          <FiDownload size={22} />
          <span>Download PDF Diagnostic Report</span>
        </a>
      </div>
    </motion.div>
  );
};

export default ReportPage;
