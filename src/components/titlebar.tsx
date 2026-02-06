import { Minus, Square, X, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme-provider';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

export function Titlebar() {
  const { theme, setTheme } = useTheme();
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    // Get app version from Electron
    if (window.electronAPI) {
      window.electronAPI.app.getVersion().then(setAppVersion);
    }
  }, []);

  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI?.closeWindow();
  };

  return (
    <div className="h-10 bg-background border-b flex items-center justify-between select-none app-drag">
      {/* Left side - App name and version */}
      <div className="flex items-center gap-2 px-4">
        <span className="text-sm font-semibold text-foreground">
          CPCT Hindi Typing
        </span>
        {appVersion && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
            v{appVersion}
          </Badge>
        )}
      </div>

      {/* Right side - Theme toggle and window controls */}
      <div className="flex items-center app-no-drag">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none">
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Window Controls */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none hover:bg-muted"
          onClick={handleMinimize}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none hover:bg-muted"
          onClick={handleMaximize}
        >
          <Square className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
