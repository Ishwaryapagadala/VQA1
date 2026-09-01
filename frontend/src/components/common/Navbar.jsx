import React from 'react';
import { FiCpu, FiShield, FiUser } from 'react-icons/fi';

const Navbar = ({ activeSession }) => {
  return (
    <header style={{
      height: '70px',
      background: 'rgba(11, 15, 25, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'var(--gradient-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
        }}>
          <FiCpu size={22} color="#FFF" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#FFF' }}>
            Diag<span className="gradient-text">Heal AI</span>
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Error-Aware Technical Diagram VQA & Anomaly Healing
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {activeSession && (
          <div className="glass-panel" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
            <span>Session Active: <strong style={{ color: 'var(--primary-violet)' }}>{activeSession.slice(0, 8)}...</strong></span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-glass)' }}>
          <FiShield color="#8B5CF6" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>User Name</span>
        </div>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <FiUser color="#FFF" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
