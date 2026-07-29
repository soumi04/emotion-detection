import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaStop, FaExpand, FaCompress, FaSync, FaVideo, FaVideoSlash, FaCheck, FaTimes } from 'react-icons/fa';
import './CameraCard.css';

const CameraCard = ({ onCapture }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [fps, setFps] = useState(0);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fpsRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());

  useEffect(() => {
    let fpsInterval;
    
    if (isStreaming) {
      fpsInterval = setInterval(() => {
        const now = Date.now();
        const delta = now - lastFrameTimeRef.current;
        const currentFps = Math.round(1000 / delta);
        setFps(currentFps);
        lastFrameTimeRef.current = now;
      }, 1000);
    }

    return () => {
      if (fpsInterval) clearInterval(fpsInterval);
    };
  }, [isStreaming]);

  const startCamera = async () => {
    console.log('🎥 Starting camera...');
    console.log('📹 Video ref check:', videoRef.current);
    
    try {
      setError(null);
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser');
      }

      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      console.log('📷 Requesting camera permission...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: 1280, height: 720 }
      });
      
      console.log('✅ Stream received:', stream);
      console.log('📹 Video tracks:', stream.getVideoTracks());
      
      console.log('🔗 Assigning stream to video element...');
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Set streaming state immediately
      setIsStreaming(true);
      console.log('🟢 Camera state set to streaming');
      
      // Try to play the video
      try {
        await videoRef.current.play();
        console.log('▶️ Video playing successfully');
      } catch (playError) {
        console.error('❌ Video play error:', playError);
        setError('Failed to play video stream');
        setIsStreaming(false);
      }
    } catch (err) {
      console.error('❌ Camera error:', err);
      setError(err.message || 'Camera permission denied or no camera available');
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setFps(0);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => startCamera(), 100);
  };

  const captureImage = () => {
    if (videoRef.current && isStreaming) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(imageDataUrl);
      setShowPreview(true);
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      // Convert data URL to blob
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' });
          if (onCapture) {
            onCapture(file);
          }
          setShowPreview(false);
          setCapturedImage(null);
        });
    }
  };

  const retakeCapture = () => {
    setShowPreview(false);
    setCapturedImage(null);
  };

  return (
    <motion.div
      className={`camera-card ${isStreaming ? 'active' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="camera-header">
        <div className="camera-title">
          <FaVideo className="title-icon" />
          <h3>Live Camera</h3>
        </div>
        <div className="camera-status">
          <div className={`status-indicator ${isStreaming ? 'active' : 'inactive'}`}></div>
          <span className="status-text">
            {isStreaming ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="camera-viewport">
        {error ? (
          <div className="camera-error">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`camera-feed ${isStreaming ? 'active' : 'hidden'}`}
              onPlay={() => console.log('🎬 Video onPlay event fired')}
              onError={(e) => console.error('❌ Video error event:', e)}
            />
            {!isStreaming && (
              <div className="camera-placeholder">
                <div className="placeholder-icon">
                  <FaVideoSlash />
                </div>
                <p className="placeholder-text">Camera is offline</p>
                <p className="placeholder-subtext">Click "Start Camera" to begin</p>
              </div>
            )}
          </>
        )}

        {isStreaming && (
          <div className="camera-overlay">
            <div className="fps-counter">
              <span className="fps-value">{fps}</span>
              <span className="fps-label">FPS</span>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <motion.div
          className="capture-preview-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="preview-content">
            <div className="preview-image-container">
              <img src={capturedImage} alt="Captured preview" className="captured-preview-image" />
            </div>
            <div className="preview-actions">
              <motion.button
                className="preview-btn confirm"
                onClick={confirmCapture}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCheck />
                Use This Image
              </motion.button>
              <motion.button
                className="preview-btn cancel"
                onClick={retakeCapture}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes />
                Retake
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="camera-controls">
        <motion.button
          className={`control-btn ${isStreaming ? 'stop' : 'start'}`}
          onClick={isStreaming ? stopCamera : startCamera}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isStreaming ? <FaStop /> : <FaCamera />}
          {isStreaming ? 'Stop' : 'Start'}
        </motion.button>

        <motion.button
          className="control-btn secondary"
          onClick={captureImage}
          disabled={!isStreaming}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaCamera />
          Capture
        </motion.button>

        <motion.button
          className="control-btn secondary"
          onClick={switchCamera}
          disabled={!isStreaming}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSync />
          Switch
        </motion.button>

        <motion.button
          className="control-btn secondary"
          onClick={toggleFullscreen}
          disabled={!isStreaming}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
          {isFullscreen ? 'Exit' : 'Full'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CameraCard;
