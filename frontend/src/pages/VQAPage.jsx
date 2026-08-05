import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatBox from '../components/vqa/ChatBox';
import { askVqaApi } from '../services/api';
import { FiArrowRight } from 'react-icons/fi';

const VQAPage = ({ activeSession }) => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      question: 'How many decision nodes are present in this diagram?',
      answer: 'There is 1 decision node in this technical diagram: [node_4: "Is X > 10 ?"].',
      confidence: 0.98,
      reasoning_steps: [
        'Scanned shape classification for diamond geometry.',
        'Extracted OCR text associated with decision node [node_4].'
      ]
    }
  ]);

  const handleAsk = async (qText) => {
    const qToAsk = qText || question;
    if (!qToAsk.trim() || !activeSession) return;

    setLoading(true);
    try {
      const res = await askVqaApi(activeSession, qToAsk);
      if (res.status === 'success') {
        setChatHistory((prev) => [...prev, res.vqa]);
        setQuestion('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div className="badge badge-medium" style={{ marginBottom: '8px' }}>STAGE 7 OF 8</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
            Visual Question <span className="gradient-text">Answering (VQA)</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Interact with the technical diagram using multi-modal AI combining vision features, OCR, and NetworkX graph reasoning.
          </p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/report')}>
          <span>Generate PDF Report</span>
          <FiArrowRight />
        </button>
      </div>

      <ChatBox
        chatHistory={chatHistory}
        onAskQuestion={handleAsk}
        question={question}
        setQuestion={setQuestion}
        loading={loading}
      />
    </motion.div>
  );
};

export default VQAPage;
