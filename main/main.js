const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let backendProcess;

// Start the backend server
function startBackendServer() {
  return new Promise((resolve, reject) => {
    // Use unpacked backend in production (app.asar.unpacked)
    const backendPath = isDev 
      ? path.join(__dirname, '../backend/server.js')
      : path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js');
    
    // Use unpacked directory as cwd in production
    const workingDir = isDev 
      ? path.join(__dirname, '..')
      : path.join(process.resourcesPath, 'app.asar.unpacked');
    
    console.log('Starting backend server from:', backendPath);
    console.log('Working directory:', workingDir);
    console.log('Platform:', process.platform);
    
    // Get user data path for database
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'invigleye.db');
    console.log('Database will be stored at:', dbPath);
    
    // Determine Node.js executable
    // In production, use Electron as Node.js (it has Node.js built-in!)
    // In development, use system Node.js
    const nodeExecutable = isDev ? 'node' : process.execPath;
    const isWindows = process.platform === 'win32';
    
    console.log('Node executable:', nodeExecutable);
    
    const spawnOptions = {
      cwd: workingDir,
      shell: isWindows,  // Windows needs shell mode
      env: {
        ...process.env,
        // ELECTRON_RUN_AS_NODE makes Electron behave as Node.js
        ELECTRON_RUN_AS_NODE: '1',
        NODE_ENV: isDev ? 'development' : 'production',
        DB_PATH: dbPath,
        USER_DATA_PATH: userDataPath
      }
    };
    
    console.log('Spawning backend with Electron as Node.js');
    backendProcess = spawn(nodeExecutable, [backendPath], spawnOptions);

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
      // Backend is ready when we see the port message
      if (data.toString().includes('5001')) {
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    backendProcess.on('error', (error) => {
      console.error('Failed to start backend:', error);
      reject(error);
    });

    // Resolve after 3 seconds even if we don't see the port message
    setTimeout(() => resolve(), 3000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'InvigilEye - Exam Invigilation System'
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Fixed path for production build
    const indexPath = path.join(__dirname, '..', 'renderer', 'dist', 'index.html');
    console.log('Loading from:', indexPath);
    
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load:', err);
    });
    
    // Open DevTools in production for debugging
    mainWindow.webContents.openDevTools();
  }

  // Log any console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Renderer Log: ${message}`);
  });

  // Handle load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  // Start backend server first
  console.log('Starting backend server...');
  
  try {
    await startBackendServer();
    console.log('Backend server started, creating window...');
  } catch (error) {
    console.error('CRITICAL: Backend failed to start:', error);
    console.error('App will open anyway to show error...');
    // Continue to create window even if backend fails
  }
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch(error => {
  console.error('FATAL: App failed to start:', error);
  app.quit();
});

app.on('window-all-closed', () => {
  // Kill backend process when app closes
  if (backendProcess) {
    console.log('Killing backend process...');
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  // Ensure backend is killed on quit
  if (backendProcess) {
    backendProcess.kill();
  }
});

// IPC Handlers
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('show-notification', (event, { title, body }) => {
  const { Notification } = require('electron');
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

