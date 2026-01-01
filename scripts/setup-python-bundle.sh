#!/bin/bash

echo "🐍 Setting up Python bundle for distribution..."

# Create python-portable directory
mkdir -p python-portable

# Copy Python scripts and dependencies
echo "📦 Copying Python server and model files..."
cp -r backend/python_server.py python-portable/
cp -r model python-portable/
cp requirements.txt python-portable/
cp yolov8s-pose.pt python-portable/

# Create a minimal Python environment structure
echo "📦 Creating portable Python structure..."

# For macOS, we'll use the system Python but bundle dependencies
# For Windows, we'll need the embeddable Python package

# Copy venv site-packages for bundling
echo "📦 Bundling Python dependencies..."
mkdir -p python-portable/site-packages

# Copy installed packages from venv
if [ -d "venv/lib/python3.11/site-packages" ]; then
    echo "Copying packages from venv..."
    cp -r venv/lib/python3.11/site-packages/* python-portable/site-packages/
    echo "✅ Dependencies copied"
else
    echo "❌ venv not found. Please run 'python3 -m venv venv' and install requirements first."
    exit 1
fi

# Create startup script for macOS
cat > python-portable/start-server-mac.sh << 'EOF'
#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export PYTHONPATH="$DIR/site-packages:$PYTHONPATH"
python3 "$DIR/python_server.py"
EOF
chmod +x python-portable/start-server-mac.sh

# Create startup script for Windows
cat > python-portable/start-server-win.bat << 'EOF'
@echo off
set SCRIPT_DIR=%~dp0
set PYTHONPATH=%SCRIPT_DIR%site-packages;%PYTHONPATH%
python "%SCRIPT_DIR%python_server.py"
EOF

# Create a logs directory
mkdir -p python-portable/logs

echo "✅ Python bundle setup complete!"
echo "📁 Location: python-portable/"
echo ""
echo "Next steps:"
echo "1. The bundle is ready for packaging with electron-builder"
echo "2. Bundle size: ~$(du -sh python-portable | cut -f1)"

