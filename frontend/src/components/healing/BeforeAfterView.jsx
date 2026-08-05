import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertTriangle, FiEye } from 'react-icons/fi';

const BeforeAfterView = ({ originalImage, repairedImage, totalRepairs }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState('split');

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF', fontWeight: 700 }}>
            Visual Self-Healing Inspection <span className="gradient-text">Canvas</span>
          </h3>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Compare raw technical diagram against AI topological auto-repaired canvas ({totalRepairs} repair actions applied).
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['split', 'side-by-side'].map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              className={activeTab === mode ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '6px 14px', textTransform: 'capitalize' }}
            >
              {mode.replace('-', ' ')} View
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'side-by-side' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#FDA4AF', fontWeight: 600 }}>● Raw Original (Anomalous)</span>
              <span className="badge badge-critical">BEFORE</span>
            </div>
            <div style={{ height: '340px', borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {originalImage ? (
                <img src={originalImage} alt="Original" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: 'var(--text-dim)' }}>Original Canvas</span>
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#6EE7B7', fontWeight: 600 }}>● AI Auto-Repaired Canvas</span>
              <span className="badge badge-success">AFTER (HEALED)</span>
            </div>
            <div style={{ height: '340px', borderRadius: '10px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {repairedImage ? (
                <img src={repairedImage} alt="Repaired" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ color: '#6EE7B7' }}>Repaired Canvas</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Split Slider View */
        <div style={{ position: 'relative', width: '100%', height: '380px', borderRadius: '14px', overflow: 'hidden', background: '#000', border: '1px solid var(--border-glass)' }}>
          {/* Repaired Image (Base Layer) */}
          {repairedImage && (
            <img src={repairedImage} alt="Repaired" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
          )}

          {/* Original Image (Clipped Overlay Layer) */}
          {originalImage && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${sliderPos}%`,
              height: '100%',
              overflow: 'hidden',
              borderRight: '2px solid var(--primary-violet)',
              boxShadow: '4px 0 15px rgba(139, 92, 246, 0.5)'
            }}>
              <img src={originalImage} alt="Original" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}

          {/* Slider Handle Controls */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(e.target.value)}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              transform: 'translateY(-50%)',
              opacity: 0,
              cursor: 'ew-resize',
              height: '100%',
              zIndex: 10
            }}
          />

          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#FDA4AF'
          }}>
            Original Diagram ({sliderPos}%)
          </div>

          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#6EE7B7'
          }}>
            Repaired Canvas ({100 - sliderPos}%)
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterView;
