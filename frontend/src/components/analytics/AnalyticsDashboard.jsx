import { motion } from 'framer-motion';
import { FaChartBar, FaChartPie, FaChartLine, FaTrophy, FaFire, FaStar } from 'react-icons/fa';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AnalyticsDashboard.css';

const emotionColors = {
  Happy: '#22C55E',
  Sad: '#3B82F6',
  Angry: '#EF4444',
  Fear: '#A855F7',
  Surprise: '#EAB308',
  Neutral: '#6B7280',
  Disgust: '#15803D'
};

const AnalyticsDashboard = ({ analytics = null }) => {
  const defaultAnalytics = {
    totalPredictions: 0,
    highestConfidence: 0,
    mostFrequentEmotion: 'N/A',
    averageConfidence: 0,
    todayPredictions: 0,
    emotionDistribution: [
      { name: 'Happy', value: 0 },
      { name: 'Sad', value: 0 },
      { name: 'Angry', value: 0 },
      { name: 'Fear', value: 0 },
      { name: 'Surprise', value: 0 },
      { name: 'Neutral', value: 0 },
      { name: 'Disgust', value: 0 }
    ],
    confidenceOverTime: []
  };

  const data = analytics || defaultAnalytics;

  const statCards = [
    {
      icon: FaChartBar,
      label: 'Total Predictions',
      value: data.totalPredictions,
      color: 'var(--primary)'
    },
    {
      icon: FaTrophy,
      label: 'Highest Confidence',
      value: `${data.highestConfidence.toFixed(1)}%`,
      color: 'var(--secondary)'
    },
    {
      icon: FaFire,
      label: 'Most Frequent',
      value: data.mostFrequentEmotion,
      color: 'var(--accent)'
    },
    {
      icon: FaStar,
      label: 'Avg Confidence',
      value: `${data.averageConfidence.toFixed(1)}%`,
      color: '#22C55E'
    }
  ];

  return (
    <motion.div
      className="analytics-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="analytics-header">
        <div className="analytics-title">
          <FaChartBar className="title-icon" />
          <h3>Analytics Dashboard</h3>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ color: stat.color }}>
              <stat.icon />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="chart-header">
            <FaChartPie className="chart-icon" />
            <h4>Emotion Distribution</h4>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.emotionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={emotionColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="chart-header">
            <FaChartLine className="chart-icon" />
            <h4>Confidence Over Time</h4>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.confidenceOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="chart-card full-width"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="chart-header">
          <FaChartBar className="chart-icon" />
          <h4>Emotion Frequency</h4>
        </div>
        <div className="chart-content">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.emotionDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.emotionDistribution.map((entry, index) => (
                <Bar
                  key={entry.name}
                  dataKey="value"
                  fill={emotionColors[entry.name]}
                  name={entry.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
