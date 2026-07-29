import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBrain, FaRobot, FaCogs, FaEye, FaImage, 
  FaDatabase, FaChartLine, FaGraduationCap, 
  FaLightbulb, FaArrowDown, FaArrowRight, FaCheckCircle,
  FaQuestionCircle, FaTimes, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import './HowItWorks.css';

const HowItWorks = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [visitedSections, setVisitedSections] = useState(new Set([0]));
  const sectionRefs = useRef([]);

  const roadmap = [
    { id: 0, title: 'Introduction', icon: FaLightbulb },
    { id: 1, title: 'Artificial Intelligence', icon: FaRobot },
    { id: 2, title: 'Machine Learning', icon: FaCogs },
    { id: 3, title: 'Deep Learning', icon: FaBrain },
    { id: 4, title: 'Computer Vision', icon: FaEye },
    { id: 5, title: 'CNN Basics', icon: FaImage },
    { id: 6, title: 'FER2013 Dataset', icon: FaDatabase },
    { id: 7, title: 'Image Preprocessing', icon: FaCogs },
    { id: 8, title: 'Model Training', icon: FaGraduationCap },
    { id: 9, title: 'Prediction Pipeline', icon: FaChartLine },
    { id: 10, title: 'Real-Time Detection', icon: FaEye },
  ];

  const faqs = [
    {
      question: 'Why use CNN instead of ANN?',
      answer: 'CNNs are designed specifically for images. They use convolutional layers that preserve spatial relationships between pixels, unlike ANNs which flatten images and lose spatial information. CNNs also have fewer parameters due to weight sharing, making them more efficient for image tasks.'
    },
    {
      question: 'Why grayscale images?',
      answer: 'Grayscale reduces the input size from 3 channels (RGB) to 1, making the model faster and lighter. For emotion recognition, color information is less important than facial features and expressions. The FER2013 dataset is grayscale, which is standard for this task.'
    },
    {
      question: 'Why 48×48 pixels?',
      answer: '48×48 is the standard size of the FER2013 dataset. It\'s large enough to capture facial features but small enough for efficient processing. Larger images would require more computation without significantly improving emotion detection accuracy.'
    },
    {
      question: 'Why PyTorch?',
      answer: 'PyTorch is beginner-friendly with Python-like syntax, has excellent documentation, strong community support, and is widely used in research and industry. Its dynamic computation graph makes debugging easier compared to static frameworks.'
    },
    {
      question: 'Why FER2013 dataset?',
      answer: 'FER2013 is the most widely used benchmark for facial emotion recognition. It has 35,887 labeled images covering 7 emotions, is publicly available, and allows for fair comparison with other models. It\'s the standard dataset for this task.'
    },
    {
      question: 'What is Softmax?',
      answer: 'Softmax converts the model\'s raw outputs (logits) into probabilities that sum to 1. It takes the exponential of each output and normalizes them, giving us the confidence percentage for each emotion class.'
    },
    {
      question: 'What is CrossEntropyLoss?',
      answer: 'CrossEntropyLoss measures the difference between predicted probabilities and actual labels. It penalizes wrong predictions heavily, especially when the model is confident but wrong. It\'s the standard loss function for multi-class classification.'
    },
  ];

  const scrollToSection = (index) => {
    setActiveSection(index);
    setVisitedSections(prev => new Set([...prev, index]));
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
            setActiveSection(index);
            setVisitedSections(prev => new Set([...prev, index]));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="how-it-works">
      {/* Hero Section */}
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <FaGraduationCap />
          </motion.div>
          <h1 className="hero-title">How It Works</h1>
          <p className="hero-subtitle">
            Learn how AI recognizes facial emotions step by step
          </p>
        </div>
      </motion.div>

      {/* Learning Roadmap */}
      <motion.div 
        className="roadmap-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="roadmap-title">Learning Roadmap</h2>
        <div className="roadmap-container">
          {roadmap.map((item, index) => (
            <motion.div
              key={item.id}
              className={`roadmap-item ${activeSection === index ? 'active' : ''} ${visitedSections.has(index) ? 'visited' : ''}`}
              onClick={() => scrollToSection(index)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="roadmap-icon">
                <item.icon />
                {visitedSections.has(index) && <FaCheckCircle className="check-icon" />}
              </div>
              <span className="roadmap-label">{item.title}</span>
              {index < roadmap.length - 1 && <FaArrowDown className="roadmap-arrow" />}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 1: Introduction */}
      <motion.section 
        ref={el => sectionRefs.current[0] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">01</div>
          <h2 className="section-title">Introduction to Facial Emotion Recognition</h2>
        </div>
        <div className="section-content">
          <div className="intro-card">
            <div className="intro-icon">
              <FaEye />
            </div>
            <p className="intro-text">
              Facial Emotion Recognition is an AI application that analyzes facial expressions 
              and predicts the emotion shown by a person. It's like teaching a computer to 
              understand human feelings by looking at faces.
            </p>
            <div className="intro-examples">
              <div className="example-item">
                <span className="example-emoji">😊</span>
                <span>Happy</span>
              </div>
              <div className="example-item">
                <span className="example-emoji">😢</span>
                <span>Sad</span>
              </div>
              <div className="example-item">
                <span className="example-emoji">😠</span>
                <span>Angry</span>
              </div>
              <div className="example-item">
                <span className="example-emoji">😨</span>
                <span>Fear</span>
              </div>
              <div className="example-item">
                <span className="example-emoji">😮</span>
                <span>Surprise</span>
              </div>
              <div className="example-item">
                <span className="example-emoji">😐</span>
                <span>Neutral</span>
              </div>
              <div className="example-item">
                <span className="example-emoji">🤢</span>
                <span>Disgust</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 2: What is AI */}
      <motion.section 
        ref={el => sectionRefs.current[1] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">02</div>
          <h2 className="section-title">What is Artificial Intelligence?</h2>
        </div>
        <div className="section-content">
          <div className="ai-card">
            <div className="ai-icon">
              <FaRobot />
            </div>
            <h3 className="card-title">Artificial Intelligence</h3>
            <p className="card-description">
              Machines that can perform tasks requiring human intelligence
            </p>
          </div>
          <div className="examples-grid">
            <motion.div 
              className="example-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaEye />
              <span>Face Recognition</span>
            </motion.div>
            <motion.div 
              className="example-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaRobot />
              <span>ChatGPT</span>
            </motion.div>
            <motion.div 
              className="example-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaCogs />
              <span>Self-driving Cars</span>
            </motion.div>
            <motion.div 
              className="example-card"
              whileHover={{ scale: 1.05 }}
            >
              <FaBrain />
              <span>Emotion Detection</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Machine Learning */}
      <motion.section 
        ref={el => sectionRefs.current[2] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">03</div>
          <h2 className="section-title">What is Machine Learning?</h2>
        </div>
        <div className="section-content">
          <div className="flowchart">
            <motion.div 
              className="flowchart-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaDatabase />
              <span>Data</span>
            </motion.div>
            <FaArrowDown className="flowchart-arrow" />
            <motion.div 
              className="flowchart-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaCogs />
              <span>Learn Patterns</span>
            </motion.div>
            <FaArrowDown className="flowchart-arrow" />
            <motion.div 
              className="flowchart-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaBrain />
              <span>Create Model</span>
            </motion.div>
            <FaArrowDown className="flowchart-arrow" />
            <motion.div 
              className="flowchart-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaChartLine />
              <span>Make Predictions</span>
            </motion.div>
          </div>
          <div className="flowchart-explanation">
            <p>Machine Learning teaches computers to learn from data without being explicitly programmed for every rule.</p>
          </div>
        </div>
      </motion.section>

      {/* Section 4: Deep Learning */}
      <motion.section 
        ref={el => sectionRefs.current[3] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">04</div>
          <h2 className="section-title">What is Deep Learning?</h2>
        </div>
        <div className="section-content">
          <div className="neural-network-diagram">
            <motion.div 
              className="nn-layer input-layer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="nn-title">Input</div>
              <div className="nn-nodes">
                <div className="nn-node"></div>
                <div className="nn-node"></div>
                <div className="nn-node"></div>
              </div>
            </motion.div>
            <FaArrowRight className="nn-arrow" />
            <motion.div 
              className="nn-layer hidden-layer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="nn-title">Hidden Layers</div>
              <div className="nn-nodes">
                <div className="nn-node"></div>
                <div className="nn-node"></div>
                <div className="nn-node"></div>
                <div className="nn-node"></div>
                <div className="nn-node"></div>
              </div>
            </motion.div>
            <FaArrowRight className="nn-arrow" />
            <motion.div 
              className="nn-layer output-layer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="nn-title">Output</div>
              <div className="nn-nodes">
                <div className="nn-node"></div>
                <div className="nn-node"></div>
              </div>
            </motion.div>
          </div>
          <div className="dl-explanation">
            <p>Deep Learning uses many hidden layers to learn complex patterns automatically. Each layer learns increasingly abstract features.</p>
          </div>
        </div>
      </motion.section>

      {/* Section 5: Computer Vision */}
      <motion.section 
        ref={el => sectionRefs.current[4] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">05</div>
          <h2 className="section-title">What is Computer Vision?</h2>
        </div>
        <div className="section-content">
          <div className="cv-flowchart">
            <motion.div 
              className="cv-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaImage />
              <span>Image</span>
            </motion.div>
            <FaArrowRight className="cv-arrow" />
            <motion.div 
              className="cv-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaBrain />
              <span>Process</span>
            </motion.div>
            <FaArrowRight className="cv-arrow" />
            <motion.div 
              className="cv-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaEye />
              <span>Understand</span>
            </motion.div>
          </div>
          <p className="cv-description">
            Computer Vision enables computers to see and understand visual information from the world, 
            like images and videos. It's the technology behind self-driving cars, medical imaging, and our emotion recognition system.
          </p>
        </div>
      </motion.section>

      {/* Section 6: Why CNN */}
      <motion.section 
        ref={el => sectionRefs.current[5] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">06</div>
          <h2 className="section-title">Why Convolutional Neural Networks?</h2>
        </div>
        <div className="section-content">
          <div className="cnn-flowchart">
            <motion.div 
              className="cnn-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaImage />
              <span>Image</span>
            </motion.div>
            <FaArrowRight className="cnn-arrow" />
            <motion.div 
              className="cnn-node cnn-highlight"
              whileHover={{ scale: 1.05 }}
            >
              <FaBrain />
              <span>CNN</span>
            </motion.div>
            <FaArrowRight className="cnn-arrow" />
            <motion.div 
              className="cnn-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>😊</span>
              <span>Emotion</span>
            </motion.div>
          </div>
          <div className="cnn-benefits">
            <div className="benefit-card">
              <FaCheckCircle />
              <p>Preserves spatial relationships between pixels</p>
            </div>
            <div className="benefit-card">
              <FaCheckCircle />
              <p>Automatically learns features from images</p>
            </div>
            <div className="benefit-card">
              <FaCheckCircle />
              <p>Weight sharing reduces parameters</p>
            </div>
            <div className="benefit-card">
              <FaCheckCircle />
              <p>Translation invariant - recognizes patterns anywhere</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 7: FER2013 Dataset */}
      <motion.section 
        ref={el => sectionRefs.current[6] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">07</div>
          <h2 className="section-title">FER2013 Dataset</h2>
        </div>
        <div className="section-content">
          <div className="dataset-flowchart">
            <motion.div 
              className="dataset-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>FER2013</span>
            </motion.div>
            <FaArrowDown className="dataset-arrow" />
            <motion.div 
              className="dataset-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>35,887 Images</span>
            </motion.div>
            <FaArrowDown className="dataset-arrow" />
            <motion.div 
              className="dataset-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>48 × 48</span>
            </motion.div>
            <FaArrowDown className="dataset-arrow" />
            <motion.div 
              className="dataset-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Grayscale</span>
            </motion.div>
            <FaArrowDown className="dataset-arrow" />
            <motion.div 
              className="dataset-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>7 Emotions</span>
            </motion.div>
          </div>
          <div className="dataset-explanation">
            <div className="explanation-card">
              <h4>Why Grayscale?</h4>
              <p>Reduces input size, faster processing, color not needed for emotion detection</p>
            </div>
            <div className="explanation-card">
              <h4>Why 48×48?</h4>
              <p>Standard dataset size, captures facial features efficiently</p>
            </div>
            <div className="explanation-card">
              <h4>Why 7 Classes?</h4>
              <p>Covers basic human emotions: Happy, Sad, Angry, Fear, Surprise, Neutral, Disgust</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 8: Image Preprocessing */}
      <motion.section 
        ref={el => sectionRefs.current[7] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">08</div>
          <h2 className="section-title">Image Preprocessing Pipeline</h2>
        </div>
        <div className="section-content">
          <div className="preprocessing-flowchart">
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>FER2013 CSV</span>
            </motion.div>
            <FaArrowDown className="preprocessing-arrow" />
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Read Pixel Values</span>
            </motion.div>
            <FaArrowDown className="preprocessing-arrow" />
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Convert to Image</span>
            </motion.div>
            <FaArrowDown className="preprocessing-arrow" />
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Resize to 48×48</span>
            </motion.div>
            <FaArrowDown className="preprocessing-arrow" />
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Normalize (0-1)</span>
            </motion.div>
            <FaArrowDown className="preprocessing-arrow" />
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Convert to Tensor</span>
            </motion.div>
            <FaArrowDown className="preprocessing-arrow" />
            <motion.div 
              className="preprocessing-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>DataLoader</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 9: Model Training */}
      <motion.section 
        ref={el => sectionRefs.current[8] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">09</div>
          <h2 className="section-title">Model Training Workflow</h2>
        </div>
        <div className="section-content">
          <div className="training-flowchart">
            <motion.div 
              className="training-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Training Images</span>
            </motion.div>
            <FaArrowDown className="training-arrow" />
            <motion.div 
              className="training-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Forward Pass</span>
            </motion.div>
            <FaArrowDown className="training-arrow" />
            <motion.div 
              className="training-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Calculate Loss</span>
            </motion.div>
            <FaArrowDown className="training-arrow" />
            <motion.div 
              className="training-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Backpropagation</span>
            </motion.div>
            <FaArrowDown className="training-arrow" />
            <motion.div 
              className="training-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Update Weights</span>
            </motion.div>
            <FaArrowDown className="training-arrow" />
            <motion.div 
              className="training-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Repeat for Epochs</span>
            </motion.div>
            <FaArrowDown className="training-arrow" />
            <motion.div 
              className="training-node training-highlight"
              whileHover={{ scale: 1.05 }}
            >
              <span>Best Model Saved</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 10: Prediction Pipeline */}
      <motion.section 
        ref={el => sectionRefs.current[9] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">10</div>
          <h2 className="section-title">Prediction Pipeline</h2>
        </div>
        <div className="section-content">
          <div className="prediction-flowchart">
            <motion.div 
              className="prediction-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaImage />
              <span>Image</span>
            </motion.div>
            <FaArrowRight className="prediction-arrow" />
            <motion.div 
              className="prediction-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaEye />
              <span>Face Detection</span>
            </motion.div>
            <FaArrowRight className="prediction-arrow" />
            <motion.div 
              className="prediction-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Crop Face</span>
            </motion.div>
            <FaArrowRight className="prediction-arrow" />
            <motion.div 
              className="prediction-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>48×48</span>
            </motion.div>
            <FaArrowRight className="prediction-arrow" />
            <motion.div 
              className="prediction-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaBrain />
              <span>CNN</span>
            </motion.div>
            <FaArrowRight className="prediction-arrow" />
            <motion.div 
              className="prediction-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Softmax</span>
            </motion.div>
            <FaArrowRight className="prediction-arrow" />
            <motion.div 
              className="prediction-node prediction-highlight"
              whileHover={{ scale: 1.05 }}
            >
              <span>😊</span>
              <span>Emotion</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 11: Real-Time Detection */}
      <motion.section 
        ref={el => sectionRefs.current[10] = el}
        className="content-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">11</div>
          <h2 className="section-title">Real-Time Webcam Detection</h2>
        </div>
        <div className="section-content">
          <div className="realtime-flowchart">
            <motion.div 
              className="realtime-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Webcam</span>
            </motion.div>
            <FaArrowDown className="realtime-arrow" />
            <motion.div 
              className="realtime-node"
              whileHover={{ scale: 1.05 }}
            >
              <span>Frame</span>
            </motion.div>
            <FaArrowDown className="realtime-arrow" />
            <motion.div 
              className="realtime-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaEye />
              <span>Face Detection</span>
            </motion.div>
            <FaArrowDown className="realtime-arrow" />
            <motion.div 
              className="realtime-node"
              whileHover={{ scale: 1.05 }}
            >
              <FaBrain />
              <span>CNN</span>
            </motion.div>
            <FaArrowDown className="realtime-arrow" />
            <motion.div 
              className="realtime-node realtime-highlight"
              whileHover={{ scale: 1.05 }}
            >
              <span>😊</span>
              <span>Emotion</span>
            </motion.div>
            <FaArrowDown className="realtime-arrow" />
            <motion.div 
              className="realtime-node realtime-loop"
              whileHover={{ scale: 1.05 }}
            >
              <span>Repeat (15-25 FPS)</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="content-section faq-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="section-header">
          <div className="section-number">?</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="section-content">
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`faq-item ${expandedFAQ === index ? 'expanded' : ''}`}
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="faq-question">
                  <FaQuestionCircle />
                  <span>{faq.question}</span>
                  {expandedFAQ === index ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      className="faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HowItWorks;
