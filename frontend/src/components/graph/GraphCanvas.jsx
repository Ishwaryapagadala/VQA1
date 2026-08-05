import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GraphCanvas = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  // Color theme for node types
  const getNodeColor = (type) => {
    switch (type) {
      case 'Start':
      case 'End':
        return '#10B981'; // Emerald
      case 'Decision':
        return '#D946EF'; // Magenta
      case 'Input/Output':
        return '#06B6D4'; // Cyan
      case 'Process':
      default:
        return '#8B5CF6'; // Violet
    }
  };

  return (
    <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF', fontWeight: 700 }}>
            Interactive NetworkX Graph Topology ({nodes.length} Nodes, {edges.length} Edges)
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Hover or click nodes to inspect graph node attributes and directional dependencies.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981' }}>● Start/End</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8B5CF6' }}>■ Process</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D946EF' }}>◆ Decision</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#06B6D4' }}>▰ Input/Output</span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div style={{
        width: '100%',
        height: '420px',
        background: 'rgba(11, 15, 25, 0.9)',
        borderRadius: '12px',
        border: '1px solid var(--border-glass)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ cursor: 'grab' }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
            <marker id="arrowhead-healed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((e, idx) => {
            const srcNode = nodes.find(n => n.id === e.source);
            const tgtNode = nodes.find(n => n.id === e.target);
            if (!srcNode || !tgtNode) return null;

            const [x1, y1] = srcNode.center;
            const [x2, y2] = tgtNode.center;
            const isHealed = e.is_healed;

            const midX = (x1 + x2) / 2 + 12;
            const midY = (y1 + y2) / 2;

            return (
              <g key={idx}>
                <line
                  x1={x1} y1={y1}
                  x2={x2} y2={y2}
                  stroke={isHealed ? '#10B981' : '#3B82F6'}
                  strokeWidth={isHealed ? 3 : 2}
                  strokeDasharray={isHealed ? '5,5' : 'none'}
                  markerEnd={isHealed ? 'url(#arrowhead-healed)' : 'url(#arrowhead)'}
                />
                {e.label && (
                  <text
                    x={midX} y={midY}
                    fill={e.label === 'YES' ? '#10B981' : e.label === 'NO' ? '#F43F5E' : '#94A3B8'}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="var(--font-mono)"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((n) => {
            const [cx, cy] = n.center;
            const [x, y, w, h] = n.bbox;
            const color = getNodeColor(n.type);
            const isSelected = selectedNode?.id === n.id;

            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{ cursor: 'pointer' }}
              >
                {n.type === 'Start' || n.type === 'End' ? (
                  <ellipse
                    cx={cx} cy={cy} rx={w / 2} ry={h / 2}
                    fill={`${color}30`} stroke={color} strokeWidth={isSelected ? 4 : 2}
                  />
                ) : n.type === 'Decision' ? (
                  <polygon
                    points={`${cx},${cy - h/2} ${cx + w/2},${cy} ${cx},${cy + h/2} ${cx - w/2},${cy}`}
                    fill={`${color}30`} stroke={color} strokeWidth={isSelected ? 4 : 2}
                  />
                ) : (
                  <rect
                    x={x} y={y} width={w} height={h} rx="8"
                    fill={`${color}30`} stroke={color} strokeWidth={isSelected ? 4 : 2}
                  />
                )}

                <text
                  x={cx} y={cy + 4}
                  textAnchor="middle"
                  fill="#FFF"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="var(--font-sans)"
                >
                  {n.text ? n.text.slice(0, 18) : n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ marginTop: '14px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <h4 style={{ color: '#FFF', fontSize: '0.95rem' }}>
              Selected Node: <strong style={{ color: getNodeColor(selectedNode.type) }}>{selectedNode.id}</strong> ({selectedNode.type})
            </h4>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Label: "{selectedNode.text}" | Center: ({selectedNode.center.join(', ')})
            </span>
          </div>
          <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => setSelectedNode(null)}>
            Close Inspector
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default GraphCanvas;
