/**
 * UpdateNotification Component
 * Shows a banner when app update is available
 */

import { useState, useEffect } from 'react';
import { Download, X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type UpdateStatus = 'checking' | 'available' | 'downloading' | 'downloaded' | 'not-available' | 'error';

interface UpdateInfo {
  version?: string;
  releaseDate?: string;
  releaseNotes?: string;
}

export function UpdateNotification() {
  const [status, setStatus] = useState<UpdateStatus>('checking');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({});
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) {
      setStatus('not-available');
      return;
    }

    // Listen for update events
    window.electronAPI.app.onUpdateAvailable((info) => {
      setUpdateInfo({
        version: info.version,
        releaseDate: info.releaseDate,
        releaseNotes: info.releaseNotes,
      });
      setStatus('available');
    });

    window.electronAPI.app.onUpdateStatus((data) => {
      if (data.status === 'downloading') {
        setStatus('downloading');
        setDownloadProgress(data.progress || 0);
      } else if (data.status === 'ready-to-install') {
        setStatus('downloaded');
      } else if (data.status === 'error') {
        setStatus('error');
      }
    });

    window.electronAPI.app.onUpdateDownloaded(() => {
      setStatus('downloaded');
    });

    // Check for updates on mount
    setTimeout(() => {
      setStatus('not-available');
    }, 3000);
  }, []);

  const handleDownload = () => {
    if (!window.electronAPI) return;

    // electron-updater will auto-download when update is available
    // We just need to show the downloading state
    setStatus('downloading');
  };

  const handleInstall = () => {
    if (!window.electronAPI) return;
    window.electronAPI.installUpdate();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  // Don't show if dismissed or no update
  if (dismissed || status === 'not-available' || status === 'checking') {
    return null;
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <X className="h-5 w-5" />
          <div>
            <p className="font-medium">Update failed</p>
            <p className="text-sm text-red-100">Please download manually from our website</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-white hover:bg-red-600"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Update available
  if (status === 'available') {
    return (
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5" />
          <div>
            <p className="font-medium">
              New version available: {updateInfo.version}
            </p>
            <p className="text-sm opacity-90">
              Download and install the latest update
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Update
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Downloading
  if (status === 'downloading') {
    return (
      <div className="bg-primary text-primary-foreground px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <div>
              <p className="font-medium">Downloading update...</p>
              <p className="text-sm opacity-90">{Math.round(downloadProgress)}% complete</p>
            </div>
          </div>
        </div>
        <Progress value={downloadProgress} className="h-2" />
      </div>
    );
  }

  // Downloaded - ready to install
  if (status === 'downloaded') {
    return (
      <div className="bg-green-600 text-white px-4 py-3 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5" />
          <div>
            <p className="font-medium">Update downloaded!</p>
            <p className="text-sm text-green-100">
              Restart to install version {updateInfo.version}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleInstall}
            className="gap-2 bg-white text-green-600 hover:bg-green-50"
          >
            Restart Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-white hover:bg-green-700"
          >
            Later
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
