import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHistory, FaTrash, FaDownload, FaSearch, FaCamera, FaImage, FaChartLine, FaCalendar, FaBrain, FaList, FaTimes } from 'react-icons/fa';
import './EmotionHistory.css';

const emotionColors = {
  Happy: '#22C55E',
  Sad: '#3B82F6',
  Angry: '#EF4444',
  Fear: '#A855F7',
  Surprise: '#EAB308',
  Neutral: '#6B7280',
  Disgust: '#15803D'
};

const emotionEmojis = {
  Happy: '😊',
  Sad: '😢',
  Angry: '😠',
  Fear: '😨',
  Surprise: '😮',
  Neutral: '😐',
  Disgust: '🤢'
};

const EmotionHistory = ({ history = [], onClear, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        total: 0,
        today: 0,
        avgConfidence: 0,
        mostFrequent: 'N/A'
      };
    }

    const today = new Date().toDateString();
    const todayPredictions = history.filter(item => 
      new Date(item.timestamp).toDateString() === today
    );

    const emotionCounts = history.reduce((acc, item) => {
      acc[item.emotion] = (acc[item.emotion] || 0) + 1;
      return acc;
    }, {});

    const mostFrequent = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const avgConfidence = history.reduce((sum, item) => sum + item.confidence, 0) / history.length;

    return {
      total: history.length,
      today: todayPredictions.length,
      avgConfidence: avgConfidence.toFixed(1),
      mostFrequent
    };
  }, [history]);

  const filteredHistory = history.filter(item =>
    item.emotion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = () => {
    if (onClear && window.confirm('Are you sure you want to clear all history?')) {
      onClear();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(history);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="emotion-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="history-header">
        <div className="history-title">
          <FaHistory className="title-icon" />
          <h3>Emotion History</h3>
        </div>
        <div className="history-actions">
          <motion.button
            className="action-btn download-btn"
            onClick={handleDownload}
            disabled={history.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDownload />
            Export CSV
          </motion.button>
          <motion.button
            className="action-btn clear-btn"
            onClick={handleClear}
            disabled={history.length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash />
            Clear History
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.total}</p>
            <p className="stat-label">Total Detections</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon">
            <FaCalendar />
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.today}</p>
            <p className="stat-label">Today</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon">
            <FaBrain />
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.avgConfidence}%</p>
            <p className="stat-label">Avg Confidence</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon" style={{ color: emotionColors[stats.mostFrequent] || '#6B7280' }}>
            {emotionEmojis[stats.mostFrequent] || '😐'}
          </div>
          <div className="stat-content">
            <p className="stat-value">{stats.mostFrequent}</p>
            <p className="stat-label">Most Detected</p>
          </div>
        </motion.div>
      </div>

      {/* Load More Button */}
      {history.length > 0 && (
        <motion.button
          className="load-more-btn"
          onClick={() => setIsModalOpen(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaList />
          View All Detections ({history.length})
        </motion.button>
      )}

      {/* Empty State */}
      {history.length === 0 && (
        <motion.div
          className="history-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="empty-illustration">
            <div className="empty-circle">
              <span className="empty-emoji">🤖</span>
            </div>
            <div className="empty-sparkles">
              <span className="sparkle sparkle-1">✨</span>
              <span className="sparkle sparkle-2">✨</span>
              <span className="sparkle sparkle-3">✨</span>
            </div>
          </div>
          <h4 className="empty-title">No emotion detections yet</h4>
          <p className="empty-text">
            Start using the camera or upload images to detect emotions. Your predictions will appear here with detailed analytics.
          </p>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="history-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="history-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title">
                  <FaHistory className="modal-icon" />
                  <h3>All Emotion Detections</h3>
                </div>
                <motion.button
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Search Bar */}
              <div className="modal-search">
                <div className="search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search emotions..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Cards Grid */}
              <div className="modal-cards-grid">
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    className="emotion-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    style={{ borderColor: emotionColors[item.emotion] }}
                  >
                    <div className="card-header">
                      <div className="emotion-display">
                        <span 
                          className="emotion-emoji-large"
                          style={{ backgroundColor: emotionColors[item.emotion] }}
                        >
                          {emotionEmojis[item.emotion]}
                        </span>
                        <div className="emotion-info">
                          <h4 className="emotion-name">{item.emotion}</h4>
                          <div className="source-badge">
                            {item.source === 'camera' ? (
                              <>
                                <FaCamera />
                                Webcam
                              </>
                            ) : (
                              <>
                                <FaImage />
                                Image
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="timestamp">
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="confidence-section">
                        <div className="confidence-header">
                          <span className="confidence-label">Confidence</span>
                          <span className="confidence-value">{item.confidence.toFixed(1)}%</span>
                        </div>
                        <div className="confidence-bar-container">
                          <motion.div
                            className="confidence-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ duration: 0.8, delay: index * 0.03 + 0.2 }}
                            style={{ backgroundColor: emotionColors[item.emotion] }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredHistory.length === 0 && searchTerm && (
                <motion.div
                  className="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>No emotions found matching "{searchTerm}"</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmotionHistory;
