# EmotionAI Backend

A production-ready Flask backend for facial emotion recognition using deep learning. This backend integrates with a React frontend to provide real-time emotion detection from images and webcam feeds.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [File Descriptions](#file-descriptions)
- [API Endpoints](#api-endpoints)
- [Data Flow](#data-flow)
- [Frontend Integration](#frontend-integration)
- [Setup Instructions](#setup-instructions)
- [How It Works](#how-it-works)

## 🎯 Overview

The EmotionAI backend is a Flask-based REST API that:
- Loads a pre-trained EmotionCNN model for emotion classification
- Detects faces using OpenCV's Haar Cascade
- Processes images to predict emotions (Happy, Sad, Angry, Fear, Surprise, Neutral, Disgust)
- Stores prediction history in local JSON files
- Provides analytics data for dashboard visualization
- Supports both image upload and real-time webcam inference

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  (Upload Image, Live Camera, Prediction Card, Analytics)     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/Axios
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Flask Backend                           │
│                                                               │
│  ┌──────────────┐    ┌──────────────────────────────────┐   │
│  │   app.py     │────│   emotion_detector.py            │   │
│  │              │    │                                  │   │
│  │  API Routes  │    │  - Face Detection               │   │
│  │  - /         │    │  - Image Preprocessing          │   │
│  │  - /predict  │    │  - Model Inference              │   │
│  │  - /history  │    │  - Confidence Calculation        │   │
│  │  - /analytics│    │                                  │   │
│  └──────────────┘    └──────────────────────────────────┘   │
│                         │                                     │
│                         ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    model.py                           │  │
│  │                                                       │  │
│  │  - EmotionCNN Architecture                            │  │
│  │  - Residual Blocks                                    │  │
│  │  - 7 Emotion Classes                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                     │
│                         ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          best_emotion_model.pth                       │  │
│  │          (Pre-trained Weights)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          history.json (Local Storage)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Folder Structure

```
backend/
├── app.py                      # Main Flask application with API routes
├── emotion_detector.py         # Face detection and emotion prediction logic
├── model.py                    # EmotionCNN neural network architecture
├── requirements.txt            # Python dependencies
├── history.json               # Local storage for prediction history
├── uploads/                   # Temporary folder for uploaded images
├── models/
│   └── best_emotion_model.pth # Pre-trained emotion recognition model
├── cascades/
│   └── haarcascade_frontalface_default.xml  # OpenCV face detection
└── venv/                      # Python virtual environment (optional)
```

## 📄 File Descriptions

### `app.py` - Main Flask Application

**Purpose**: Central API server that handles HTTP requests and coordinates emotion detection.

**Key Components**:
- **Flask App Setup**: Initializes Flask with CORS enabled for frontend communication
- **Detector Initialization**: Loads `EmotionDetector` once at startup (model loaded only once)
- **History Management**: Functions to load/save prediction history from/to JSON file
- **API Endpoints**: RESTful routes for health check, prediction, history, and analytics

**Important Functions**:
```python
load_history()        # Loads prediction history from history.json
save_history()        # Saves prediction history to history.json
add_to_history()      # Adds new prediction to history with timestamp
```

**Why It Matters**: This is the entry point for all frontend requests. It handles validation, error handling, and coordinates between the API and the emotion detection logic.

---

### `emotion_detector.py` - Emotion Detection Logic

**Purpose**: Handles face detection, image preprocessing, and emotion prediction using the trained model.

**Key Components**:
- **Device Selection**: Automatically uses CUDA if available, falls back to CPU
- **Model Loading**: Loads EmotionCNN with pre-trained weights
- **Face Detection**: Uses OpenCV Haar Cascade to detect faces
- **Image Preprocessing**: Converts to grayscale, resizes to 48×48, normalizes
- **Prediction**: Runs inference and returns emotion with confidence

**Important Functions**:
```python
__init__()            # Initializes detector, loads model and cascade
predict(image)        # Main prediction function
                      # - Detects face
                      # - Crops and preprocesses
                      # - Runs model inference
                      # - Returns emotion, confidence, box, inference_time
```

**Emotion Classes**: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral

**Why It Matters**: This is the core AI logic. It bridges computer vision (face detection) with deep learning (emotion classification) and provides the actual predictions.

---

### `model.py` - Neural Network Architecture

**Purpose**: Defines the EmotionCNN architecture used for emotion classification.

**Key Components**:
- **ResidualBlock**: Building block with skip connections for better gradient flow
- **EmotionCNN**: Main network architecture
  - Stem: Initial convolution + batch normalization
  - Layers 1-3: Residual blocks with max pooling
  - Layer 4: Final residual block
  - Pool: Adaptive average pooling
  - Classifier: Fully connected layers with dropout

**Architecture Flow**:
```
Input (48×48 grayscale)
    ↓
Stem (Conv+BN+ReLU)
    ↓
Layer 1 (ResidualBlock + MaxPool)
    ↓
Layer 2 (ResidualBlock + MaxPool)
    ↓
Layer 3 (ResidualBlock + MaxPool)
    ↓
Layer 4 (ResidualBlock)
    ↓
AdaptiveAvgPool
    ↓
Classifier (Flatten + Dropout + FC + ReLU + Dropout + FC)
    ↓
Output (7 emotion classes)
```

**Why It Matters**: This architecture was trained on emotion datasets and achieves high accuracy. The model must match this exact architecture for the pre-trained weights to load correctly.

---

### `requirements.txt` - Dependencies

**Purpose**: Lists all Python packages needed to run the backend.

**Key Dependencies**:
- `Flask` - Web framework for API
- `flask-cors` - Enables cross-origin requests from frontend
- `torch` - PyTorch for deep learning
- `torchvision` - Image transformations
- `opencv-python` - Computer vision and face detection
- `numpy` - Numerical operations
- `Pillow` - Image processing

---

### `history.json` - Local Storage

**Purpose**: Stores all prediction history locally (no database required).

**Structure**:
```json
[
  {
    "id": 1,
    "emotion": "Happy",
    "confidence": 96.42,
    "inference_time": 45.2,
    "timestamp": "2026-07-29T19:45:12.123456",
    "source": "image"
  }
]
```

**Why It Matters**: Provides persistent storage for predictions without requiring a database. Used for history table and analytics calculations.

---

### `models/best_emotion_model.pth` - Pre-trained Model

**Purpose**: Contains the trained weights for EmotionCNN.

**Details**:
- File size: ~20MB
- Trained on emotion datasets
- Loaded once at startup
- Uses CUDA if available

**Why It Matters**: This is the actual "brain" of the system. The model architecture in `model.py` must match exactly for these weights to load.

---

### `cascades/haarcascade_frontalface_default.xml` - Face Detection

**Purpose**: OpenCV pre-trained Haar Cascade for frontal face detection.

**Details**:
- Detects faces in images
- Returns bounding box coordinates (x, y, width, height)
- Used to crop faces before emotion prediction

**Why It Matters**: Ensures only faces (not background) are sent to the emotion model, improving accuracy.

---

## 🔌 API Endpoints

### 1. Health Check
**Endpoint**: `GET /`

**Purpose**: Verify backend is running

**Response**:
```json
{
  "message": "Emotion Detection Backend Running"
}
```

---

### 2. Emotion Prediction
**Endpoint**: `POST /predict`

**Purpose**: Predict emotion from uploaded image

**Request**: Multipart form-data
- `image`: File (PNG, JPG, JPEG)
- `source`: String (optional, "image" or "camera")

**Success Response** (200):
```json
{
  "emotion": "Happy",
  "confidence": 96.42,
  "box": {
    "x": 120,
    "y": 88,
    "w": 180,
    "h": 180
  },
  "inference_time": 45.2,
  "timestamp": "2026-07-29T19:45:12.123456"
}
```

**Error Responses**:
- `400` - No image uploaded
- `400` - Invalid file format
- `400` - No face detected
- `500` - Internal server error

---

### 3. Get History
**Endpoint**: `GET /history`

**Purpose**: Retrieve all prediction history

**Response** (200):
```json
[
  {
    "id": 1,
    "emotion": "Happy",
    "confidence": 96.42,
    "inference_time": 45.2,
    "timestamp": "2026-07-29T19:45:12.123456",
    "source": "image"
  }
]
```

---

### 4. Clear History
**Endpoint**: `DELETE /history`

**Purpose**: Clear all prediction history

**Response** (200):
```json
{
  "message": "History cleared successfully"
}
```

---

### 5. Get Analytics
**Endpoint**: `GET /analytics`

**Purpose**: Get analytics data for dashboard

**Response** (200):
```json
{
  "totalPredictions": 150,
  "highestConfidence": 99.2,
  "mostFrequentEmotion": "Happy",
  "averageConfidence": 87.5,
  "todayPredictions": 25,
  "emotionDistribution": [
    {"name": "Happy", "value": 45},
    {"name": "Sad", "value": 20},
    {"name": "Angry", "value": 15},
    {"name": "Fear", "value": 10},
    {"name": "Surprise", "value": 25},
    {"name": "Neutral", "value": 30},
    {"name": "Disgust", "value": 5}
  ],
  "confidenceOverTime": [
    {"time": "19:45", "confidence": 96.42},
    {"time": "19:46", "confidence": 89.75}
  ]
}
```

---

## 🔄 Data Flow

### Image Upload Flow

```
1. User selects image in React Frontend
   ↓
2. Frontend sends POST /predict with image file
   ↓
3. Flask app.py receives request
   ↓
4. Validates file format and content
   ↓
5. Calls emotion_detector.predict(image)
   ↓
6. emotion_detector:
   - Converts to grayscale
   - Detects face using Haar Cascade
   - Crops face region
   - Resizes to 48×48
   - Normalizes pixel values
   - Passes through EmotionCNN model
   - Applies softmax to get probabilities
   - Returns emotion with highest confidence
   ↓
7. app.py adds prediction to history.json
   ↓
8. Returns JSON response to frontend
   ↓
9. Frontend updates Prediction Card
   ↓
10. Frontend reloads history and analytics
```

### Webcam Flow

```
1. User starts camera in React Frontend
   ↓
2. Frontend captures video frame
   ↓
3. Converts frame to blob/file
   ↓
4. Sends POST /predict with frame (source="camera")
   ↓
5. Same processing as image upload
   ↓
6. Returns prediction to frontend
   ↓
7. Frontend updates UI in real-time
```

---

## 🔗 Frontend Integration

### API Service (`frontend/src/services/api.js`)

The frontend uses Axios to communicate with the backend:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Predict emotion
export const predictEmotion = async (imageFile, source = 'image') => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('source', source);
  
  const response = await axios.post(`${API_BASE_URL}/predict`, formData);
  return response.data;
};

// Get history
export const getHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  return response.data;
};

// Clear history
export const clearHistory = async () => {
  const response = await axios.delete(`${API_BASE_URL}/history`);
  return response.data;
};

// Get analytics
export const getAnalytics = async () => {
  const response = await axios.get(`${API_BASE_URL}/analytics`);
  return response.data;
};
```

### Home Component Integration

```javascript
import { predictEmotion, getHistory, clearHistory, getAnalytics } from '../services/api';

// Load history on mount
useEffect(() => {
  loadHistory();
  loadAnalytics();
}, []);

// Handle image upload
const handleImageUpload = async (file) => {
  setIsLoading(true);
  try {
    const result = await predictEmotion(file, 'image');
    setPrediction(result);
    await loadHistory();  // Reload after prediction
    await loadAnalytics();
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Component Communication

```
Home.jsx (Parent)
    ↓
    ├── UploadCard.jsx → onUpload → predictEmotion()
    ├── CameraCard.jsx → onCapture → predictEmotion()
    ├── PredictionCard.jsx ← prediction state
    ├── EmotionHistory.jsx ← history state
    └── AnalyticsDashboard.jsx ← analytics state
```

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11 or higher
- pip package manager

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify model files exist**:
   - `models/best_emotion_model.pth`
   - `cascades/haarcascade_frontalface_default.xml`

5. **Start the server**:
   ```bash
   python app.py
   ```

6. **Server will start on**:
   ```
   http://localhost:5000
   ```

### Testing

1. **Health check**:
   ```bash
   curl http://localhost:5000/
   ```

2. **Test prediction** (using curl or Postman):
   ```bash
   curl -X POST -F "image=@test.jpg" http://localhost:5000/predict
   ```

---

## 🧠 How It Works

### Complete Workflow

#### 1. **Startup Phase**
```
Backend starts
    ↓
Flask app initializes
    ↓
EmotionDetector.__init__() called
    ↓
- Selects device (CUDA/CPU)
    ↓
- Loads EmotionCNN architecture
    ↓
- Loads pre-trained weights from best_emotion_model.pth
    ↓
- Sets model to evaluation mode
    ↓
- Loads Haar Cascade for face detection
    ↓
Ready to accept requests
```

#### 2. **Prediction Request**
```
Frontend sends image
    ↓
app.py /predict endpoint
    ↓
Validates file (format, size, content)
    ↓
Decodes image using OpenCV
    ↓
Calls detector.predict(image)
    ↓
emotion_detector.py:
    ↓
Converts to grayscale
    ↓
Haar Cascade detects faces
    ↓
If no face → return None
    ↓
If face found → crop to bounding box
    ↓
Resize to 48×48
    ↓
Normalize to [-1, 1]
    ↓
Convert to tensor
    ↓
Add batch dimension
    ↓
Move to device (CUDA/CPU)
    ↓
Forward pass through EmotionCNN
    ↓
Apply softmax to get probabilities
    ↓
Find max probability and corresponding emotion
    ↓
Calculate inference time
    ↓
Return: {emotion, confidence, box, inference_time}
    ↓
app.py adds to history.json
    ↓
Returns JSON to frontend
```

#### 3. **History Management**
```
After successful prediction
    ↓
add_to_history() called
    ↓
Loads existing history from history.json
    ↓
Creates new entry with:
    - ID
    - Emotion
    - Confidence
    - Inference time
    - Timestamp (ISO format)
    - Source (image/camera)
    ↓
Appends to history array
    ↓
Saves back to history.json
    ↓
Frontend can now fetch updated history
```

#### 4. **Analytics Calculation**
```
Frontend requests /analytics
    ↓
app.py loads history from history.json
    ↓
Calculates:
    - Total predictions (array length)
    - Highest confidence (max of confidences)
    - Most frequent emotion (mode of emotions)
    - Average confidence (mean of confidences)
    - Today's predictions (filter by date)
    - Emotion distribution (count per emotion)
    - Confidence over time (last 20 predictions)
    ↓
Returns analytics object
    ↓
Frontend uses data for:
    - Stat cards
    - Pie chart (distribution)
    - Bar chart (frequency)
    - Line chart (confidence over time)
```

### Key Design Decisions

1. **Model Loading Once**: The model is loaded only at startup to avoid reloading for each request, improving performance.

2. **Local JSON Storage**: Uses `history.json` instead of a database for simplicity and portability. No database setup required.

3. **CUDA/CPU Fallback**: Automatically uses GPU if available for faster inference, falls back to CPU otherwise.

4. **Face Detection First**: Detects faces before emotion prediction to ensure only face regions are analyzed, improving accuracy.

5. **Error Handling**: Comprehensive error handling for missing files, invalid formats, no faces, and server errors.

6. **CORS Enabled**: Allows frontend running on different port to communicate with backend.

7. **Inference Time Tracking**: Measures and returns actual inference time for performance monitoring.

### Performance Optimizations

- **torch.no_grad()**: Disables gradient calculation during inference for faster execution
- **Model in eval mode**: Disables dropout and batch norm updates
- **Single model load**: Model loaded once, reused for all predictions
- **Efficient preprocessing**: Uses OpenCV and PyTorch transforms for fast image processing

---

## 🎯 Frontend-Backend Communication Summary

### What Frontend Sends:
- Image files (multipart form-data)
- Source indicator ("image" or "camera")

### What Backend Returns:
- Emotion label (string)
- Confidence percentage (float)
- Face bounding box (x, y, w, h)
- Inference time in milliseconds (float)
- Timestamp (ISO string)

### Data Persistence:
- Backend stores predictions in `history.json`
- Frontend fetches history via GET /history
- Frontend can clear history via DELETE /history
- Analytics calculated from history in real-time

### Real-time Updates:
1. Frontend uploads/captures image
2. Backend processes and returns prediction
3. Backend saves to history.json
4. Frontend reloads history and analytics
5. UI更新 with new data

This architecture provides a complete, production-ready facial emotion recognition system with real-time capabilities, persistent storage, and comprehensive analytics.
