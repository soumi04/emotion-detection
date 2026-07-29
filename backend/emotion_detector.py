import cv2
import torch
import torch.nn.functional as F
import numpy as np
import time

from torchvision import transforms
from PIL import Image

from model import EmotionCNN


class EmotionDetector:

    def __init__(self):

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        self.emotions = [
            "Angry",
            "Disgust",
            "Fear",
            "Happy",
            "Sad",
            "Surprise",
            "Neutral"
        ]

        self.transform = transforms.Compose([
            transforms.Grayscale(),
            transforms.Resize((48, 48)),
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])

        self.model = EmotionCNN().to(self.device)

        self.model.load_state_dict(
            torch.load(
                "models/best_emotion_model.pth",
                map_location=self.device
            )
        )

        self.model.eval()

        self.face_detector = cv2.CascadeClassifier(
            "cascades/haarcascade_frontalface_default.xml"
        )

    def predict(self, image):

        start_time = time.time()

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # More lenient face detection parameters
        faces = self.face_detector.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(30, 30)
        )

        if len(faces) == 0:
            return None

        # Use the largest face detected
        faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
        x, y, w, h = faces[0]

        face = gray[y:y+h, x:x+w]

        face = Image.fromarray(face)

        face = self.transform(face).unsqueeze(0).to(self.device)

        with torch.no_grad():

            output = self.model(face)

            probabilities = F.softmax(output, dim=1)

            confidence, prediction = torch.max(probabilities, 1)

        inference_time = round((time.time() - start_time) * 1000, 2)

        return {
            "emotion": self.emotions[prediction.item()],
            "confidence": round(confidence.item() * 100, 2),
            "box": {
                "x": int(x),
                "y": int(y),
                "w": int(w),
                "h": int(h)
            },
            "inference_time": inference_time
        }