import { app, BrowserWindow, ipcMain, session, dialog } from 'electron'
import { join } from 'path'
import log from 'electron-log'
// @ts-ignore - electron-store v11 has different type exports
import ElectronStore from 'electron-store'
import { autoUpdater } from 'electron-updater'
import type { UserProgress } from '../../src/types/lesson.types'
import { VITE_DEV_SERVER_URL, WINDOW_CONFIG, IPC_CHANNELS, APP_VERSION } from '../shared/constants'
import type { AnalyticsEvent } from '../shared/types'

// Configure logging
log.transports.file.level = 'info'
log.transports.console.level = app.isPackaged ? 'error' : 'debug'

// Define store schema type
interface StoreSchema {
  layoutId: string
  userProgress: UserProgress | Record<string, never>
  windowBounds?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
  analytics?: AnalyticsEvent[]
}

// Initialize electron-store for persistent data
// @ts-ignore - electron-store v11 typing issues
const store: any = new ElectronStore({
  name: 'user-data',
  defaults: {
    layoutId: 'remington-gail',
    userProgress: {},
    windowBounds: undefined,
    analytics: []
  },
  clearInvalidConfig: true
})

// Release verification configuration
const RELEASE_CONFIG = {
  GITHUB_OWNER: 'Talha-ai',
  GITHUB_REPO: 'TypingWale',
  REQUIRED_VERSION: '1.0.0', // Specific version to check for
  CHECK_TIMEOUT_MS: 10000 // 10 second timeout for API call
}

let mainWindow: BrowserWindow | null = null

/**
 * Verify that GitHub release v1.0.0 exists
 * This acts as a kill switch - if you delete the release, app stops working
 */
async function verifyGitHubRelease(): Promise<{ success: boolean; reason?: string }> {
  // Skip verification in development mode
  if (!app.isPackaged) {
    log.info('Skipping release verification in development mode')
    return { success: true }
  }

  try {
    log.info(`Checking for GitHub release v${RELEASE_CONFIG.REQUIRED_VERSION}...`)

    const url = `https://api.github.com/repos/${RELEASE_CONFIG.GITHUB_OWNER}/${RELEASE_CONFIG.GITHUB_REPO}/releases/tags/v${RELEASE_CONFIG.REQUIRED_VERSION}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), RELEASE_CONFIG.CHECK_TIMEOUT_MS)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'TypingWale-App'
      }
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      log.info(`✅ Release verified: ${data.tag_name} (${data.name || 'No name'})`)
      return { success: true }
    } else if (response.status === 404) {
      log.error(`❌ Release v${RELEASE_CONFIG.REQUIRED_VERSION} not found on GitHub`)
      return {
        success: false,
        reason: `This version of TypingWale is no longer available.\n\nRelease v${RELEASE_CONFIG.REQUIRED_VERSION} has been removed from GitHub.\n\nPlease contact support for assistance.`
      }
    } else {
      log.error(`GitHub API returned status ${response.status}`)
      return {
        success: false,
        reason: `Unable to verify app license (HTTP ${response.status}).\n\nPlease check your internet connection and try again.`
      }
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      log.error('GitHub release check timed out')
      return {
        success: false,
        reason: 'Connection timeout while verifying license.\n\nPlease check your internet connection and try again.'
      }
    }

    log.error('Failed to verify GitHub release:', error)
    return {
      success: false,
      reason: 'Unable to verify app license.\n\nPlease check your internet connection and try again.'
    }
  }
}

/**
 * Show error dialog and quit app
 */
function showLicenseErrorAndQuit(reason: string) {
  dialog.showErrorBox(
    'TypingWale - License Verification Failed',
    reason + '\n\nThe app will now close.'
  )
  log.error('License verification failed:', reason)
  app.quit()
}

/**
 * Create the main application window
 */
function createWindow() {
  // Load saved window bounds or use defaults
  const savedBounds = store.get('windowBounds') as { x?: number; y?: number; width?: number; height?: number } | undefined

  mainWindow = new BrowserWindow({
    width: savedBounds?.width || WINDOW_CONFIG.DEFAULT_WIDTH,
    height: savedBounds?.height || WINDOW_CONFIG.DEFAULT_HEIGHT,
    x: savedBounds?.x,
    y: savedBounds?.y,
    minWidth: WINDOW_CONFIG.MIN_WIDTH,
    minHeight: WINDOW_CONFIG.MIN_HEIGHT,
    backgroundColor: '#F8F9FA',
    show: false, // Show after ready-to-show
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: !app.isPackaged,
      spellcheck: false // Disable for Hindi typing
    }
  })

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    log.info('Window shown')
  })

  // Save window bounds on resize/move
  mainWindow.on('close', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds()
      store.set('windowBounds', bounds)
      log.info('Window bounds saved:', bounds)
    }
  })

  // Disable DevTools keyboard shortcuts in production
  if (app.isPackaged) {
    mainWindow.webContents.on('before-input-event', (event, input) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        input.key === 'F12' ||
        (input.control && input.shift && input.key === 'I') ||
        (input.control && input.shift && input.key === 'J') ||
        (input.control && input.shift && input.key === 'C')
      ) {
        event.preventDefault()
        log.warn('DevTools keyboard shortcut blocked:', input.key)
      }
    })
  }

  // Load application
  if (VITE_DEV_SERVER_URL) {
    // Development mode: Load from Vite dev server
    mainWindow.loadURL(VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
    log.info('Loaded from Vite dev server:', VITE_DEV_SERVER_URL)
  } else {
    // Production mode: Load built files
    mainWindow.loadFile(join(__dirname, '../../dist/index.html'))
    log.info('Loaded from dist/index.html')
  }

  // Configure CSP for production
  if (app.isPackaged) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
          ]
        }
      })
    })
    log.info('CSP enabled for production')
  }
}

/**
 * Set up auto-updater (production only)
 */
function setupAutoUpdater() {
  if (!app.isPackaged) {
    log.info('Skipping auto-updater in development mode')
    return
  }

  autoUpdater.logger = log
  autoUpdater.autoDownload = false // Ask user before downloading
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info.version)
    mainWindow?.webContents.send(IPC_CHANNELS.UPDATE_AVAILABLE, {
      version: info.version,
      releaseDate: info.releaseDate,
      releaseNotes: info.releaseNotes
    })
  })

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info.version)
    mainWindow?.webContents.send(IPC_CHANNELS.UPDATE_DOWNLOADED, {
      version: info.version,
      releaseDate: info.releaseDate
    })
  })

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err)
  })

  // Check for updates on startup
  setTimeout(() => {
    autoUpdater.checkForUpdates()
    log.info('Checking for updates...')
  }, 3000)
}

/**
 * Set up IPC handlers
 */
function setupIPC() {
  // Settings handlers
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET_LAYOUT, () => {
    const layoutId = store.get('layoutId') as string
    log.debug('Get layout:', layoutId)
    return layoutId
  })

  ipcMain.handle(IPC_CHANNELS.SETTINGS_SET_LAYOUT, (_, layoutId: string) => {
    store.set('layoutId', layoutId)
    log.debug('Set layout:', layoutId)
  })

  // User data handlers
  ipcMain.handle(IPC_CHANNELS.USER_DATA_SAVE, (_, data: UserProgress) => {
    store.set('userProgress', data)
    log.info('User progress saved')
  })

  ipcMain.handle(IPC_CHANNELS.USER_DATA_LOAD, () => {
    const userProgress = store.get('userProgress', {}) as UserProgress
    log.info('User progress loaded')
    return userProgress
  })

  ipcMain.handle(IPC_CHANNELS.USER_DATA_EXPORT, () => {
    const allData = store.store
    const jsonData = JSON.stringify(allData, null, 2)
    log.info('User data exported')
    return jsonData
  })

  // App info handlers
  ipcMain.handle(IPC_CHANNELS.APP_GET_VERSION, () => {
    return APP_VERSION
  })

  // Update install (user-triggered)
  ipcMain.on(IPC_CHANNELS.UPDATE_INSTALL, () => {
    log.info('Installing update...')
    autoUpdater.quitAndInstall(false, true)
  })

  // Analytics logging (anonymous, local-only)
  ipcMain.on(IPC_CHANNELS.ANALYTICS_LOG, (_, event: AnalyticsEvent) => {
    log.info('Analytics event:', event.type, event.data)
    // Store analytics locally for debugging
    const analytics = store.get('analytics', []) as AnalyticsEvent[]
    analytics.push(event)
    // Keep only last 1000 events
    if (analytics.length > 1000) {
      analytics.shift()
    }
    store.set('analytics', analytics)
  })

  log.info('IPC handlers registered')
}

// App lifecycle
app.whenReady().then(async () => {
  log.info('App ready, version:', APP_VERSION)

  // CRITICAL: Verify GitHub release v1.0.0 exists before allowing app to run
  // This is the kill switch - delete the release to disable all distributed copies
  const { success, reason } = await verifyGitHubRelease()

  if (!success) {
    showLicenseErrorAndQuit(reason || 'License verification failed')
    return
  }

  log.info('✅ License verification passed - starting app')

  setupIPC()
  createWindow()
  setupAutoUpdater()

  app.on('activate', () => {
    // macOS: Re-create window when dock icon clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // Windows/Linux: Quit when all windows closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Log app start analytics event
app.whenReady().then(() => {
  const analytics = store.get('analytics', []) as AnalyticsEvent[]
  analytics.push({
    type: 'app_start',
    timestamp: Date.now(),
    data: { version: APP_VERSION }
  })
  store.set('analytics', analytics)
})

// Log app close analytics event
app.on('before-quit', () => {
  const analytics = store.get('analytics', []) as AnalyticsEvent[]
  analytics.push({
    type: 'app_close',
    timestamp: Date.now(),
    data: { version: APP_VERSION }
  })
  store.set('analytics', analytics)
})
