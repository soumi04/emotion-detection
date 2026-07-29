import { motion } from 'framer-motion';
import { FaBrain, FaClock, FaMicrochip, FaCheckCircle } from 'react-icons/fa';
import './PredictionCard.css';

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

const PredictionCard = ({ prediction = null, isLoading = false }) => {
  if (isLoading) {
    return (
      <motion.div
        className="prediction-card loading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="prediction-header">
          <div className="prediction-title">
            <FaBrain className="title-icon" />
            <h3>Prediction</h3>
          </div>
        </div>
        <div className="prediction-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Analyzing facial features...</p>
        </div>
      </motion.div>
    );
  }

  if (!prediction) {
    return (
      <motion.div
        className="prediction-card empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="prediction-header">
          <div className="prediction-title">
            <FaBrain className="title-icon" />
            <h3>Prediction</h3>
          </div>
        </div>
        <div className="prediction-empty">
          <div className="empty-icon">🧠</div>
          <p className="empty-text">No prediction yet</p>
          <p className="empty-subtext">Start the camera or upload an image to detect emotions</p>
        </div>
      </motion.div>
    );
  }

  const { emotion, confidence, inferenceTime, timestamp } = prediction;
  const color = emotionColors[emotion] || emotionColors.Neutral;
  const emoji = emotionEmojis[emotion] || '😐';

  return (
    <motion.div
      className="prediction-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ '--emotion-color': color }}
    >
      <div className="prediction-header">
        <div className="prediction-title">
          <FaBrain className="title-icon" />
          <h3>Prediction</h3>
        </div>
        <div className="prediction-status">
          <FaCheckCircle className="status-icon" />
          <span className="status-text">Detected</span>
        </div>
      </div>

      <div className="prediction-content">
        <motion.div
          className="emotion-display"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="emotion-emoji">{emoji}</div>
          <div className="emotion-name">{emotion}</div>
        </motion.div>

        <div className="confidence-section">
          <div className="confidence-header">
            <span className="confidence-label">Confidence</span>
            <span className="confidence-value">{confidence.toFixed(2)}%</span>
          </div>
          <div className="confidence-bar">
            <motion.div
              className="confidence-fill"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        <div className="prediction-meta">
          <div className="meta-item">
            <FaClock className="meta-icon" />
            <div className="meta-content">
              <span className="meta-label">Inference Time</span>
              <span className="meta-value">{inferenceTime}ms</span>
            </div>
          </div>
          <div className="meta-item">
            <FaMicrochip className="meta-icon" />
            <div className="meta-content">
              <span className="meta-label">Model</span>
              <span className="meta-value">GPU</span>
            </div>
          </div>
        </div>

        <div className="prediction-timestamp">
          <span className="timestamp-label">Detected at</span>
          <span className="timestamp-value">{new Date(timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionCard;
