import cv2
import torch
import torch.nn.functional as F
import matplotlib.pyplot as plt

from torchvision import transforms
from model import EmotionCNN

# =====================================================
# Configuration
# =====================================================

IMAGE_PATH = "test_images/disgust.png"
MODEL_PATH = "models/best_emotion_model.pth"
CASCADE_PATH = "haarcascade_frontalface_default.xml"

CLASS_NAMES = [
    "Angry",
    "Disgust",
    "Fear",
    "Happy",
    "Sad",
    "Surprise",
    "Neutral"
]

# =====================================================
# Device
# =====================================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("=" * 60)
print("Device :", device)

if torch.cuda.is_available():
    print("GPU :", torch.cuda.get_device_name(0))

print("=" * 60)

# =====================================================
# Load Model
# =====================================================

print("Loading model...")

model = EmotionCNN().to(device)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

print("✓ Model Loaded Successfully\n")

# =====================================================
# Load Image
# =====================================================

print("Loading image...")

image = cv2.imread(IMAGE_PATH)

if image is None:
    raise FileNotFoundError(f"Cannot find image: {IMAGE_PATH}")

original = image.copy()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

print("✓ Image Loaded")

# =====================================================
# Face Detection
# =====================================================

print("Detecting faces...")

face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

faces = face_cascade.detectMultiScale(
    gray,
    scaleFactor=1.1,
    minNeighbors=5,
    minSize=(50, 50)
)

if len(faces) == 0:
    print("No face detected!")
    exit()

print(f"✓ Faces Detected : {len(faces)}")

# First face
x, y, w, h = faces[0]

cv2.rectangle(
    original,
    (x, y),
    (x + w, y + h),
    (0, 255, 0),
    2
)

# =====================================================
# Crop Face
# =====================================================

print("Cropping face...")

face = gray[y:y+h, x:x+w]
face = cv2.resize(face, (48, 48))

print("✓ Face Cropped")

# =====================================================
# Preview Face
# =====================================================

plt.figure(figsize=(3, 3))
plt.imshow(face, cmap="gray")
plt.title("Detected Face (48x48)")
plt.axis("off")

# Non-blocking preview
plt.show(block=False)
plt.pause(2)
plt.close()

print("✓ Face Preview Closed")

# =====================================================
# Transform
# =====================================================

print("Transforming image...")

transform = transforms.Compose([
    transforms.ToPILImage(),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

input_tensor = transform(face)
input_tensor = input_tensor.unsqueeze(0).to(device)

print("✓ Tensor Shape :", input_tensor.shape)

# =====================================================
# Prediction
# =====================================================

print("Running inference...")

with torch.no_grad():

    outputs = model(input_tensor)

    probabilities = F.softmax(outputs, dim=1)

print("✓ Inference Complete")

probs = probabilities.cpu().numpy()[0]

prediction = probs.argmax()
confidence = probs[prediction] * 100

# =====================================================
# Results
# =====================================================

print("\n" + "=" * 60)
print("Emotion Probabilities")
print("=" * 60)

for emotion, prob in zip(CLASS_NAMES, probs):
    print(f"{emotion:<10} : {prob*100:6.2f}%")

print("\n" + "=" * 60)
print("Final Prediction")
print("=" * 60)

print(f"Emotion    : {CLASS_NAMES[prediction]}")
print(f"Confidence : {confidence:.2f}%")

# =====================================================
# Display Final Image
# =====================================================

rgb = cv2.cvtColor(original, cv2.COLOR_BGR2RGB)

plt.figure(figsize=(6, 6))
plt.imshow(rgb)
plt.title(f"{CLASS_NAMES[prediction]} ({confidence:.2f}%)")
plt.axis("off")
plt.show()