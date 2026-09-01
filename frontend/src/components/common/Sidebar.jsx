import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiUploadCloud as IconUpload, 
  FiGrid as IconGrid, 
  FiPieChart as IconSummary, 
  FiFileText as IconDetails, 
  FiAlertTriangle as IconReasoning, 
  FiCheckCircle as IconHealing, 
  FiMessageSquare as IconVQA, 
  FiDownloadCloud as IconReport,
  FiLogIn as IconLogin
} from 'react-icons/fi';

const Sidebar = ({ activeSession }) => {
  const navItems = [
    { path: '/login', label: 'Auth Portal', icon: IconLogin },
    { path: '/upload', label: 'Upload Diagram', icon: IconUpload },
    { path: '/summary', label: 'Analysis Summary', icon: IconSummary },
    { path: '/details', label: 'Diagram Inspector', icon: IconDetails },
    { path: '/reasoning', label: 'AI Anomaly Reasoning', icon: IconReasoning },
    { path: '/healing', label: 'Self-Healing Engine', icon: IconHealing },
    { path: '/dashboard', label: 'Diagram Analysis Workflow', icon: IconGrid },
    { path: '/vqa', label: 'Visual Q&A', icon: IconVQA },
    { path: '/report', label: 'PDF Report Center', icon: IconReport }
  ];

  return (
    <aside style={{
      width: '260px',
      height: 'calc(100vh - 70px)',
      position: 'fixed',
      top: '70px',
      left: 0,
      background: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 90
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.08) 100%)' : 'transparent',
                borderLeft: isActive ? '3px solid #8B5CF6' : '3px solid transparent',
                transition: 'all 0.2s ease'
              })}
            >
              <Icon size={18} style={{ color: item.path === '/login' ? '#06B6D4' : 'inherit' }} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
