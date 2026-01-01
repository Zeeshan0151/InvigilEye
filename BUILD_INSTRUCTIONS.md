# Build Instructions for InvigilEye

This guide explains how to build installers for InvigilEye with the bundled Python AI server.

## Prerequisites

### For All Platforms
- Node.js 18+ and npm
- Python 3.11
- Git

### Platform-Specific
- **macOS**: Xcode Command Line Tools
- **Windows**: Windows 10/11, Visual Studio Build Tools (optional)
- **Linux**: Standard build tools (`build-essential`)

## Setup Steps

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Zeeshan0151/InvigilEye.git
cd InvigilEye
npm install
```

### 2. Setup Python Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Create Python Bundle for Distribution

**⚠️ IMPORTANT: This must be done before building!**

```bash
# Make script executable (macOS/Linux)
chmod +x scripts/setup-python-bundle.sh

# Run the bundle setup
./scripts/setup-python-bundle.sh
```

This creates a `python-portable/` directory (~1.3GB) with:
- Python AI server
- YOLOv8 model files
- All Python dependencies (PyTorch, OpenCV, Ultralytics, etc.)

**Note**: `python-portable/` is excluded from git due to its size. You must create it locally before building.

### 4. Build the Installer

#### Build for Current Platform
```bash
npm run build
```

#### Build for Specific Platform
```bash
# macOS (Universal: Intel + Apple Silicon)
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

#### Build for All Platforms
```bash
npm run build:all
```

### 5. Find Your Installer

Installers are created in the `dist/` directory:
- **macOS**: `InvigilEye-1.0.0.dmg` (Universal) or `InvigilEye-1.0.0-arm64.dmg` (Apple Silicon)
- **Windows**: `InvigilEye Setup 1.0.0.exe`
- **Linux**: `InvigilEye-1.0.0.AppImage`

## Testing the Build

### Test in Development Mode
```bash
npm start
```

This runs all services (React, Express, Python AI) and opens Electron.

### Test the Installer
1. Install the built app from `dist/`
2. Open the app
3. Navigate to the Monitoring page
4. Verify the AI camera stream works

## Troubleshooting

### Python Bundle Not Found
**Error**: "Python server failed to start" in production

**Solution**: Run `./scripts/setup-python-bundle.sh` before building

### Bundle Size Too Large
The `python-portable/` directory is ~1.3GB, making the installer:
- **macOS DMG**: ~600MB
- **Windows EXE**: ~550MB
- **Linux AppImage**: ~650MB

This is normal due to bundling PyTorch and all AI dependencies.

### Build Fails on Windows
Ensure you have:
- Python 3.11 installed
- Windows SDK or Visual Studio Build Tools
- Run PowerShell as Administrator

### Build Fails on macOS
Ensure you have:
- Xcode Command Line Tools: `xcode-select --install`
- Python 3.11: `brew install python@3.11`

## GitHub Actions Build

The repository includes a GitHub Actions workflow that builds for Windows and macOS automatically.

**Note**: The workflow requires you to:
1. Create `python-portable/` on your local machine
2. Upload it as a release asset manually, OR
3. Modify the workflow to create the bundle during CI

Currently, manual bundle creation is recommended due to size.

## File Structure After Build

```
InvigilEye/
├── dist/                          # Built installers
│   ├── InvigilEye-1.0.0.dmg      # macOS installer
│   └── InvigilEye Setup 1.0.0.exe # Windows installer
├── python-portable/               # Bundled Python (1.3GB, gitignored)
│   ├── python_server.py
│   ├── model/
│   ├── site-packages/
│   └── yolov8s-pose.pt
├── backend/                       # Express backend
├── renderer/                      # React frontend
├── main/                          # Electron main process
└── venv/                          # Development Python env (gitignored)
```

## Clean Build

To perform a clean build:

```bash
# Remove old build artifacts
rm -rf dist/
rm -rf renderer/dist/
rm -rf python-portable/

# Recreate Python bundle
./scripts/setup-python-bundle.sh

# Build
npm run build
```

## CI/CD Notes

For automated builds via GitHub Actions:
1. The Python bundle is too large to commit to git
2. Options:
   - Store bundle in GitHub Releases and download during CI
   - Build bundle during CI (adds ~5 minutes to build time)
   - Use Git LFS for the bundle (requires LFS quota)

Currently, the workflow builds without the Python server. To include it, add a step to create the bundle before the build step.

