const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let autoUpdater = null;

// ============================================
// USER DATA STORE (Simple JSON-based)
// ============================================
const userDataPath = path.join(app.getPath('userData'), 'user-data.json');

function loadUserData() {
  try {
    if (fs.existsSync(userDataPath)) {
      return JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return {
    layoutId: 'remington-gail',
    userProgress: {},
    windowBounds: null
  };
}

function saveUserData(data) {
  try {
    const existing = loadUserData();
    const merged = { ...existing, ...data };
    fs.writeFileSync(userDataPath, JSON.stringify(merged, null, 2));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// ============================================
// WINDOW CREATION
// ============================================
function createWindow() {
  // Remove menu bar completely
  Menu.setApplicationMenu(null);

  const userData = loadUserData();
  const bounds = userData.windowBounds || {};

  mainWindow = new BrowserWindow({
    width: bounds.width || 1280,
    height: bounds.height || 900,
    x: bounds.x,
    y: bounds.y,
    minWidth: 1024,
    minHeight: 768,
    frame: true,
    backgroundColor: '#09090b',
    show: false,
    autoHideMenuBar: true, // Hide menu bar (File, Edit, etc.)
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load app based on environment
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:1233');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Save window bounds on close
  mainWindow.on('close', () => {
    if (mainWindow) {
      saveUserData({ windowBounds: mainWindow.getBounds() });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ============================================
// AUTO-UPDATER SETUP (Only in production)
// ============================================
function setupAutoUpdater() {
  if (!app.isPackaged) {
    console.log('Skipping auto-updater in development mode');
    return;
  }

  try {
    const { autoUpdater: updater } = require('electron-updater');
    autoUpdater = updater;

    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for update...');
      mainWindow?.webContents.send('update-status', { status: 'checking' });
    });

    autoUpdater.on('update-available', (info) => {
      console.log('Update available:', info.version);

      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available!`,
        detail: 'Would you like to download it now? The app will update when you restart.',
        buttons: ['Download', 'Later'],
        defaultId: 0,
        cancelId: 1
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
          mainWindow?.webContents.send('update-status', { status: 'downloading' });
        }
      });
    });

    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available. Current version:', info.version);
      mainWindow?.webContents.send('update-status', { status: 'not-available' });
    });

    autoUpdater.on('error', (err) => {
      console.error('Error in auto-updater:', err);
      mainWindow?.webContents.send('update-status', { status: 'error', error: err.message });
    });

    autoUpdater.on('download-progress', (progressObj) => {
      console.log(`Download progress: ${Math.round(progressObj.percent)}%`);
      mainWindow?.webContents.send('update-status', {
        status: 'downloading',
        progress: Math.round(progressObj.percent),
        bytesPerSecond: progressObj.bytesPerSecond,
        transferred: progressObj.transferred,
        total: progressObj.total
      });
    });

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update downloaded:', info.version);

      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded successfully!',
        detail: 'The application will restart to install the update.',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        } else {
          mainWindow?.webContents.send('update-status', { status: 'ready-to-install' });
        }
      });
    });

    // Check for updates with delay
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(err => {
        console.error('Failed to check for updates:', err);
      });
    }, 3000);

  } catch (error) {
    console.error('Failed to setup auto-updater:', error);
  }
}

// ============================================
// IPC HANDLERS - Window Controls
// ============================================
ipcMain.on('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow) {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow?.close();
});

// ============================================
// IPC HANDLERS - Settings & User Data
// ============================================
ipcMain.handle('settings:get-layout', () => {
  const userData = loadUserData();
  return userData.layoutId || 'remington-gail';
});

ipcMain.handle('settings:set-layout', (event, layoutId) => {
  saveUserData({ layoutId });
});

ipcMain.handle('user-data:save', (event, progress) => {
  saveUserData({ userProgress: progress });
});

ipcMain.handle('user-data:load', () => {
  const userData = loadUserData();
  return userData.userProgress || {};
});

ipcMain.handle('user-data:export', () => {
  const userData = loadUserData();
  return JSON.stringify(userData, null, 2);
});

// ============================================
// IPC HANDLERS - App Info
// ============================================
ipcMain.handle('app:get-version', () => {
  const packageJson = require('./package.json');
  return packageJson.version;
});

// ============================================
// IPC HANDLERS - Auto-Updater
// ============================================
ipcMain.handle('check-for-updates', async () => {
  if (!autoUpdater) {
    return { success: false, error: 'Auto-updater not available in development mode' };
  }
  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, updateInfo: result?.updateInfo };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.on('install-update', () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  }
});

// ============================================
// APP LIFECYCLE
// ============================================
app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
