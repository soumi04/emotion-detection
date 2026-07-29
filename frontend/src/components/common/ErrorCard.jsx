import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaCamera, FaUserSlash, FaServer, FaBug, FaRedo } from 'react-icons/fa';
import './ErrorCard.css';

const errorTypes = {
  noFace: {
    icon: FaUserSlash,
    title: 'No Face Detected',
    description: 'Could not detect a face in the image. Please try with a clearer image.',
    color: '#F59E0B'
  },
  multipleFaces: {
    icon: FaUserSlash,
    title: 'Multiple Faces Detected',
    description: 'Multiple faces detected. Please use an image with a single face.',
    color: '#F59E0B'
  },
  cameraPermission: {
    icon: FaCamera,
    title: 'Camera Permission Denied',
    description: 'Please allow camera access to use live detection.',
    color: '#EF4444'
  },
  backendOffline: {
    icon: FaServer,
    title: 'Backend Offline',
    description: 'The emotion detection service is currently unavailable. Please try again later.',
    color: '#EF4444'
  },
  predictionFailed: {
    icon: FaBug,
    title: 'Prediction Failed',
    description: 'An error occurred during emotion prediction. Please try again.',
    color: '#EF4444'
  },
  generic: {
    icon: FaExclamationTriangle,
    title: 'An Error Occurred',
    description: 'Something went wrong. Please try again.',
    color: '#EF4444'
  }
};

const ErrorCard = ({ errorType = 'generic', onRetry, className = '' }) => {
  const error = errorTypes[errorType] || errorTypes.generic;
  const ErrorIcon = error.icon;

  return (
    <motion.div
      className={`error-card ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ '--error-color': error.color }}
    >
      <div className="error-icon" style={{ color: error.color }}>
        <ErrorIcon />
      </div>
      <h4 className="error-title">{error.title}</h4>
      <p className="error-description">{error.description}</p>
      {onRetry && (
        <motion.button
          className="error-retry-btn"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRedo />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
};

export default ErrorCard;
