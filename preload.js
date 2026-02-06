const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // ============================================
  // WINDOW CONTROLS
  // ============================================
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  // ============================================
  // SETTINGS
  // ============================================
  settings: {
    getLayout: () => ipcRenderer.invoke('settings:get-layout'),
    setLayout: (layoutId) => ipcRenderer.invoke('settings:set-layout', layoutId)
  },

  // ============================================
  // USER DATA
  // ============================================
  userData: {
    save: (data) => ipcRenderer.invoke('user-data:save', data),
    load: () => ipcRenderer.invoke('user-data:load'),
    export: () => ipcRenderer.invoke('user-data:export')
  },

  // ============================================
  // APP INFO
  // ============================================
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    onUpdateAvailable: (callback) => {
      ipcRenderer.on('update-available', (event, info) => callback(info));
    },
    onUpdateDownloaded: (callback) => {
      ipcRenderer.on('update-downloaded', (event, info) => callback(info));
    },
    onUpdateStatus: (callback) => {
      ipcRenderer.on('update-status', (event, data) => callback(data));
    },
    installUpdate: () => ipcRenderer.send('install-update')
  },

  // ============================================
  // AUTO-UPDATER
  // ============================================
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  installUpdate: () => ipcRenderer.send('install-update'),

  // ============================================
  // CLEANUP
  // ============================================
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

console.log('Preload script loaded - ElectronAPI exposed to renderer');
