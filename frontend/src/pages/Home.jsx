import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import CameraCard from '../components/camera/CameraCard';
import PredictionCard from '../components/cards/PredictionCard';
import UploadCard from '../components/upload/UploadCard';
import EmotionHistory from '../components/history/EmotionHistory';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import Footer from '../components/layout/Footer';
import { predictEmotion, getHistory, clearHistory, getAnalytics } from '../services/api';
import './Home.css';

function Home() {
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  // Load history and analytics on component mount
  useEffect(() => {
    loadHistory();
    loadAnalytics();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleImageUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await predictEmotion(file, 'image');
      
      setPrediction({
        emotion: result.emotion,
        confidence: result.confidence,
        inferenceTime: result.inference_time,
        timestamp: result.timestamp
      });

      // Reload history and analytics after prediction
      await loadHistory();
      await loadAnalytics();
    } catch (error) {
      setError(error.message);
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
      await loadAnalytics();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleDownloadHistory = () => {
    const csv = [
      ['Time', 'Emotion', 'Confidence', 'Source'],
      ...history.map(item => [
        new Date(item.timestamp).toLocaleString(),
        item.emotion,
        item.confidence.toFixed(2),
        item.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emotion_history.csv';
    a.click();
  };

  return (
    <>
      <Navbar />
      
      <main className="main-content">
        <Hero />
        
        <section className="dashboard-section" id="live-detection">
          <div className="container">
            <div className="dashboard-grid">
              <CameraCard onCapture={handleImageUpload} />
              <PredictionCard prediction={prediction} isLoading={isLoading} error={error} />
            </div>
          </div>
        </section>

        <section className="upload-section" id="image-detection">
          <div className="container">
            <div className="dashboard-grid">
              <UploadCard onUpload={handleImageUpload} />
              <PredictionCard prediction={prediction} isLoading={isLoading} error={error} />
            </div>
          </div>
        </section>

        <section className="history-section" id="history">
          <div className="container">
            <EmotionHistory 
              history={history}
              onClear={handleClearHistory}
              onDownload={handleDownloadHistory}
            />
          </div>
        </section>

        <section className="analytics-section">
          <div className="container">
            <AnalyticsDashboard analytics={analytics} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;