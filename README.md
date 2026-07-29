# Facial Emotion Recognition System

A real-time facial emotion recognition application built with deep learning and modern web technologies. The system uses a Convolutional Neural Network (CNN) to detect 7 different emotions from facial expressions in images and webcam feeds.

## Features

- **Real-time Emotion Detection** via webcam
- **Image Upload** for static emotion analysis
- **7 Emotion Classes**: Happy, Sad, Angry, Fear, Surprise, Neutral, Disgust
- **Premium UI** with glassmorphism design and smooth animations
- **Analytics Dashboard** with emotion distribution charts
- **Detection History** with search and export functionality
- **Responsive Design** for desktop, tablet, and mobile

## Tech Stack

### Backend
- **Python 3.8+**
- **Flask** - REST API server
- **PyTorch** - Deep learning framework
- **OpenCV** - Computer vision for face detection
- **NumPy** - Numerical computations

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **TailwindCSS** - Styling

## Project Structure

```
DL_Project/
├── backend/              # Flask API server
│   ├── emotion_detector.py  # CNN model and emotion detection
│   ├── app.py               # Flask application
│   ├── requirements.txt     # Python dependencies
│   └── venv/                # Virtual environment
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   ├── package.json         # Node dependencies
│   └── node_modules/        # Node packages
├── training/             # Model training scripts and data
│   ├── train.py            # Training script
│   ├── model.py            # CNN architecture
│   └── data/               # Training dataset
└── README.md             # This file
```

## Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Download the pre-trained model:**
   - Place the trained model file (`emotion_cnn.pth`) in the `backend/` directory
   - If you don't have the model, you can train it using the scripts in the `training/` folder

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Activate the virtual environment** (if not already active):
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

   The backend will start on `http://localhost:5000`

### Start the Frontend

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to `http://localhost:5173`

## CNN Architecture

The emotion recognition model uses a custom Convolutional Neural Network (CNN) architecture designed specifically for facial emotion detection from grayscale images.

### Model Architecture

```
Input (48×48 grayscale)
    ↓
Stem Layer (Conv 3×3, 64 filters)
    ↓
Residual Block × 4
    ├── Conv 3×3, 128 filters
    ├── Batch Normalization
    ├── ReLU Activation
    ├── Conv 3×3, 128 filters
    ├── Batch Normalization
    └── Skip Connection
    ↓
Adaptive Average Pooling
    ↓
Flatten
    ↓
Fully Connected Layer (512 units)
    ↓
Dropout (0.5)
    ↓
Output Layer (7 units - one per emotion)
    ↓
Softmax Activation
```

### Key Concepts

#### 1. **Convolutional Layers**
Convolutional layers apply learnable filters to the input image to extract features. Early layers detect simple features like edges and textures, while deeper layers detect complex patterns like facial expressions.

#### 2. **Residual Connections**
The model uses residual blocks with skip connections. These connections help:
- Prevent vanishing gradients in deep networks
- Allow gradients to flow directly through the network
- Enable training of very deep architectures

#### 3. **Batch Normalization**
Applied after each convolution, batch normalization:
- Normalizes layer inputs to have zero mean and unit variance
- Stabilizes and accelerates training
- Reduces internal covariate shift

#### 4. **Adaptive Pooling**
Adaptive Average Pooling converts feature maps of any size to a fixed size, allowing the model to accept input images of varying dimensions.

#### 5. **Dropout**
Dropout randomly deactivates neurons during training to:
- Prevent overfitting
- Improve model generalization
- Force the network to learn redundant representations

#### 6. **Softmax Activation**
The final layer uses softmax to convert the network's outputs into probability distributions across the 7 emotion classes.

### Why Residual Networks?

Residual networks (ResNets) are particularly effective for emotion recognition because:
- They can learn very deep representations without degradation
- Skip connections preserve fine-grained facial features
- They're robust to the vanishing gradient problem
- They converge faster during training

## Dataset

### FER-2013 Dataset

The model is trained on the **FER-2013** (Facial Expression Recognition) dataset, which is a widely used benchmark for facial emotion recognition.

### Dataset Statistics

- **Total Images**: 35,887 grayscale facial images
- **Image Size**: 48×48 pixels
- **Emotion Classes**: 7
  - Happy (8,989 images)
  - Sad (6,078 images)
  - Fear (5,121 images)
  - Disgust (4,363 images)
  - Angry (4,921 images)
  - Surprise (4,002 images)
  - Neutral (6,193 images)

### Data Distribution

The dataset is split into:
- **Training Set**: 28,709 images (80%)
- **Validation Set**: 3,589 images (10%)
- **Test Set**: 3,589 images (10%)

### Data Characteristics

- All images are grayscale (single channel)
- Faces are already cropped and centered
- Images vary in lighting conditions and head poses
- Some images include occlusions (glasses, hands, etc.)

### Data Augmentation

To improve model generalization, the training data is augmented with:
- Random horizontal flips
- Random rotations (±10 degrees)
- Random brightness adjustments
- Random contrast adjustments
- Random zoom (±10%)

## Model Training

If you want to train the model from scratch:

1. **Navigate to the training directory:**
   ```bash
   cd training
   ```

2. **Download the FER-2013 dataset** from Kaggle and place it in the `data/` folder

3. **Run the training script:**
   ```bash
   python train.py
   ```

4. **The trained model will be saved** as `emotion_cnn.pth`

### Training Hyperparameters

- **Batch Size**: 64
- **Learning Rate**: 0.001 (with Adam optimizer)
- **Epochs**: 50
- **Loss Function**: Cross-Entropy Loss
- **Optimizer**: Adam with weight decay (L2 regularization)

## API Endpoints

### POST `/predict`
Predict emotion from an uploaded image.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` file

**Response:**
```json
{
  "emotion": "Happy",
  "confidence": 95.2,
  "inference_time": 0.045,
  "timestamp": "2024-01-15T10:30:00"
}
```

### GET `/history`
Get all emotion prediction history.

**Response:**
```json
[
  {
    "id": 1,
    "emotion": "Happy",
    "confidence": 95.2,
    "source": "camera",
    "timestamp": "2024-01-15T10:30:00"
  }
]
```

### DELETE `/history`
Clear all prediction history.

### GET `/analytics`
Get analytics statistics.

**Response:**
```json
{
  "total_predictions": 150,
  "highest_confidence": 98.5,
  "most_frequent_emotion": "Happy",
  "average_confidence": 87.3,
  "today_predictions": 12,
  "emotion_distribution": [...],
  "confidence_over_time": [...]
}
```

## Troubleshooting

### Backend Issues

**Issue:** Camera not working
- **Solution:** Ensure your webcam is not in use by another application
- Check browser permissions for camera access

**Issue:** "No face detected" error
- **Solution:** Ensure your face is well-lit and clearly visible in the camera frame
- The face detection uses OpenCV's Haar Cascade classifier

**Issue:** Model file not found
- **Solution:** Ensure `emotion_cnn.pth` is in the `backend/` directory
- Train the model using the scripts in the `training/` folder

### Frontend Issues

**Issue:** Build errors
- **Solution:** Delete `node_modules` and run `npm install` again
- Clear the Vite cache: `npm run dev -- --force`

**Issue:** API connection errors
- **Solution:** Ensure the backend is running on `http://localhost:5000`
- Check CORS settings in `backend/app.py`

## Performance

- **Inference Time**: ~40-60ms per image
- **Model Size**: ~15MB
- **Accuracy**: ~65-70% on FER-2013 test set
- **Real-time Processing**: Supports 15-25 FPS on webcam

## Future Improvements

- [ ] Add support for video file emotion detection
- [ ] Implement multi-face detection in single frame
- [ ] Add emotion intensity estimation
- [ ] Support for custom model training
- [ ] Mobile app version
- [ ] WebRTC for real-time streaming

## License

This project is for educational purposes. The FER-2013 dataset is available for research use.

## Credits

- **FER-2013 Dataset**: Kaggle Facial Expression Recognition Challenge
- **PyTorch**: Deep learning framework
- **OpenCV**: Computer vision library
- **React**: UI framework

## Contact

For questions or issues, please open an issue on the repository.
