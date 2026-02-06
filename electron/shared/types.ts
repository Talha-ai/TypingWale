/**
 * Shared TypeScript type definitions for IPC communication
 * between main process and renderer process
 */

import type { UserProgress } from '../../src/types/lesson.types'

/**
 * Update information from electron-updater
 */
export interface UpdateInfo {
  version: string
  releaseDate: string
  releaseNotes?: string
}

/**
 * Anonymous analytics event
 */
export interface AnalyticsEvent {
  type: 'lesson_complete' | 'test_complete' | 'practice_complete' | 'error' | 'app_start' | 'app_close'
  timestamp: number
  data?: Record<string, unknown>
}

/**
 * API exposed to renderer process via contextBridge
 */
export interface ElectronAPI {
  // Settings
  settings: {
    getLayout: () => Promise<string | null>
    setLayout: (layoutId: string) => Promise<void>
  }

  // User data persistence
  userData: {
    save: (data: UserProgress) => Promise<void>
    load: () => Promise<UserProgress | null>
    export: () => Promise<string>
  }

  // App information
  app: {
    getVersion: () => Promise<string>
    onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void
    onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => void
    installUpdate: () => void
  }

  // Analytics (anonymous, local-only)
  analytics: {
    logEvent: (event: AnalyticsEvent) => void
  }
}

/**
 * Extend Window interface with ElectronAPI
 */
declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
