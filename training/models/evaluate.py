import torch
import matplotlib.pyplot as plt
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    accuracy_score
)

from preprocess import get_dataloaders
from model import EmotionCNN


# =====================================
# Configuration
# =====================================

CSV_PATH = "dataset/fer2013.csv"
MODEL_PATH = "models/best_emotion_model.pth"

CLASS_NAMES = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]


# =====================================
# Device
# =====================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("Using:", device)

# =====================================
# Load Data
# =====================================

_, val_loader = get_dataloaders(
    CSV_PATH,
    batch_size=64
)

# =====================================
# Load Model
# =====================================

model = EmotionCNN().to(device)

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))

model.eval()

print("Model Loaded Successfully")


# =====================================
# Prediction
# =====================================

all_labels = []
all_predictions = []

with torch.no_grad():

    for images, labels in val_loader:

        images = images.to(device)

        outputs = model(images)

        _, predicted = torch.max(outputs, 1)

        all_labels.extend(labels.numpy())

        all_predictions.extend(predicted.cpu().numpy())


# =====================================
# Accuracy
# =====================================

accuracy = accuracy_score(
    all_labels,
    all_predictions
)

print("\nOverall Accuracy")

print(f"{accuracy*100:.2f}%")

# =====================================
# Classification Report
# =====================================

print("\nClassification Report\n")

print(classification_report(
    all_labels,
    all_predictions,
    target_names=CLASS_NAMES
))

# =====================================
# Confusion Matrix
# =====================================

cm = confusion_matrix(
    all_labels,
    all_predictions
)

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=CLASS_NAMES
)

plt.figure(figsize=(9, 9))

disp.plot(cmap="Blues", xticks_rotation=45)

plt.title("FER2013 Confusion Matrix")

plt.tight_layout()

plt.show()