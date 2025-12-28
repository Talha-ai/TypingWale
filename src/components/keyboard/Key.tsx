/**
 * Key Component - REDESIGNED
 * Shows both English key label AND Hindi character
 * Matches professional typing tutor layout
 */

import { KeyMapping, ModifierState } from '@/types/keyboard.types';
import { getCharacterForKey } from '@/utils/keyboardMapper';
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
  'bg-pink-400/80', // 0: Left Pinky
  'bg-red-400/80', // 1: Left Ring
  'bg-orange-400/80', // 2: Left Middle
  'bg-yellow-400/80', // 3: Left Index
  'bg-green-400/80', // 4: Right Index
  'bg-teal-400/80', // 5: Right Middle
  'bg-blue-400/80', // 6: Right Ring
  'bg-purple-400/80', // 7: Right Pinky
  'bg-gray-400/80', // 8: Left Thumb
  'bg-gray-400/80', // 9: Right Thumb
] as const;

export function Key({
  mapping,
  modifierState,
  isPressed = false,
  isNext = false,
  showFingerGuide = false,
}: KeyProps) {
  const displayChar = getCharacterForKey(mapping.key, modifierState);
  const fingerColor = FINGER_COLORS[mapping.finger];

  // Get English key label (remove 'Key' prefix, handle special keys)
  const englishLabel = getEnglishLabel(mapping.key, mapping.label);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'h-11 rounded-md',
        'border border-gray-300 dark:border-gray-600',
        'select-none cursor-default',
        'shadow-sm',

        showFingerGuide ? fingerColor : 'bg-white dark:bg-gray-700',

        isNext && 'ring-2 ring-black dark:ring-white',
        isPressed && 'scale-95'
      )}
    >
      {/* English letter - top left, very small */}
      <div className="absolute top-1 left-1.5 text-[10px] text-gray-600 dark:text-gray-400">
        {englishLabel}
      </div>

      {/* Hindi character - center, large */}
      <div className="font-hindi text-2xl font-semibold text-gray-900 dark:text-gray-100">
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
