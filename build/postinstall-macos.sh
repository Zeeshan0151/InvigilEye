#!/bin/bash

# macOS Post-Install Script for InvigilEye
# This script downloads the Python AI bundle after installation

PYTHON_DOWNLOAD_URL="https://github.com/Zeeshan0151/InvigilEye/releases/download/v1.0.0-python/python-portable.tar.gz"
INSTALL_DIR="$HOME/Library/Application Support/InvigilEye"
PYTHON_DIR="$INSTALL_DIR/python-portable"

echo "=========================================="
echo "InvigilEye - Setting up AI Features"
echo "=========================================="
echo ""

# Create directories
mkdir -p "$INSTALL_DIR"
mkdir -p "$PYTHON_DIR"

# Check if Python bundle already exists
if [ -f "$PYTHON_DIR/python_server.py" ]; then
    echo "✓ AI bundle already installed"
    exit 0
fi

echo "Downloading AI bundle (600MB)..."
echo "This may take a few minutes..."
echo ""

# Download with curl (shows progress)
if curl -L -# -o "$INSTALL_DIR/python-portable.tar.gz" "$PYTHON_DOWNLOAD_URL"; then
    echo ""
    echo "✓ Download completed"
    echo "Extracting AI bundle..."
    
    # Extract with tar
    if tar -xzf "$INSTALL_DIR/python-portable.tar.gz" -C "$PYTHON_DIR"; then
        echo "✓ AI bundle installed successfully"
        
        # Clean up
        rm "$INSTALL_DIR/python-portable.tar.gz"
        
        echo ""
        echo "=========================================="
        echo "Setup Complete!"
        echo "InvigilEye is ready to use."
        echo "=========================================="
        exit 0
    else
        echo "✗ Extraction failed"
        echo "AI bundle will be downloaded on first launch."
        rm "$INSTALL_DIR/python-portable.tar.gz"
        exit 1
    fi
else
    echo ""
    echo "✗ Download failed"
    echo "AI bundle will be downloaded automatically on first launch."
    exit 1
fi

