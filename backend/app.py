from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime
import cv2
import numpy as np

from emotion_detector import EmotionDetector

app = Flask(__name__)
CORS(app)

detector = EmotionDetector()

HISTORY_FILE = "history.json"


def load_history():
    """Load prediction history from JSON file."""
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading history: {e}")
        return []


def save_history(history):
    """Save prediction history to JSON file."""
    try:
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")


def add_to_history(prediction, source="image"):
    """Add a prediction to history."""
    history = load_history()
    history_entry = {
        "id": len(history) + 1,
        "emotion": prediction["emotion"],
        "confidence": prediction["confidence"],
        "inference_time": prediction.get("inference_time", 0),
        "timestamp": datetime.now().isoformat(),
        "source": source
    }
    history.append(history_entry)
    save_history(history)
    return history_entry


@app.route("/")
def home():
    return {
        "message": "Emotion Detection Backend Running"
    }


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({
                "error": "No image uploaded"
            }), 400

        file = request.files["image"]
        
        if file.filename == "":
            return jsonify({
                "error": "No file selected"
            }), 400

        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg'}
        if not file.filename.lower().endswith(tuple(f'.{ext}' for ext in allowed_extensions)):
            return jsonify({
                "error": "Invalid file format. Only PNG, JPG, JPEG allowed"
            }), 400

        # Read and decode image
        file_bytes = file.read()
        if len(file_bytes) == 0:
            return jsonify({
                "error": "Empty file"
            }), 400

        image = cv2.imdecode(
            np.frombuffer(file_bytes, np.uint8),
            cv2.IMREAD_COLOR
        )

        if image is None:
            return jsonify({
                "error": "Failed to decode image"
            }), 400

        result = detector.predict(image)

        if result is None:
            return jsonify({
                "error": "No face detected"
            }), 400

        # Add to history
        source = request.form.get("source", "image")
        history_entry = add_to_history(result, source)

        # Return prediction with history entry
        return jsonify({
            "emotion": result["emotion"],
            "confidence": result["confidence"],
            "box": result["box"],
            "inference_time": result["inference_time"],
            "timestamp": history_entry["timestamp"]
        })

    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500


@app.route("/history", methods=["GET"])
def get_history():
    """Get all prediction history."""
    try:
        history = load_history()
        return jsonify(history)
    except Exception as e:
        return jsonify({
            "error": f"Failed to load history: {str(e)}"
        }), 500


@app.route("/history", methods=["DELETE"])
def clear_history():
    """Clear all prediction history."""
    try:
        save_history([])
        return jsonify({
            "message": "History cleared successfully"
        })
    except Exception as e:
        return jsonify({
            "error": f"Failed to clear history: {str(e)}"
        }), 500


@app.route("/analytics", methods=["GET"])
def get_analytics():
    """Get analytics data for dashboard."""
    try:
        history = load_history()
        
        if not history:
            return jsonify({
                "totalPredictions": 0,
                "highestConfidence": 0,
                "mostFrequentEmotion": "N/A",
                "averageConfidence": 0,
                "todayPredictions": 0,
                "emotionDistribution": [
                    {"name": "Happy", "value": 0},
                    {"name": "Sad", "value": 0},
                    {"name": "Angry", "value": 0},
                    {"name": "Fear", "value": 0},
                    {"name": "Surprise", "value": 0},
                    {"name": "Neutral", "value": 0},
                    {"name": "Disgust", "value": 0}
                ],
                "confidenceOverTime": []
            })

        # Calculate analytics
        total_predictions = len(history)
        confidences = [entry["confidence"] for entry in history]
        highest_confidence = max(confidences)
        average_confidence = sum(confidences) / len(confidences)

        # Most frequent emotion
        emotion_counts = {}
        for entry in history:
            emotion = entry["emotion"]
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        most_frequent_emotion = max(emotion_counts, key=emotion_counts.get) if emotion_counts else "N/A"

        # Today's predictions
        today = datetime.now().date()
        today_predictions = sum(
            1 for entry in history 
            if datetime.fromisoformat(entry["timestamp"]).date() == today
        )

        # Emotion distribution
        emotion_distribution = [
            {"name": "Happy", "value": emotion_counts.get("Happy", 0)},
            {"name": "Sad", "value": emotion_counts.get("Sad", 0)},
            {"name": "Angry", "value": emotion_counts.get("Angry", 0)},
            {"name": "Fear", "value": emotion_counts.get("Fear", 0)},
            {"name": "Surprise", "value": emotion_counts.get("Surprise", 0)},
            {"name": "Neutral", "value": emotion_counts.get("Neutral", 0)},
            {"name": "Disgust", "value": emotion_counts.get("Disgust", 0)}
        ]

        # Confidence over time (last 20 predictions)
        confidence_over_time = [
            {
                "time": datetime.fromisoformat(entry["timestamp"]).strftime("%H:%M"),
                "confidence": entry["confidence"]
            }
            for entry in history[-20:]
        ]

        return jsonify({
            "totalPredictions": total_predictions,
            "highestConfidence": highest_confidence,
            "mostFrequentEmotion": most_frequent_emotion,
            "averageConfidence": average_confidence,
            "todayPredictions": today_predictions,
            "emotionDistribution": emotion_distribution,
            "confidenceOverTime": confidence_over_time
        })

    except Exception as e:
        return jsonify({
            "error": f"Failed to load analytics: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)