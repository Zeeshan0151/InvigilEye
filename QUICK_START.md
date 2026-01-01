# Quick Start Guide - Building InvigilEye Installers

## 🚀 For Developers: Creating Installers

### Prerequisites
- Node.js 18+ installed
- Python 3.11 installed
- Git
- Internet connection

### Step-by-Step: Build Installers

```bash
# 1. Clone and setup
git clone https://github.com/Zeeshan0151/InvigilEye.git
cd InvigilEye
npm install

# 2. Setup Python environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Create Python bundle for distribution
./scripts/setup-python-bundle.sh

# 4. Create compressed tarball
./scripts/create-python-tarball.sh

# 5. Upload python-portable.tar.gz to GitHub Releases
# Go to: https://github.com/Zeeshan0151/InvigilEye/releases
# Create release with tag: v1.0.0-python
# Upload: python-portable.tar.gz

# 6. Build installers
npm run build:mac    # macOS .pkg and .dmg
npm run build:win    # Windows .exe

# 7. Find your installers in dist/
```

---

## 📥 For End Users: Installing InvigilEye

### Windows Installation

1. Download `InvigilEye Setup 1.0.0.exe` (~50MB)
2. Run the installer
3. Follow installation wizard
4. During installation, AI features will download (~600MB)
5. Wait for installation to complete
6. Launch InvigilEye - ready to use!

**Note**: Internet connection required during installation.

### macOS Installation (Recommended: .pkg)

1. Download `InvigilEye-1.0.0.pkg` (~50MB)
2. Open the .pkg file
3. Follow installation wizard
4. AI features will download automatically (~600MB)
5. Installation completes
6. Launch InvigilEye from Applications - ready to use!

**Note**: Internet connection required during installation.

### macOS Installation (Alternative: .dmg)

1. Download `InvigilEye-1.0.0.dmg` (~50MB)
2. Open the .dmg file
3. Drag InvigilEye to Applications folder
4. Launch from Applications
5. App will show if AI features are missing

**Note**: For best experience, use the .pkg installer instead.

---

## 🎯 What Gets Installed

### Application Files
- **Location**: 
  - Windows: `C:\Program Files\InvigilEye\` or `C:\Users\{user}\AppData\Local\Programs\InvigilEye\`
  - macOS: `/Applications/InvigilEye.app`
- **Size**: ~50MB

### AI Bundle (Downloaded during installation)
- **Location**:
  - Windows: `C:\Users\{user}\AppData\Roaming\InvigilEye\python-portable\`
  - macOS: `~/Library/Application Support/InvigilEye/python-portable/`
- **Size**: ~1.3GB
- **Contains**: Python dependencies, PyTorch, OpenCV, YOLOv8 model

### Database
- **Location**:
  - Windows: `C:\Users\{user}\AppData\Roaming\InvigilEye\invigleye.db`
  - macOS: `~/Library/Application Support/InvigilEye/invigleye.db`
- **Size**: Grows with usage

---

## ⚡ First Launch

After installation completes:

1. Launch InvigilEye
2. App opens immediately (no waiting!)
3. Choose your role:
   - **Admin**: Login with credentials
   - **Invigilator**: Enter your email

4. Start using AI-powered monitoring! 🎉

---

## 🔄 Updating InvigilEye

### For Users

When a new version is released:
1. Download new installer
2. Run installer (will update app)
3. Python AI bundle will be reused (no re-download needed!)
4. Only updates what's changed

### For Developers

To release an update:
1. Update version in `package.json`
2. Build new installers: `npm run build:mac` / `npm run build:win`
3. Upload to GitHub Releases
4. Users download and install normally

**Note**: Only rebuild Python tarball if dependencies changed!

---

## 🗑️ Uninstalling

### Windows
1. Go to Settings > Apps > Installed Apps
2. Find "InvigilEye"
3. Click Uninstall
4. Both app and AI bundle will be removed

### macOS
1. Drag InvigilEye.app to Trash
2. App is removed
3. Optionally remove AI bundle and data:
   ```bash
   rm -rf ~/Library/Application\ Support/InvigilEye/
   ```

---

## 🆘 Need Help?

### Common Issues

**"AI Features Not Found" error**
- Python didn't download during installation
- Solution: Reinstall with active internet connection

**Installation takes a long time**
- Normal! Downloading 600MB AI bundle
- Should take 2-5 minutes depending on internet speed

**App won't open on macOS**
- Right-click app > Open (first time only)
- Or: System Settings > Privacy & Security > Open Anyway

**Camera not working**
- Grant camera permissions in system settings
- macOS: System Settings > Privacy & Security > Camera
- Windows: Settings > Privacy > Camera

### Get Support

- GitHub Issues: https://github.com/Zeeshan0151/InvigilEye/issues
- Documentation: See README.md in repository
- Email: [Your support email]

---

## 📝 System Requirements

### Minimum
- **OS**: Windows 10 64-bit or macOS 10.15+
- **RAM**: 8GB
- **Disk**: 3GB free space
- **Internet**: Required during installation
- **Camera**: Webcam for monitoring features

### Recommended
- **OS**: Windows 11 or macOS 12+
- **RAM**: 16GB
- **Disk**: 5GB free space (SSD recommended)
- **Internet**: Broadband for initial install
- **Camera**: HD webcam

---

## ✅ Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run in development | `npm start` |
| Create Python bundle | `./scripts/setup-python-bundle.sh` |
| Create tarball | `./scripts/create-python-tarball.sh` |
| Build macOS installer | `npm run build:mac` |
| Build Windows installer | `npm run build:win` |
| Build all platforms | `npm run build:all` |
| Find built installers | Check `dist/` directory |

---

**Ready to build? Start with step 1 above!** 🚀

