import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiImage, 
  FiBox, 
  FiType, 
  FiShare2, 
  FiCheckSquare, 
  FiAlertTriangle, 
  FiZap, 
  FiCheckCircle, 
  FiArrowRight 
} from 'react-icons/fi';

const DashboardPage = ({ pipelineData }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 1, name: 'Image Preprocessing', icon: FiImage, desc: 'Grayscale, Otsu threshold, Morphology & Canny edges', status: 'Completed' },
    { id: 2, name: 'Symbol Detection (YOLO)', icon: FiBox, desc: 'Identified Start, Process, Decision, End & Arrow shapes', status: 'Completed' },
    { id: 3, name: 'OCR Text Extraction', icon: FiType, desc: 'Extracted spatial text labels for diagram nodes', status: 'Completed' },
    { id: 4, name: 'NetworkX Graph Construction', icon: FiShare2, desc: 'Generated directed graph topology (DiGraph)', status: 'Completed' },
    { id: 5, name: 'Structural & Semantic Validation', icon: FiCheckSquare, desc: 'Evaluated entry flow, termination & decision branches', status: 'Completed' },
    { id: 6, name: 'Anomaly Reasoning Engine', icon: FiAlertTriangle, desc: 'Identified errors, root cause, severity & repair steps', status: 'Completed' },
    { id: 7, name: 'Self-Healing Engine', icon: FiZap, desc: 'Generated auto-repaired graph & comparison image', status: 'Completed' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            AI Pipeline <span className="gradient-text">Execution Dashboard</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Real-time stage-by-stage progression of diagram analysis & healing.
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/summary')}>
          <span>View Analysis Summary</span>
          <FiArrowRight />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <motion.div
              key={step.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card"
              style={{
                padding: '22px',
                borderRadius: '16px',
                border: isCurrent ? '1.5px solid var(--primary-violet)' : '1px solid var(--border-glass)',
                boxShadow: isCurrent ? '0 0 25px rgba(139, 92, 246, 0.3)' : 'none',
                background: isCurrent ? 'rgba(139, 92, 246, 0.12)' : 'rgba(15, 23, 42, 0.65)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: isDone ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDone ? '#FFF' : 'var(--primary-violet)'
                }}>
                  <Icon size={22} />
                </div>
                <span className={`badge ${isDone ? 'badge-success' : 'badge-medium'}`}>
                  {isDone ? 'COMPLETED' : isCurrent ? 'PROCESSING...' : 'PENDING'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: '#FFF', marginBottom: '6px' }}>
                Step {step.id}: {step.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {step.desc}
              </p>

              {/* Progress bar */}
              <div style={{ marginTop: '16px', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: isDone ? '100%' : isCurrent ? '60%' : '0%' }}
                  transition={{ duration: 0.4 }}
                  style={{ height: '100%', background: isDone ? '#10B981' : 'var(--gradient-main)' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default DashboardPage;
