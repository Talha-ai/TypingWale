/**
 * Shared constants used across Electron processes
 */

/**
 * Application version (updated by version-bump script)
 */
export const APP_VERSION = '1.0.0'

/**
 * Vite dev server URL for development
 */
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

/**
 * Window configuration
 */
export const WINDOW_CONFIG = {
  DEFAULT_WIDTH: 1280,
  DEFAULT_HEIGHT: 900,
  MIN_WIDTH: 1024,
  MIN_HEIGHT: 768
} as const

/**
 * IPC channel names
 */
export const IPC_CHANNELS = {
  // Settings
  SETTINGS_GET_LAYOUT: 'settings:get-layout',
  SETTINGS_SET_LAYOUT: 'settings:set-layout',

  // User data
  USER_DATA_SAVE: 'user-data:save',
  USER_DATA_LOAD: 'user-data:load',
  USER_DATA_EXPORT: 'user-data:export',

  // App
  APP_GET_VERSION: 'app:get-version',

  // Update events (main → renderer)
  UPDATE_AVAILABLE: 'update-available',
  UPDATE_DOWNLOADED: 'update-downloaded',
  UPDATE_INSTALL: 'update:install',

  // Analytics
  ANALYTICS_LOG: 'analytics:log'
} as const
