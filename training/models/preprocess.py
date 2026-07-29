import pandas as pd
import numpy as np

import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

# =====================================================
# Dataset Class
# =====================================================

class EmotionDataset(Dataset):

    def __init__(self, dataframe, transform=None):

        self.df = dataframe.reset_index(drop=True)
        self.transform = transform

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):

        row = self.df.iloc[idx]

        pixels = np.array(
            row["pixels"].split(),
            dtype=np.uint8
        ).reshape(48,48)

        image = transforms.ToPILImage()(pixels)

        label = int(row["emotion"])

        if self.transform:
            image = self.transform(image)

        return image, label


# =====================================================
# Transforms
# =====================================================

train_transform = transforms.Compose([

    transforms.RandomHorizontalFlip(p=0.5),

    transforms.RandomAffine(
        degrees=5,
        translate=(0.03,0.03),
        scale=(0.95,1.05)
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.5],
        std=[0.5]
    )

])


val_transform = transforms.Compose([

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.5],
        std=[0.5]
    )

])

# =====================================================
# Data Loaders
# =====================================================

def get_dataloaders(csv_path, batch_size=64):

    print("Loading FER2013...")

    df = pd.read_csv(csv_path)

    train_df = df[df["Usage"]=="Training"]

    val_df = df[df["Usage"]=="PublicTest"]

    test_df = df[df["Usage"]=="PrivateTest"]

    print(f"Training Images  : {len(train_df)}")
    print(f"Validation Images: {len(val_df)}")
    print(f"Test Images      : {len(test_df)}")

    train_dataset = EmotionDataset(
        train_df,
        train_transform
    )

    val_dataset = EmotionDataset(
        val_df,
        val_transform
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=0,
        pin_memory=torch.cuda.is_available()
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=0,
        pin_memory=torch.cuda.is_available()
    )

    return train_loader, val_loader