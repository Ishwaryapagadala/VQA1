import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiGitCommit, FiLayers, FiCpu, FiGrid } from 'react-icons/fi';

const PresetSelector = ({ onSelectPreset, isLoading }) => {
  const presets = [
    { id: 'flowchart', name: 'Flowchart Diagram', type: 'Flowchart', icon: FiGitCommit, desc: 'Includes Process, Decision & missing YES/NO branch' },
    { id: 'circuit', name: 'Circuit Schematic', type: 'Circuit', icon: FiCpu, desc: 'Resistors, Capacitors, Voltage Nodes & Open Loops' },
    { id: 'uml_class', name: 'UML Class Diagram', type: 'UML Class', icon: FiLayers, desc: 'Class hierarchy, associations & inheritance arrows' },
    { id: 'activity', name: 'UML Activity Diagram', type: 'UML Activity', icon: FiGrid, desc: 'Fork, Join, Decision diamond & transition flow' }
  ];

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <FiZap color="#F59E0B" />
        <h4 style={{ fontSize: '1rem', color: '#FFF', fontWeight: 600 }}>Or Load Sample Technical Diagram Presets:</h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {presets.map((p) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -4, borderColor: 'rgba(139, 92, 246, 0.5)' }}
              onClick={() => !isLoading && onSelectPreset(p.id)}
              className="glass-card"
              style={{
                padding: '18px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary-violet)' }}>
                  <Icon size={20} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFF' }}>{p.name}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{p.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PresetSelector;
