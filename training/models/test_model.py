import torch
from model import EmotionCNN

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = EmotionCNN().to(device)

x = torch.randn(8, 1, 48, 48).to(device)

y = model(x)

print("Input Shape :", x.shape)
print("Output Shape:", y.shape)