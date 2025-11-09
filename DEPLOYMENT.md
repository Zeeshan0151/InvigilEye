# InvigilEye - Deployment Guide

This guide explains how to create installers for Windows, macOS, and Linux.

---

## 🚨 Important: Cross-Platform Building Limitations

Due to **better-sqlite3** being a native module, there are limitations for cross-platform builds:

| Build From | Can Build For |
|------------|---------------|
| Windows    | ✅ Windows, ❌ macOS, ❌ Linux |
| macOS      | ✅ macOS, ❌ Windows*, ❌ Linux |
| Linux      | ✅ Linux, ❌ Windows, ❌ macOS |

**Note:** Cross-platform builds with native dependencies require complex setups (Docker/Wine) or CI/CD services.

---

## 📦 Building Installers

### Option 1: Build on Target Platform (Recommended)

#### On Windows Machine

```bash
# Clone and setup
git clone <repository-url>
cd invigleye
npm install

# Build Windows installer
npm run build:win

# Output: dist/InvigilEye Setup 1.0.0.exe
```

#### On macOS Machine

```bash
# Clone and setup
git clone <repository-url>
cd invigleye
npm install

# Build macOS installer
npm run build:mac

# Output: dist/InvigilEye-1.0.0.dmg
```

#### On Linux Machine

```bash
# Clone and setup
git clone <repository-url>
cd invigleye
npm install

# Build Linux installer
npm run build:linux

# Output: dist/InvigilEye-1.0.0.AppImage
```

---

## 🤖 Option 2: Automated Builds with GitHub Actions

The project includes a GitHub Actions workflow that automatically builds for all platforms.

### Setup:

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **GitHub Actions will automatically:**
   - Build Windows `.exe` installer
   - Build macOS `.dmg` installer
   - Build Linux `.AppImage` installer

3. **Download installers:**
   - Go to your GitHub repository
   - Click "Actions" tab
   - Click on the latest workflow run
   - Download artifacts (installers) from the bottom of the page

### Manual Trigger:

You can also manually trigger builds:
1. Go to "Actions" tab on GitHub
2. Select "Build Installers" workflow
3. Click "Run workflow"
4. Wait for builds to complete
5. Download artifacts

---

## 📋 Build Scripts Available

```bash
# Build for current platform only
npm run build

# Build for specific platforms
npm run build:win      # Windows only
npm run build:mac      # macOS only
npm run build:linux    # Linux only

# Build for all platforms (requires setup)
npm run build:all
```

---

## 📁 Output Files

After building, installers are in the `dist/` folder:

### Windows
- `InvigilEye Setup 1.0.0.exe` - NSIS installer
- Double-click to install like any Windows application

### macOS
- `InvigilEye-1.0.0.dmg` - Disk image
- Open and drag to Applications folder

### Linux
- `InvigilEye-1.0.0.AppImage` - Portable executable
- Make executable: `chmod +x InvigilEye-1.0.0.AppImage`
- Run: `./InvigilEye-1.0.0.AppImage`

---

## 📤 Distributing to Users

### For Windows Users:

1. **Build the Windows installer** (on Windows or via GitHub Actions)
2. **Share the `.exe` file:**
   - Upload to file sharing service
   - Send via email (if size permits)
   - Host on your website
   - Use USB drive

3. **Installation Instructions:**
   ```
   1. Download InvigilEye Setup 1.0.0.exe
   2. Double-click the installer
   3. Follow installation wizard
   4. Launch InvigilEye from Start Menu
   ```

### For macOS Users:

1. **Build the macOS installer** (on macOS or via GitHub Actions)
2. **Share the `.dmg` file**
3. **Installation Instructions:**
   ```
   1. Download InvigilEye-1.0.0.dmg
   2. Open the DMG file
   3. Drag InvigilEye to Applications folder
   4. Launch from Applications or Launchpad
   ```

### For Linux Users:

1. **Build the Linux installer** (on Linux or via GitHub Actions)
2. **Share the `.AppImage` file**
3. **Installation Instructions:**
   ```
   1. Download InvigilEye-1.0.0.AppImage
   2. Open terminal in download folder
   3. chmod +x InvigilEye-1.0.0.AppImage
   4. ./InvigilEye-1.0.0.AppImage
   ```

---

## 🔧 Configuration Before Building

### Update Version Number

Edit `package.json`:
```json
{
  "version": "1.0.0"  // Change this
}
```

### Update App Name/Description

Edit `package.json`:
```json
{
  "name": "invigleye",
  "description": "Physical Exam Invigilation Desktop App",
  "build": {
    "appId": "com.invigleye.app",
    "productName": "InvigilEye"
  }
}
```

### Add App Icon (Optional)

1. Create icons:
   - Windows: `icon.ico` (256x256)
   - macOS: `icon.icns` 
   - Linux: `icon.png` (512x512)

2. Place in `build/` folder

3. Update `package.json`:
```json
{
  "build": {
    "win": {
      "icon": "build/icon.ico"
    },
    "mac": {
      "icon": "build/icon.icns"
    },
    "linux": {
      "icon": "build/icon.png"
    }
  }
}
```

---

## 🐛 Troubleshooting

### Build Fails on Windows

**Error:** "node-gyp rebuild failed"

**Solution:**
```bash
npm install --global windows-build-tools
npm install
npm run build:win
```

### Build Fails with "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Cross-Platform Build Fails

**Issue:** Cannot build Windows installer from macOS

**Solution:** Use one of these methods:
1. Build on a Windows machine
2. Use GitHub Actions (recommended)
3. Use cloud build service

### Better-sqlite3 Native Build Error

**Solution:**
```bash
npm rebuild better-sqlite3
npm run build
```

---

## 🚀 Quick Start for Windows Distribution

Since you're on macOS and need a Windows installer:

### Method 1: GitHub Actions (Easiest)

```bash
# Push to GitHub
git add .
git commit -m "Ready for build"
git push origin main

# GitHub automatically builds Windows .exe
# Download from Actions tab
```

### Method 2: Access a Windows Machine

```bash
# On Windows machine:
git clone <your-repo>
cd invigleye
npm install
npm run build:win

# Share the .exe file from dist/ folder
```

---

## 📝 Checklist Before Distribution

- [ ] Update version in package.json
- [ ] Test application on target platform
- [ ] Database initializes correctly
- [ ] All features work offline
- [ ] Default credentials documented
- [ ] User guide created
- [ ] Installer tested on clean system
- [ ] File size is reasonable (<200MB)

---

## 💡 Tips

1. **Test on Clean System:** Always test installers on a fresh machine without dev tools
2. **Sign Your App:** Consider code signing for production (prevents security warnings)
3. **Auto-Updates:** Use electron-updater for automatic updates in production
4. **Backup Database:** Provide backup/restore functionality for users
5. **Crash Reporting:** Integrate Sentry or similar for production error tracking

---

## 📞 Need Help?

- Check build logs: `npm run build -- --verbose`
- Enable debug mode: `DEBUG=electron-builder npm run build`
- GitHub Issues: Report build problems with logs

---

**Summary:** For Windows distribution from macOS, use GitHub Actions to automatically build the `.exe` installer!

