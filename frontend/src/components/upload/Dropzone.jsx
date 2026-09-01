import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile, FiCheckCircle, FiLoader } from 'react-icons/fi';

const Dropzone = ({ onFileUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
      className="glass-card"
      style={{
        padding: '50px 30px',
        borderRadius: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        border: isDragging ? '2px dashed var(--primary-violet)' : '2px dashed var(--border-glass)',
        background: isDragging ? 'rgba(139, 92, 246, 0.12)' : 'rgba(17, 24, 39, 0.6)',
        boxShadow: isDragging ? '0 0 30px rgba(139, 92, 246, 0.4)' : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/bmp, image/webp"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-violet)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
          }}
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <FiLoader size={32} />
            </motion.div>
          ) : (
            <FiUploadCloud size={34} />
          )}
        </motion.div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
            {isLoading ? 'Analyzing Technical Diagram...' : 'Drag & Drop Technical Diagram'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            PNG, JPG, JPEG, WEBP or BMP up to 10MB
          </p>
        </div>

        <button className="btn-primary" style={{ marginTop: '8px' }} onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>
          <FiFile size={18} />
          <span>Browse File from Device</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Dropzone;
