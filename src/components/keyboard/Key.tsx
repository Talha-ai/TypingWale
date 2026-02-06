/**
 * Key Component - REDESIGNED
 * Shows both English key label AND Hindi character
 * Matches professional typing tutor layout
 */

import { KeyMapping, ModifierState } from '@/types/keyboard.types';
import { cn } from '@/utils/cn';

interface KeyProps {
  mapping: KeyMapping;
  modifierState: ModifierState;
  isPressed?: boolean;
  isNext?: boolean;
  showFingerGuide?: boolean;
  size?: 'normal' | 'large' | 'small';
}

const FINGER_COLORS = [
  'bg-pink-400/30 dark:bg-pink-400/20', // 0: Left Pinky
  'bg-red-400/30 dark:bg-red-400/20', // 1: Left Ring
  'bg-orange-400/30 dark:bg-orange-400/20', // 2: Left Middle
  'bg-yellow-400/30 dark:bg-yellow-400/20', // 3: Left Index
  'bg-green-400/30 dark:bg-green-400/20', // 4: Right Index
  'bg-teal-400/30 dark:bg-teal-400/20', // 5: Right Middle
  'bg-blue-400/30 dark:bg-blue-400/20', // 6: Right Ring
  'bg-purple-400/30 dark:bg-purple-400/20', // 7: Right Pinky
  'bg-gray-400/30 dark:bg-gray-400/20', // 8: Left Thumb
  'bg-gray-400/30 dark:bg-gray-400/20', // 9: Right Thumb
] as const;

export function Key({
  mapping,
  modifierState,
  isPressed = false,
  isNext = false,
  showFingerGuide = false,
}: KeyProps) {
  // Get the character directly from the mapping based on current modifier state
  const displayChar = (() => {
    switch (modifierState) {
      case 'shift':
        return mapping.shift;
      case 'altgr':
        return mapping.altgr;
      case 'altgr-shift':
        return mapping.altgrShift;
      case 'normal':
      default:
        return mapping.normal;
    }
  })();
  const fingerColor = FINGER_COLORS[mapping.finger];

  // Get English key label (remove 'Key' prefix, handle special keys)
  const englishLabel = getEnglishLabel(mapping.key, mapping.label);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'h-11 rounded-md',
        'border-2',
        'select-none cursor-default',
        'shadow-sm transition-all duration-200',

        showFingerGuide ? fingerColor : 'bg-white dark:bg-gray-700',

        isNext
          ? 'border-primary ring-2 ring-primary/50 scale-105'
          : 'border-gray-300 dark:border-gray-600',
        isPressed && 'scale-95'
      )}
    >
      {/* English letter - top left, very small */}
      <div className="absolute top-1 left-1.5 text-[10px] text-gray-600 dark:text-gray-400">
        {englishLabel}
      </div>

      {/* Hindi character - center, large, bold when selected */}
      <div className={cn(
        "font-hindi text-2xl",
        isNext
          ? "font-extrabold text-primary scale-110"
          : "font-semibold text-gray-900 dark:text-gray-100"
      )}>
        {displayChar || '\u00A0'}
      </div>
    </div>
  );
}

function getEnglishLabel(key: string, label?: string): string {
  // Use provided label if available
  if (label && label !== key) return label;

  // Handle special keys
  const specialKeys: Record<string, string> = {
    Backquote: '`',
    Minus: '-',
    Equal: '=',
    BracketLeft: '[',
    BracketRight: ']',
    Backslash: '\\',
    Semicolon: ';',
    Quote: "'",
    Comma: ',',
    Period: '.',
    Slash: '/',
    Space: 'Space',
    Backspace: 'Backspace',
    Tab: 'Tab',
    Enter: 'Enter',
    ShiftLeft: 'Shift',
    ShiftRight: 'Shift',
    CapsLock: 'Caps',
  };

  if (specialKeys[key]) return specialKeys[key];

  // Remove prefixes
  if (key.startsWith('Key')) return key.replace('Key', '');
  if (key.startsWith('Digit')) return key.replace('Digit', '');

  return key;
}

function getKeyWidth(key: string): string {
  const u = '[calc(var(--u))]';

  const widths: Record<string, string> = {
    Backspace: 'w-[calc(var(--u)*2)]',
    Tab: 'w-[calc(var(--u)*1.5)]',
    CapsLock: 'w-[calc(var(--u)*1.75)]',
    Enter: 'w-[calc(var(--u)*2.25)]',
    ShiftLeft: 'w-[calc(var(--u)*2.25)]',
    ShiftRight: 'w-[calc(var(--u)*2.25)]',
    Space: 'w-[calc(var(--u)*6.25)]',
  };

  return widths[key] ?? `w-${u}`;
}
