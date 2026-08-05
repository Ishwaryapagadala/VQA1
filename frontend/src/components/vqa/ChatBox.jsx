import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSend, FiCpu, FiCheckCircle, FiHelpCircle } from 'react-icons/fi';

const ChatBox = ({ chatHistory, onAskQuestion, question, setQuestion, loading }) => {
  const presetQuestions = [
    'How many decision nodes are present?',
    'Is there any missing connection?',
    'What happens if X is even?',
    'What is the entry point of this diagram?'
  ];

  return (
    <div>
      {/* Question Suggestions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => onAskQuestion(pq)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 14px', borderRadius: '20px' }}
          >
            <FiHelpCircle color="#8B5CF6" />
            <span>{pq}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', minHeight: '380px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {chatHistory.map((chat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* User Question */}
            <div style={{ alignSelf: 'flex-end', background: 'var(--gradient-main)', padding: '12px 18px', borderRadius: '18px 18px 2px 18px', color: '#FFF', fontSize: '0.95rem', maxWidth: '80%' }}>
              {chat.question}
            </div>

            {/* AI Response */}
            <div style={{ alignSelf: 'flex-start', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border-glass)', padding: '16px', borderRadius: '18px 18px 18px 2px', maxWidth: '85%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary-violet)' }}>
                  <FiCpu size={16} />
                </div>
                <strong style={{ color: '#FFF', fontSize: '0.9rem' }}>Diagram AI Reasoner</strong>
                <span className="badge badge-medium" style={{ marginLeft: 'auto' }}>
                  {(chat.confidence * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '10px', lineHeight: '1.5' }}>
                {chat.answer}
              </p>

              {chat.reasoning_steps && (
                <div className="glass-panel" style={{ padding: '10px 14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--primary-violet)' }}>Reasoning Path:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                    {chat.reasoning_steps.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); onAskQuestion(); }} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="input-glass"
          placeholder="Ask any question about this technical diagram..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          <span>{loading ? 'Reasoning...' : 'Ask AI'}</span>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
