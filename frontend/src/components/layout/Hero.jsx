import { motion } from 'framer-motion';
import { FaCamera, FaUpload, FaBrain, FaRobot } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaBrain className="badge-icon" />
            <span>AI-Powered Recognition</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Facial
            <span className="gradient-text"> Emotion Recognition</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Detect human emotions in real time using Deep Learning and Computer Vision.
            Experience the future of emotion analysis with our cutting-edge AI technology.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('live-detection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FaCamera />
              Start Camera
            </motion.button>

            <motion.button
              className="btn btn-secondary btn-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('image-detection')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <FaUpload />
              Upload Image
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="stat-item">
              <div className="stat-value">99.2%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">7</div>
              <div className="stat-label">Emotions</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">&lt;50ms</div>
              <div className="stat-label">Response</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-illustration"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="illustration-container">
            <motion.div
              className="floating-card card-1"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="card-icon">😊</div>
              <div className="card-label">Happy</div>
              <div className="card-confidence">96%</div>
            </motion.div>

            <motion.div
              className="floating-card card-2"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="card-icon">😢</div>
              <div className="card-label">Sad</div>
              <div className="card-confidence">82%</div>
            </motion.div>

            <motion.div
              className="floating-card card-3"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="card-icon">😮</div>
              <div className="card-label">Surprise</div>
              <div className="card-confidence">91%</div>
            </motion.div>

            <motion.div
              className="main-ai-icon"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaRobot />
            </motion.div>

            <div className="glow-effect glow-1"></div>
            <div className="glow-effect glow-2"></div>
            <div className="glow-effect glow-3"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
