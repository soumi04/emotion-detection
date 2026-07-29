import torch
import torch.nn as nn


# =====================================================
# Residual Block
# =====================================================

class ResidualBlock(nn.Module):

    def __init__(self, in_channels, out_channels, stride=1):

        super().__init__()

        self.conv1 = nn.Conv2d(
            in_channels,
            out_channels,
            kernel_size=3,
            stride=stride,
            padding=1,
            bias=False
        )

        self.bn1 = nn.BatchNorm2d(out_channels)

        self.relu = nn.ReLU(inplace=True)

        self.conv2 = nn.Conv2d(
            out_channels,
            out_channels,
            kernel_size=3,
            padding=1,
            bias=False
        )

        self.bn2 = nn.BatchNorm2d(out_channels)

        self.shortcut = nn.Sequential()

        if stride != 1 or in_channels != out_channels:

            self.shortcut = nn.Sequential(

                nn.Conv2d(
                    in_channels,
                    out_channels,
                    kernel_size=1,
                    stride=stride,
                    bias=False
                ),

                nn.BatchNorm2d(out_channels)

            )

    def forward(self, x):

        identity = self.shortcut(x)

        out = self.conv1(x)
        out = self.bn1(out)
        out = self.relu(out)

        out = self.conv2(out)
        out = self.bn2(out)

        out += identity

        out = self.relu(out)

        return out


# =====================================================
# Emotion CNN
# =====================================================

class EmotionCNN(nn.Module):

    def __init__(self):

        super().__init__()

        self.stem = nn.Sequential(

            nn.Conv2d(
                1,
                64,
                kernel_size=3,
                padding=1,
                bias=False
            ),

            nn.BatchNorm2d(64),

            nn.ReLU(inplace=True)

        )

        self.layer1 = nn.Sequential(

            ResidualBlock(64, 64),

            nn.MaxPool2d(2)

        )

        self.layer2 = nn.Sequential(

            ResidualBlock(64, 128, stride=1),

            nn.MaxPool2d(2)

        )

        self.layer3 = nn.Sequential(

            ResidualBlock(128, 256, stride=1),

            nn.MaxPool2d(2)

        )

        self.layer4 = ResidualBlock(256, 512)

        self.pool = nn.AdaptiveAvgPool2d((1, 1))

        self.classifier = nn.Sequential(

            nn.Flatten(),

            nn.Dropout(0.5),

            nn.Linear(512, 256),

            nn.ReLU(inplace=True),

            nn.Dropout(0.3),

            nn.Linear(256, 7)

        )

    def forward(self, x):

        x = self.stem(x)

        x = self.layer1(x)

        x = self.layer2(x)

        x = self.layer3(x)

        x = self.layer4(x)

        x = self.pool(x)

        x = self.classifier(x)

        return x