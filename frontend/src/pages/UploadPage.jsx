import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dropzone from '../components/upload/Dropzone';
import PresetSelector from '../components/upload/PresetSelector';
import { uploadDiagramApi, loadPresetApi } from '../services/api';
import { FiCpu, FiShield, FiAlertCircle } from 'react-icons/fi';

const UploadPage = ({ onSessionCreated }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadDiagramApi(formData);
      if (res.status === 'success') {
        onSessionCreated(res.session_id, res.pipeline);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to upload technical diagram file.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetSelect = async (presetId) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await loadPresetApi(presetId);
      if (res.status === 'success') {
        onSessionCreated(res.session_id, res.pipeline);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to initialize diagram preset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge badge-medium" style={{ marginBottom: '12px' }}>
          <FiShield /> Final Year B.Tech Research Platform
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>
          Error-Aware Technical Diagram <span className="gradient-text">Visual QA & Healing</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
          Upload flowcharts, circuit schematics, block diagrams, or UML architectures to execute automated symbol detection, graph validation, anomaly reasoning, self-healing, and VQA.
        </p>
      </div>

      {errorMsg && (
        <div className="glass-card" style={{ padding: '14px 20px', marginBottom: '24px', borderRadius: '12px', borderLeft: '4px solid var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '12px', color: '#FDA4AF' }}>
          <FiAlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <Dropzone onFileUpload={handleFileUpload} isLoading={isLoading} />

      <PresetSelector onSelectPreset={handlePresetSelect} isLoading={isLoading} />
    </motion.div>
  );
};

export default UploadPage;
