import copy
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt

from tqdm import tqdm

from preprocess import get_dataloaders
from model import EmotionCNN

# ==========================================
# Configuration
# ==========================================

CSV_PATH = "dataset/fer2013.csv"

BATCH_SIZE = 64
EPOCHS = 50
LEARNING_RATE = 1e-3
PATIENCE = 8

MODEL_PATH = "models/best_emotion_model.pth"

# ==========================================
# Device
# ==========================================

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print("=" * 60)
print("Device :", device)

if torch.cuda.is_available():
    print("GPU :", torch.cuda.get_device_name(0))

print("=" * 60)

# ==========================================
# Data
# ==========================================

train_loader, val_loader = get_dataloaders(
    CSV_PATH,
    batch_size=BATCH_SIZE
)

# ==========================================
# Model
# ==========================================

model = EmotionCNN().to(device)

criterion = nn.CrossEntropyLoss()

optimizer = optim.AdamW(
    model.parameters(),
    lr=LEARNING_RATE,
    weight_decay=1e-4
)

scheduler = optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="max",
    factor=0.5,
    patience=3
)

best_accuracy = 0.0
best_weights = copy.deepcopy(model.state_dict())

train_losses = []
val_losses = []

train_accs = []
val_accs = []

early_counter = 0

# ==========================================
# Training
# ==========================================

for epoch in range(EPOCHS):

    print(f"\nEpoch [{epoch+1}/{EPOCHS}]")

    model.train()

    running_loss = 0
    correct = 0
    total = 0

    loop = tqdm(train_loader)

    for images, labels in loop:

        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)

        correct += (predicted == labels).sum().item()

        loop.set_description(f"Loss {loss.item():.4f}")

    train_loss = running_loss / len(train_loader)
    train_accuracy = 100 * correct / total

    train_losses.append(train_loss)
    train_accs.append(train_accuracy)

    # ===============================
    # Validation
    # ===============================

    model.eval()

    val_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():

        for images, labels in val_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            loss = criterion(outputs, labels)

            val_loss += loss.item()

            _, predicted = torch.max(outputs, 1)

            total += labels.size(0)

            correct += (predicted == labels).sum().item()

    val_loss /= len(val_loader)
    val_accuracy = 100 * correct / total

    val_losses.append(val_loss)
    val_accs.append(val_accuracy)

    scheduler.step(val_accuracy)

    print("-" * 60)

    print(f"Train Loss : {train_loss:.4f}")
    print(f"Train Acc  : {train_accuracy:.2f}%")

    print(f"Val Loss   : {val_loss:.4f}")
    print(f"Val Acc    : {val_accuracy:.2f}%")

    current_lr = optimizer.param_groups[0]["lr"]
    print(f"Learning Rate : {current_lr:.6f}")

    # ===============================
    # Save Best Model
    # ===============================

    if val_accuracy > best_accuracy:

        best_accuracy = val_accuracy

        best_weights = copy.deepcopy(model.state_dict())

        torch.save(best_weights, MODEL_PATH)

        print("Best Model Saved!")

        early_counter = 0

    else:

        early_counter += 1

        print(f"No Improvement ({early_counter}/{PATIENCE})")

    if early_counter >= PATIENCE:

        print("\nEarly Stopping Triggered!")

        break

# ==========================================
# Training Finished
# ==========================================

print("\nTraining Finished!")

print(f"Best Validation Accuracy : {best_accuracy:.2f}%")

# ==========================================
# Plot Accuracy
# ==========================================

plt.figure(figsize=(8,5))

plt.plot(train_accs, label="Train Accuracy")
plt.plot(val_accs, label="Validation Accuracy")

plt.xlabel("Epoch")
plt.ylabel("Accuracy (%)")
plt.title("Training Accuracy")

plt.legend()

plt.grid(True)

plt.savefig("accuracy.png")

plt.close()

# ==========================================
# Plot Loss
# ==========================================

plt.figure(figsize=(8,5))

plt.plot(train_losses, label="Train Loss")
plt.plot(val_losses, label="Validation Loss")

plt.xlabel("Epoch")
plt.ylabel("Loss")

plt.title("Training Loss")

plt.legend()

plt.grid(True)

plt.savefig("loss.png")

plt.close()

print("Graphs Saved!")