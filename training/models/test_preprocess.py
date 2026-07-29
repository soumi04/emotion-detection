from preprocess import get_dataloaders

CSV_PATH = "dataset/fer2013.csv"

train_loader, val_loader = get_dataloaders(
    CSV_PATH,
    batch_size=64
)

print("\nChecking one batch...")

images, labels = next(iter(train_loader))

print("Image Shape :", images.shape)
print("Label Shape :", labels.shape)
print("Labels      :", labels[:10])