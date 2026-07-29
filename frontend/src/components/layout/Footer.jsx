import { motion } from 'framer-motion';
import { FaReact, FaPython, FaFire } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3 className="footer-logo">CNN Architecture Flow</h3>
            <p className="footer-tagline">
              Input (48×48 grayscale) → Stem → Residual Blocks → Adaptive Pool → Classifier → 7 Emotions
            </p>
          </div>

          <div className="footer-tech">
            <p className="footer-title">Built with</p>
            <div className="tech-icons">
              <motion.div
                className="tech-icon"
                whileHover={{ scale: 1.2, rotate: 10 }}
                title="React"
              >
                <FaReact />
              </motion.div>
              <motion.div
                className="tech-icon"
                whileHover={{ scale: 1.2, rotate: -10 }}
                title="Python"
              >
                <FaPython />
              </motion.div>
              <motion.div
                className="tech-icon"
                whileHover={{ scale: 1.2, rotate: 10 }}
                title="PyTorch"
              >
                <FaFire />
              </motion.div>
            </div>
          </div>

          <div className="footer-description">
            <p className="footer-text">
              The EmotionCNN model uses residual connections for better gradient flow, 
              processes images through multiple convolutional layers with batch normalization, 
              and classifies emotions using softmax activation.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            Facial Emotion Recognition System © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
