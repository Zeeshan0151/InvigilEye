# Installation Setup - Download Python During Installation ✅

## 🎉 Overview

InvigilEye now downloads the Python AI bundle **during installation**, not on first launch!

### User Experience:
1. ✅ **Download small installer** (~50MB)
2. ✅ **Install app** - Python downloads during installation (~2-3 minutes)
3. ✅ **Launch app** - Ready immediately, no waiting!

---

## 📦 How It Works

### Windows (.exe installer)
- **Installer**: Uses NSIS with custom download script
- **During Installation**:
  1. Installs the main app (~50MB)
  2. Shows "AI Features Setup" page
  3. Downloads `python-portable.tar.gz` (600MB) with progress bar
  4. Extracts to `%APPDATA%\InvigilEye\python-portable\`
  5. Installation completes
- **First Launch**: Python is already there, app starts immediately!

### macOS (.pkg installer)
- **Installer**: PKG format with postinstall script
- **During Installation**:
  1. Installs the main app
  2. Runs postinstall script automatically
  3. Downloads Python bundle with progress in terminal
  4. Extracts to `~/Library/Application Support/InvigilEye/python-portable/`
  5. Installation completes
- **First Launch**: Python is already there, app starts immediately!

### macOS (.dmg alternative)
- **Installer**: Traditional drag-and-drop DMG
- **Note**: DMG cannot run scripts during installation
- **Behavior**: If user installs via DMG, Python will be downloaded on first launch
- **Recommendation**: Direct users to use the .pkg installer for best experience

---

## 🛠️ Setup for Developers

### Step 1: Create Python Bundle

```bash
# Create virtual environment (if not already done)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create the python-portable bundle
./scripts/setup-python-bundle.sh
```

This creates `python-portable/` directory (~1.3GB).

### Step 2: Create Compressed Tarball

```bash
chmod +x scripts/create-python-tarball.sh
./scripts/create-python-tarball.sh
```

This creates `python-portable.tar.gz` (~600MB compressed).

### Step 3: Upload to GitHub Releases

```bash
# 1. Create a new release on GitHub
# Go to: https://github.com/Zeeshan0151/InvigilEye/releases
# Click "Create a new release"

# 2. Set tag version
Tag: v1.0.0-python

# 3. Upload the tarball
Upload: python-portable.tar.gz

# 4. Publish the release
```

Your download URL will be:
```
https://github.com/Zeeshan0151/InvigilEye/releases/download/v1.0.0-python/python-portable.tar.gz
```

### Step 4: Update Download URLs

The download URL is already configured in:
- `build/installer.nsh` (Windows NSIS)
- `build/download-python.nsi` (Windows NSIS alternative)
- `build/postinstall-macos.sh` (macOS PKG)
- `main/python-downloader.js` (Fallback for first-run download)

All set to:
```
https://github.com/Zeeshan0151/InvigilEye/releases/download/v1.0.0-python/python-portable.tar.gz
```

**If you change the URL**, update it in all these files!

### Step 5: Build Installers

```bash
# Build for macOS (creates both .pkg and .dmg)
npm run build:mac

# Build for Windows (creates .exe with NSIS)
npm run build:win

# Build for all platforms
npm run build:all
```

**Output**:
- macOS: `dist/InvigilEye-1.0.0.pkg` (recommended) and `dist/InvigilEye-1.0.0.dmg`
- Windows: `dist/InvigilEye Setup 1.0.0.exe`

---

## 📂 File Structure

```
InvigilEye/
├── build/
│   ├── installer.nsh              # Windows NSIS custom page
│   ├── download-python.nsi        # Windows Python download logic
│   ├── postinstall-macos.sh       # macOS postinstall script
│   └── pkg-scripts/
│       └── postinstall -> ../postinstall-macos.sh
│
├── main/
│   ├── main.js                    # Updated to check for pre-installed Python
│   ├── python-downloader.js       # Fallback downloader (rarely used)
│   └── preload.js                 # IPC handlers
│
├── renderer/src/
│   ├── App.jsx                    # Shows error if Python missing
│   └── pages/
│       └── PythonDownloadScreen.jsx  # (No longer used in normal flow)
│
├── scripts/
│   ├── setup-python-bundle.sh     # Creates python-portable/
│   └── create-python-tarball.sh   # Creates python-portable.tar.gz
│
└── package.json                   # Updated with PKG and NSIS config
```

---

## 🎯 Installation Flow Diagrams

### Windows Installation
```
User downloads .exe (50MB)
      ↓
Runs installer
      ↓
[Installs app files]
      ↓
[Custom NSIS page: "AI Features Setup"]
      ↓
[Downloads python-portable.tar.gz (600MB) with progress]
      ↓
[Extracts to %APPDATA%\InvigilEye\python-portable\]
      ↓
Installation complete ✅
      ↓
User launches app → Python already there! 🚀
```

### macOS Installation (.pkg)
```
User downloads .pkg (50MB)
      ↓
Runs installer
      ↓
[Installs app files]
      ↓
[Postinstall script runs automatically]
      ↓
[Downloads python-portable.tar.gz (600MB)]
      ↓
[Extracts to ~/Library/Application Support/InvigilEye/python-portable/]
      ↓
Installation complete ✅
      ↓
User launches app → Python already there! 🚀
```

### macOS Installation (.dmg) - Fallback
```
User downloads .dmg (50MB)
      ↓
Drags app to Applications
      ↓
Launches app
      ↓
App detects Python missing
      ↓
Shows error: "Please use .pkg installer" 
(or downloads Python on first launch if downloader is enabled)
```

---

## 🔧 Configuration Details

### Windows NSIS Configuration (`package.json`)

```json
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true,
  "perMachine": false,
  "allowElevation": true,
  "include": "build/download-python.nsi",
  "deleteAppDataOnUninstall": true,
  "createDesktopShortcut": true,
  "createStartMenuShortcut": true
}
```

### macOS PKG Configuration (`package.json`)

```json
"pkg": {
  "scripts": "build/pkg-scripts",
  "installLocation": "/Applications"
}
```

---

## ⚠️ Important Notes

### Internet Required During Installation
- Users **must have internet** during installation
- If download fails:
  - **Windows**: Shows message, continues installation, will download on first launch
  - **macOS**: Shows error in terminal, continues installation, will download on first launch

### File Sizes
- **Installer**: ~50MB (just the app)
- **Download during install**: ~600MB (Python bundle)
- **Total disk space**: ~1.5GB (1.3GB extracted + app)

### Python Location After Installation
- **Windows**: `C:\Users\{username}\AppData\Roaming\InvigilEye\python-portable\`
- **macOS**: `~/Library/Application Support/InvigilEye/python-portable/`
- **Linux**: `~/.config/InvigilEye/python-portable/`

### Uninstall
- **Windows**: NSIS uninstaller removes both app and Python bundle
- **macOS**: Deleting app removes app only; Python stays in Application Support
  - Users can manually delete: `~/Library/Application Support/InvigilEye/`

---

## 🧪 Testing Checklist

### Test Windows Installation

1. Build installer:
   ```bash
   npm run build:win
   ```

2. Run installer on Windows machine

3. Verify:
   - [ ] Installer shows "AI Features Setup" page
   - [ ] Progress bar shows during download
   - [ ] Download completes (~600MB)
   - [ ] Installation finishes successfully
   - [ ] App launches immediately
   - [ ] Monitoring page shows camera feed
   - [ ] Pose detection works

4. Test uninstall:
   - [ ] Uninstaller removes Python bundle from AppData

### Test macOS Installation (.pkg)

1. Build installer:
   ```bash
   npm run build:mac
   ```

2. Run .pkg installer on macOS

3. Verify:
   - [ ] Installer shows standard macOS install flow
   - [ ] Postinstall script runs (check installer log)
   - [ ] Python downloads (~600MB)
   - [ ] Installation completes
   - [ ] App launches immediately
   - [ ] Monitoring page shows camera feed
   - [ ] Pose detection works

### Test Offline Installation

1. Disconnect from internet

2. Run installer

3. Verify:
   - [ ] Installation completes (without Python)
   - [ ] App shows error message about missing AI features
   - [ ] Error message instructs to reinstall with internet

---

## 🐛 Troubleshooting

### Windows: "Failed to download AI bundle"
- Check internet connection
- Verify GitHub release exists and is public
- Check Windows Firewall/Antivirus
- Check if download URL is accessible in browser

### macOS: Postinstall script doesn't run
- Check if using .pkg (not .dmg)
- Check script permissions: `ls -l build/pkg-scripts/postinstall`
- Should be executable: `chmod +x build/pkg-scripts/postinstall`
- Check Console.app for installation logs

### "AI Features Not Found" on first launch
- Python download failed during installation
- Check if `python-portable/` exists in Application Support
- Reinstall with active internet connection
- Check GitHub release is accessible

### Build fails: "Cannot find module 'tar'"
- Install tar module: `npm install tar`
- Or use built-in extraction (already in code)

---

## 📊 Size Comparison: All 3 Options

| Option | Installer Size | First Launch | Total Download | User Experience |
|--------|---------------|--------------|----------------|-----------------|
| **Option 1**: Bundle in Installer | 600MB | Instant | 600MB | ⭐⭐⭐ Good |
| **Option 2**: Download During Install | 50MB | Instant | 650MB | ⭐⭐⭐⭐⭐ **Best!** |
| **Option 3**: Download on First Launch | 50MB | 2-3 min wait | 650MB | ⭐⭐⭐ Good |

**We chose Option 2!** ✅

---

## ✅ Summary

**Status**: ✅ **IMPLEMENTED AND READY**

**What we built**:
- ✅ Windows NSIS installer with custom download page
- ✅ macOS PKG installer with postinstall script
- ✅ Auto-extraction of Python bundle if needed
- ✅ Error handling if installation fails
- ✅ Clean uninstall on Windows

**What users get**:
- ✅ Small ~50MB installer download
- ✅ Python downloads during installation (expected behavior)
- ✅ App ready to use immediately on first launch
- ✅ No surprises, no unexpected delays!

**Next steps**:
1. Create Python bundle: `./scripts/setup-python-bundle.sh`
2. Create tarball: `./scripts/create-python-tarball.sh`
3. Upload to GitHub Releases (tag: `v1.0.0-python`)
4. Build installers: `npm run build:mac` and `npm run build:win`
5. Test on clean machines
6. Distribute! 🚀

