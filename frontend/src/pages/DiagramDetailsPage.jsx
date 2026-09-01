import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GraphCanvas from '../components/graph/GraphCanvas';
import { FiImage, FiBox, FiType, FiShare2, FiArrowRight } from 'react-icons/fi';

const DiagramDetailsPage = ({ pipelineData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('objects');

  const prep = pipelineData?.preprocessing || {};
  const objects = pipelineData?.detected_objects || [];
  const ocr = pipelineData?.ocr || [];
  const graph = pipelineData?.graph || { nodes: [], edges: [] };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            Diagram Inspector & <span className="gradient-text">Graph Details</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Inspect raw image preprocessing filters, symbol bounding boxes, OCR text mapping, and NetworkX graph edges.
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/reasoning')}>
          <span>Proceed to AI Reasoning</span>
          <FiArrowRight />
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'objects', label: 'Detected Symbols', icon: FiBox },
          { id: 'ocr', label: 'OCR Text Mapping', icon: FiType },
          { id: 'graph', label: 'Graph Topology Canvas', icon: FiShare2 },
          { id: 'preprocess', label: 'Preprocessing Steps', icon: FiImage }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.88rem', padding: '10px 18px' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'objects' && (
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '16px' }}>
            Detected Diagram Objects & Bounding Boxes ({objects.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Symbol ID</th>
                  <th style={{ padding: '12px' }}>Classification</th>
                  <th style={{ padding: '12px' }}>Confidence</th>
                  <th style={{ padding: '12px' }}>Bounding Box [X, Y, W, H]</th>
                  <th style={{ padding: '12px' }}>Center Coordinate</th>
                </tr>
              </thead>
              <tbody>
                {objects.map((obj) => (
                  <tr key={obj.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', color: 'var(--primary-violet)', fontWeight: 600 }}>{obj.id}</td>
                    <td style={{ padding: '12px', color: '#FFF' }}>{obj.label}</td>
                    <td style={{ padding: '12px' }}><span className="badge badge-success">{(obj.confidence * 100).toFixed(0)}%</span></td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>[{obj.bbox.join(', ')}]</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>({obj.center.join(', ')})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ocr' && (
        <div className="glass-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#FFF', marginBottom: '16px' }}>
            OCR Text Extraction Results ({ocr.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Node ID</th>
                  <th style={{ padding: '12px' }}>Shape</th>
                  <th style={{ padding: '12px' }}>Extracted Text Label</th>
                  <th style={{ padding: '12px' }}>OCR Confidence</th>
                </tr>
              </thead>
              <tbody>
                {ocr.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{item.node_id}</td>
                    <td style={{ padding: '12px', color: '#FFF' }}>{item.shape}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#FFF' }}>"{item.text}"</td>
                    <td style={{ padding: '12px' }}><span className="badge badge-medium">{(item.confidence * 100).toFixed(0)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'graph' && (
        <GraphCanvas graphData={graph} />
      )}

      {activeTab === 'preprocess' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {['gray', 'thresh', 'morph', 'canny'].map((stepKey) => (
            <div key={stepKey} className="glass-card" style={{ padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ color: '#FFF', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '10px' }}>Filter: {stepKey}</h4>
              {prep[stepKey] ? (
                <img src={prep[stepKey]} alt={stepKey} style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-glass)' }} />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>Step Filter Ready</div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DiagramDetailsPage;
