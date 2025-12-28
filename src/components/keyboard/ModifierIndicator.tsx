/**
 * ModifierIndicator Component
 * Shows which modifier keys are currently active
 * Helps users understand which character set is active
 */

import { ModifierState } from '@/types/keyboard.types';
import { cn } from '@/utils/cn';

interface ModifierIndicatorProps {
  /** Current modifier state */
  modifierState: ModifierState;

  /** Whether to show detailed description */
  showDescription?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Modifier state descriptions for user guidance
 */
const MODIFIER_DESCRIPTIONS: Record<ModifierState, string> = {
  normal: 'Normal characters - No modifier keys pressed',
  shift: 'Shift characters - Hold Shift for alternate characters',
  altgr: 'AltGr characters - Hold Right Alt for special characters',
  'altgr-shift': 'AltGr+Shift - Hold both Right Alt and Shift for advanced characters',
};

/**
 * Color scheme for different modifier states
 */
const MODIFIER_COLORS: Record<ModifierState, string> = {
  normal: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
  shift: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
  altgr: 'bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100',
  'altgr-shift':
    'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100',
};

export function ModifierIndicator({
  modifierState,
  showDescription = true,
  className,
}: ModifierIndicatorProps) {
  const colorClass = MODIFIER_COLORS[modifierState];
  const description = MODIFIER_DESCRIPTIONS[modifierState];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border-2',
        'transition-all duration-200',
        colorClass,
        'border-current border-opacity-30',
        className
      )}
    >
      {/* Modifier State Badge */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium opacity-70">Modifier:</span>
        <span className="px-3 py-1 rounded-md bg-white/20 dark:bg-black/20 font-mono text-sm font-semibold">
          {modifierState.toUpperCase()}
        </span>
      </div>

      {/* Description */}
      {showDescription && (
        <div className="flex-1">
          <p className="text-sm opacity-90">{description}</p>
        </div>
      )}

      {/* Visual indicators for active keys */}
      <div className="flex gap-2">
        {modifierState.includes('shift') && (
          <KeyIndicator label="Shift" active />
        )}
        {modifierState.includes('altgr') && (
          <KeyIndicator label="AltGr" active />
        )}
      </div>
    </div>
  );
}

/**
 * Small key indicator badge
 */
function KeyIndicator({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={cn(
        'px-2 py-1 rounded text-xs font-medium',
        'transition-all duration-150',
        active
          ? 'bg-current text-white scale-110'
          : 'bg-white/10 text-current opacity-50'
      )}
    >
      {label}
    </div>
  );
}
