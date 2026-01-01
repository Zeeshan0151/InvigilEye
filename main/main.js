const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let backendServer;

// Start the backend server directly in the main process
function startBackendServer() {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting backend server in main process...');
      console.log('Platform:', process.platform);
      console.log('isDev:', isDev);
      
      // Get user data path for database
      const userDataPath = app.getPath('userData');
      const dbPath = path.join(userDataPath, 'invigleye.db');
      console.log('Database will be stored at:', dbPath);
      
      // Set environment variables for backend
      process.env.NODE_ENV = isDev ? 'development' : 'production';
      process.env.DB_PATH = dbPath;
      process.env.USER_DATA_PATH = userDataPath;
      
      // Determine backend path
      const backendPath = isDev 
        ? path.join(__dirname, '../backend/server.js')
        : path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js');
      
      console.log('Loading backend from:', backendPath);
      
      // Change working directory for backend
      const originalCwd = process.cwd();
      const backendDir = isDev 
        ? path.join(__dirname, '..')
        : path.join(process.resourcesPath, 'app.asar.unpacked');
      
      console.log('Changing cwd to:', backendDir);
      process.chdir(backendDir);
      
      // Pre-check: Try to require better-sqlite3 first
      try {
        console.log('Testing better-sqlite3...');
        const sqlite3Path = isDev 
          ? 'better-sqlite3'
          : path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'better-sqlite3');
        console.log('better-sqlite3 path:', sqlite3Path);
        const Database = require(sqlite3Path);
        console.log('✅ better-sqlite3 loaded successfully');
      } catch (sqliteError) {
        console.error('❌ better-sqlite3 FAILED to load:', sqliteError.message);
        console.error('This is the root cause - backend cannot start without database');
      }
      
      // Require and start the backend server
      try {
        console.log('About to require backend...');
        backendServer = require(backendPath);
        console.log('✅ Backend module loaded');
        console.log('Backend type:', typeof backendServer);
        
        // Test if backend is actually running by making a request
        setTimeout(() => {
          const http = require('http');
          const testReq = http.get('http://localhost:5001/health', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              console.log('✅ Backend health check passed:', data);
              resolve();
            });
          });
          
          testReq.on('error', (err) => {
            console.error('❌ Backend health check FAILED:', err.message);
            console.error('Backend is loaded but NOT listening on port 5001!');
            console.error('This likely means better-sqlite3 or another module failed to load');
            // Still resolve to open window with error visible
            resolve();
          });
          
          testReq.setTimeout(5000);
        }, 3000);
        
      } catch (requireError) {
        console.error('❌ Failed to require backend:', requireError.message);
        console.error('Error code:', requireError.code);
        console.error('Full stack:', requireError.stack);
        
        // Check if it's a module not found error
        if (requireError.code === 'MODULE_NOT_FOUND') {
          console.error('❌ MISSING MODULE:', requireError.message);
          console.error('This is likely better-sqlite3 not being found');
        }
        
        // Restore original cwd
        process.chdir(originalCwd);
        // Still resolve to show window with errors visible
        resolve();
      }
      
    } catch (error) {
      console.error('❌ Failed to start backend:', error);
      console.error('Stack:', error.stack);
      reject(error);
    }
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
  // Only start backend in production (in dev, concurrently handles it)
  if (!isDev) {
    console.log('Starting backend server...');
    
    try {
      await startBackendServer();
      console.log('Backend server started, creating window...');
    } catch (error) {
      console.error('CRITICAL: Backend failed to start:', error);
      console.error('App will open anyway to show error...');
      // Continue to create window even if backend fails
    }
  } else {
    console.log('Development mode: Backend started by concurrently');
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
  // Backend will stop when app quits (runs in same process)
  console.log('All windows closed');
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  // Backend server closes automatically when process exits
  console.log('App quitting...');
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

