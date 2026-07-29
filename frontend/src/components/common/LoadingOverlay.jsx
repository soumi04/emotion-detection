import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = 'Analyzing facial features...' }) => {
  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loading-content">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <FaBrain />
        </motion.div>
        <motion.p
          className="loading-message"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
        <div className="loading-dots">
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
          />
          <motion.span
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
