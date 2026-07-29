import cv2

IMAGE_PATH = "test_images/happy.png"
CASCADE_PATH = "haarcascade_frontalface_default.xml"

# Load classifier
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

# Read image
image = cv2.imread(IMAGE_PATH)

if image is None:
    print("Image not found!")
    exit()

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# Detect faces
faces = face_cascade.detectMultiScale(
    gray,
    scaleFactor=1.1,
    minNeighbors=5,
    minSize=(50, 50)
)

print(f"Faces detected: {len(faces)}")

# Draw rectangles
for (x, y, w, h) in faces:
    cv2.rectangle(
        image,
        (x, y),
        (x + w, y + h),
        (0, 255, 0),
        2
    )

cv2.imshow("Face Detection", image)

cv2.waitKey(0)

cv2.destroyAllWindows()