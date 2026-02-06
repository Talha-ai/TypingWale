/**
 * TypeScript declarations for Electron API exposed via preload
 */

export interface UpdateStatus {
  status: 'checking' | 'downloading' | 'not-available' | 'error' | 'ready-to-install';
  progress?: number;
  bytesPerSecond?: number;
  transferred?: number;
  total?: number;
  error?: string;
}

export interface ElectronAPI {
  // Window controls
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;

  // Settings
  settings: {
    getLayout: () => Promise<string>;
    setLayout: (layoutId: string) => Promise<void>;
  };

  // User data
  userData: {
    save: (data: any) => Promise<void>;
    load: () => Promise<any>;
    export: () => Promise<string>;
  };

  // App info
  app: {
    getVersion: () => Promise<string>;
    onUpdateAvailable: (callback: (info: any) => void) => void;
    onUpdateDownloaded: (callback: (info: any) => void) => void;
    onUpdateStatus: (callback: (data: UpdateStatus) => void) => void;
    installUpdate: () => void;
  };

  // Auto-updater
  checkForUpdates: () => Promise<{ success: boolean; updateInfo?: any; error?: string }>;
  installUpdate: () => void;

  // Cleanup
  removeAllListeners: (channel: string) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
