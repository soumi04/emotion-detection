import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Predict emotion from image
export const predictEmotion = async (imageFile, source = 'image') => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('source', source);

    const response = await api.post('/predict', formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Prediction failed');
    }
    throw error;
  }
};

// Get prediction history
export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Clear prediction history
export const clearHistory = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/history`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get analytics data
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
