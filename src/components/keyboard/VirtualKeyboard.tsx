/**
 * VirtualKeyboard Component - REDESIGNED
 * Professional typing tutor keyboard layout
 * Shows English keys + Hindi characters, with "Press: X" instruction
 */

import { ModifierState } from '@/types/keyboard.types';
import { useKeyboardMapper } from '@/utils/keyboardMapper';
import { Key } from './Key';
import { cn } from '@/utils/cn';

interface VirtualKeyboardProps {
  modifierState: ModifierState;
  pressedKeys?: Set<string>;
  nextCharacter?: string;
  showFingerGuide?: boolean;
  className?: string;
  isTutorMode?: boolean;
}

const KEY_UNIT = '1.8rem'; // try 3.8 → 4.2 → 4.5

export function VirtualKeyboard({
  modifierState,
  pressedKeys = new Set(),
  nextCharacter,
  showFingerGuide = true,
  className,
  isTutorMode = false,
}: VirtualKeyboardProps) {
  // Use context-aware keyboard mapper
  const mapper = useKeyboardMapper();
  const { currentLayout } = mapper;

  // Find which key produces the next character
  const allNextKeyOptions = nextCharacter
    ? mapper.findKeysForCharacter(nextCharacter)
    : [];

  // Try to find a key matching current modifier state, otherwise use the first option
  const nextKeyInfo =
    allNextKeyOptions.find((info) => info.modifierState === modifierState) ||
    allNextKeyOptions[0];

  const nextKey = nextKeyInfo?.key;
  const needsShift = nextKeyInfo?.modifierState === 'shift';
  const needsAltGr =
    nextKeyInfo?.modifierState === 'altgr' ||
    nextKeyInfo?.modifierState === 'altgr-shift';

  return (
    <div className={cn('select-none flex flex-col', className)}>
      {/* Press instruction - Clean flex layout */}
      {/* {nextCharacter && nextKey && (
        <div className={`flex-none py-4 text-center ${isTutorMode ? 'text-3xl font-bold text-gray-700 dark:text-gray-300' : 'text-base text-gray-600 dark:text-gray-400'}`}>
          <span className={isTutorMode ? '' : 'font-medium'}>Press:</span>{' '}
          <span className={`font-bold ${isTutorMode ? 'text-primary text-4xl' : 'text-primary text-lg'}`}>
            {needsShift && modifierState !== 'shift' ? 'Shift' : getKeyLabel(nextKey)}
          </span>
        </div>
      )} */}

      {/* Keyboard */}
      <div className="flex-none flex justify-center mt-15">
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-xl space-y-2">
          {currentLayout.rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-1"
              style={{
                gridTemplateColumns: getGridTemplateForRow(
                  rowIndex,
                  currentLayout.name,
                ),
                gridAutoColumns: KEY_UNIT,
              }}
            >
              {row.map((keyMapping) => {
                // Shift highlighting logic:
                // 1. If we need shift but haven't pressed it yet, highlight shift keys
                // 2. If we've pressed shift (modifier state is shift), highlight the actual key
                const isShiftHighlighted =
                  needsShift &&
                  modifierState !== 'shift' &&
                  (keyMapping.key === 'ShiftLeft' ||
                    keyMapping.key === 'ShiftRight');
                const isActualKeyHighlighted =
                  needsShift &&
                  modifierState === 'shift' &&
                  nextKey === keyMapping.key;
                const isAltGrHighlighted =
                  needsAltGr && keyMapping.key === 'AltRight';

                // Normal key highlight: only when no modifier needed AND current state is normal
                const isNormalKeyHighlighted =
                  !needsShift &&
                  !needsAltGr &&
                  nextKey === keyMapping.key &&
                  modifierState === 'normal';

                return (
                  <Key
                    key={keyMapping.key}
                    mapping={keyMapping}
                    modifierState={modifierState}
                    isPressed={pressedKeys.has(keyMapping.key)}
                    isNext={
                      isNormalKeyHighlighted || // Normal key (only in normal state)
                      isShiftHighlighted || // Shift key when shift is needed
                      isActualKeyHighlighted || // Actual key after shift is pressed
                      isAltGrHighlighted // AltGr key when needed
                    }
                    showFingerGuide={showFingerGuide}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Get grid template for a keyboard row
 * @param rowIndex - Row index (0-4)
 * @param _layoutName - Name of the layout (for future customization)
 * @returns CSS grid template string
 */
function getGridTemplateForRow(rowIndex: number, _layoutName: string): string {
  const u = 'minmax(3.4rem, 3.4rem)';

  // Both Remington GAIL and INSCRIPT use the same physical keyboard layout
  // Future layouts may override this with custom templates
  // The _layoutName parameter is prefixed with underscore to indicate it's reserved for future use

  switch (rowIndex) {
    // NUMBER ROW
    case 0:
      return `
        repeat(13, ${u})
        minmax(6.8rem, 6.8rem)
      `;

    // QWERTY ROW (NO ENTER NOW)
    case 1:
      return `
        minmax(5.1rem, 5.1rem)   /* Tab */
        repeat(12, ${u})
        minmax(5.1rem, 5.1rem)   /* \\ */
      `;

    // HOME ROW (ENTER MOVED HERE)
    case 2:
      return `
        minmax(5.95rem, 5.95rem) /* Caps */
        repeat(11, ${u})
        minmax(7.65rem, 7.65rem) /* Enter */
      `;

    // BOTTOM ROW
    case 3:
      return `
        minmax(7.65rem, 7.65rem) /* Shift */
        repeat(10, ${u})
        minmax(7.65rem, 7.65rem) /* Shift */
      `;

    // SPACE ROW
    case 4:
      return `
        minmax(4.25rem, 4.25rem)
        minmax(4.25rem, 4.25rem)
        minmax(20.4rem, 20.4rem)
        minmax(4.25rem, 4.25rem)
        minmax(4.25rem, 4.25rem)
      `;

    default:
      return '';
  }
}

function getKeyLabel(key: string): string {
  const labels: Record<string, string> = {
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
  };

  if (labels[key]) return labels[key];
  if (key.startsWith('Key')) return key.replace('Key', '');
  if (key.startsWith('Digit')) return key.replace('Digit', '');
  return key;
}
