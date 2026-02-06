/**
 * Preload script - Secure bridge between main process and renderer
 *
 * This script runs in the renderer process BEFORE web content loads.
 * It has access to both Node.js APIs and the DOM, making it the perfect
 * place to expose a minimal, secure API to the renderer via contextBridge.
 *
 * Security: Only expose functions that are absolutely necessary.
 * Never expose require(), eval(), or arbitrary code execution capabilities.
 */

import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronAPI, UpdateInfo, AnalyticsEvent } from '../shared/types'
import type { UserProgress } from '../../src/types/lesson.types'
import { IPC_CHANNELS } from '../shared/constants'

/**
 * Exposed API for renderer process
 */
const electronAPI: ElectronAPI = {
  // Settings
  settings: {
    getLayout: () => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_LAYOUT),
    setLayout: (layoutId: string) => ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SET_LAYOUT, layoutId)
  },

  // User data persistence
  userData: {
    save: (data: UserProgress) => ipcRenderer.invoke(IPC_CHANNELS.USER_DATA_SAVE, data),
    load: () => ipcRenderer.invoke(IPC_CHANNELS.USER_DATA_LOAD),
    export: () => ipcRenderer.invoke(IPC_CHANNELS.USER_DATA_EXPORT)
  },

  // App information
  app: {
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP_GET_VERSION),

    onUpdateAvailable: (callback: (info: UpdateInfo) => void) => {
      ipcRenderer.on(IPC_CHANNELS.UPDATE_AVAILABLE, (_, info: UpdateInfo) => {
        callback(info)
      })
    },

    onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => {
      ipcRenderer.on(IPC_CHANNELS.UPDATE_DOWNLOADED, (_, info: UpdateInfo) => {
        callback(info)
      })
    },

    installUpdate: () => {
      ipcRenderer.send(IPC_CHANNELS.UPDATE_INSTALL)
    }
  },

  // Analytics (anonymous, local-only)
  analytics: {
    logEvent: (event: AnalyticsEvent) => {
      ipcRenderer.send(IPC_CHANNELS.ANALYTICS_LOG, event)
    }
  }
}

/**
 * Expose electronAPI to renderer process
 *
 * This makes the API available at window.electronAPI in the renderer.
 * The renderer can then use TypeScript to get type-safe access to these functions.
 */
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Log that preload script loaded successfully
console.log('Preload script loaded - ElectronAPI exposed to renderer')
