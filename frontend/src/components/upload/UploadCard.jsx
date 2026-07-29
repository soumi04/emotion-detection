import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaImage, FaTimes, FaCheck, FaRedo } from 'react-icons/fa';
import './UploadCard.css';

const UploadCard = ({ onUpload, onReset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setUploadedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onReset) onReset();
  };

  const handlePredict = () => {
    if (uploadedImage && onUpload) {
      onUpload(uploadedImage);
    }
  };

  return (
    <motion.div
      className={`upload-card ${isDragging ? 'dragging' : ''} ${uploadedImage ? 'has-image' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="upload-header">
        <div className="upload-title">
          <FaImage className="title-icon" />
          <h3>Upload Image</h3>
        </div>
        {uploadedImage && (
          <motion.button
            className="reset-btn"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo />
            Reset
          </motion.button>
        )}
      </div>

      {!uploadedImage ? (
        <div
          className={`upload-zone ${isDragging ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <motion.div
              className="upload-icon"
              animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaUpload />
            </motion.div>
            <p className="upload-text">
              Drag & drop your image here
            </p>
            <p className="upload-subtext">
              Supports PNG, JPG, JPEG
            </p>
            <motion.button
              className="browse-btn"
              onClick={handleBrowse}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Files
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              className="file-input"
            />
          </div>
        </div>
      ) : (
        <div className="upload-preview">
          <div className="preview-container">
            <img
              src={previewUrl}
              alt="Uploaded preview"
              className="preview-image"
            />
            <div className="preview-overlay">
              <FaCheck className="check-icon" />
            </div>
          </div>
          <div className="preview-info">
            <p className="file-name">{uploadedImage.name}</p>
            <p className="file-size">
              {(uploadedImage.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <motion.button
            className="predict-btn"
            onClick={handlePredict}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaImage />
            Predict Emotion
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default UploadCard;
