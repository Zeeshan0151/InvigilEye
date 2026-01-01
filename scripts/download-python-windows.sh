#!/bin/bash

echo "⬇️ Downloading Python embeddable for Windows..."

PYTHON_VERSION="3.11.9"
PYTHON_URL="https://www.python.org/ftp/python/${PYTHON_VERSION}/python-${PYTHON_VERSION}-embed-amd64.zip"

mkdir -p python-portable/windows-python
cd python-portable/windows-python

# Download Python embeddable
if [ ! -f "python-embed.zip" ]; then
    echo "Downloading Python ${PYTHON_VERSION} embeddable..."
    curl -o python-embed.zip "$PYTHON_URL"
    unzip -q python-embed.zip
    rm python-embed.zip
    echo "✅ Python embeddable downloaded"
else
    echo "Python embeddable already exists"
fi

# Download get-pip.py
if [ ! -f "get-pip.py" ]; then
    echo "Downloading get-pip.py..."
    curl -o get-pip.py https://bootstrap.pypa.io/get-pip.py
fi

# Enable site-packages by uncommenting import site in python311._pth
if [ -f "python311._pth" ]; then
    echo "Enabling site-packages..."
    sed -i.bak 's/#import site/import site/' python311._pth || sed -i '' 's/#import site/import site/' python311._pth
    rm -f python311._pth.bak
fi

echo "✅ Windows Python setup complete"

