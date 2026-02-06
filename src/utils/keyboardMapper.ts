/**
 * Keyboard mapping utility functions
 * Handles conversion between physical keys and Hindi characters
 *
 * IMPORTANT: Components should use the useKeyboardMapper() hook instead of
 * calling these functions directly, to ensure they use the current layout from context.
 */

import { ModifierState, KeyMapping } from '@/types/keyboard.types';
import { KEY_MAP, REMINGTON_GAIL_LAYOUT } from '@/data/keyboardMappings';
import { useKeyboardLayout } from '@/contexts/KeyboardLayoutContext';

/**
 * Get the character output for a given key and modifier state
 * @param key - Physical key code (e.g., 'KeyA', 'Digit1')
 * @param modifierState - Current modifier state
 * @returns The Hindi character or empty string if not found
 */
export function getCharacterForKey(
  key: string,
  modifierState: ModifierState = 'normal'
): string {
  const keyMapping = KEY_MAP.get(key);
  if (!keyMapping) return '';

  switch (modifierState) {
    case 'shift':
      return keyMapping.shift;
    case 'altgr':
      return keyMapping.altgr;
    case 'altgr-shift':
      return keyMapping.altgrShift;
    case 'normal':
    default:
      return keyMapping.normal;
  }
}

/**
 * Find the KeyMapping for a given physical key
 * @param key - Physical key code
 * @returns KeyMapping or undefined if not found
 */
export function findKeyMapping(key: string): KeyMapping | undefined {
  return KEY_MAP.get(key);
}

/**
 * Determine the modifier state based on currently pressed keys
 * @param pressedKeys - Set of currently pressed key codes
 * @returns The current modifier state
 */
export function getModifierState(pressedKeys: Set<string>): ModifierState {
  const hasShift =
    pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
  // AltGr is disabled - ignore it completely
  // const hasAltGr = pressedKeys.has('AltRight');

  // if (hasShift && hasAltGr) {
  //   return 'altgr-shift';
  // }
  // if (hasAltGr) {
  //   return 'altgr';
  // }
  if (hasShift) {
    return 'shift';
  }
  return 'normal';
}

/**
 * Check if a key code represents a modifier key
 * @param key - Physical key code
 * @returns True if key is a modifier
 */
export function isModifierKey(key: string): boolean {
  return (
    key === 'ShiftLeft' ||
    key === 'ShiftRight' ||
    key === 'AltRight' ||
    key === 'ControlLeft' ||
    key === 'ControlRight' ||
    key === 'AltLeft' ||
    key === 'MetaLeft' ||
    key === 'MetaRight'
  );
}

/**
 * Check if a key code represents a typeable key (not a modifier or control key)
 * @param key - Physical key code
 * @returns True if key produces a character
 */
export function isTypeableKey(key: string): boolean {
  if (isModifierKey(key)) return false;
  if (key === 'Backspace' || key === 'Enter' || key === 'Tab' || key === 'Escape') {
    return false;
  }
  return KEY_MAP.has(key);
}

/**
 * Get all characters that can be typed with a given physical key
 * @param key - Physical key code
 * @returns Array of all possible characters [normal, shift, altgr, altgr-shift]
 */
export function getAllCharactersForKey(key: string): string[] {
  const keyMapping = KEY_MAP.get(key);
  if (!keyMapping) return [];

  return [
    keyMapping.normal,
    keyMapping.shift,
    keyMapping.altgr,
    keyMapping.altgrShift,
  ].filter(char => char !== ''); // Remove empty strings
}

/**
 * Find which key(s) and modifier state(s) produce a given character
 * @param character - Hindi character to search for
 * @returns Array of {key, modifierState} combinations that produce the character
 */
export function findKeysForCharacter(character: string): Array<{
  key: string;
  modifierState: ModifierState;
  keyMapping: KeyMapping;
}> {
  const results: Array<{
    key: string;
    modifierState: ModifierState;
    keyMapping: KeyMapping;
  }> = [];

  for (const keyMapping of KEY_MAP.values()) {
    if (keyMapping.normal === character) {
      results.push({ key: keyMapping.key, modifierState: 'normal', keyMapping });
    }
    if (keyMapping.shift === character) {
      results.push({ key: keyMapping.key, modifierState: 'shift', keyMapping });
    }
    if (keyMapping.altgr === character) {
      results.push({ key: keyMapping.key, modifierState: 'altgr', keyMapping });
    }
    if (keyMapping.altgrShift === character) {
      results.push({
        key: keyMapping.key,
        modifierState: 'altgr-shift',
        keyMapping,
      });
    }
  }

  return results;
}

/**
 * Get the row index for a given key (useful for visual keyboard layout)
 * @param key - Physical key code
 * @returns Row index (0-4) or -1 if not found
 */
export function getKeyRow(key: string): number {
  for (let i = 0; i < REMINGTON_GAIL_LAYOUT.rows.length; i++) {
    if (REMINGTON_GAIL_LAYOUT.rows[i].some(k => k.key === key)) {
      return i;
    }
  }
  return -1;
}

/**
 * Get all keys in a specific row
 * @param rowIndex - Row index (0-4)
 * @returns Array of KeyMappings in that row
 */
export function getKeysInRow(rowIndex: number): KeyMapping[] {
  if (rowIndex < 0 || rowIndex >= REMINGTON_GAIL_LAYOUT.rows.length) {
    return [];
  }
  return REMINGTON_GAIL_LAYOUT.rows[rowIndex];
}

/**
 * Get finger assignment description
 * @param finger - Finger number (0-9)
 * @returns Human-readable finger name
 */
export function getFingerName(finger: number): string {
  const fingerNames = [
    'Left Pinky',      // 0
    'Left Ring',       // 1
    'Left Middle',     // 2
    'Left Index',      // 3
    'Right Index',     // 4
    'Right Middle',    // 5
    'Right Ring',      // 6
    'Right Pinky',     // 7
    'Left Thumb',      // 8
    'Right Thumb',     // 9
  ];
  return fingerNames[finger] || 'Unknown';
}

/**
 * Validate if a key combination exists in the layout
 * @param key - Physical key code
 * @param modifierState - Modifier state
 * @returns True if valid combination
 */
export function isValidKeyCombination(
  key: string,
  modifierState: ModifierState
): boolean {
  const character = getCharacterForKey(key, modifierState);
  return character !== '';
}

/**
 * useKeyboardMapper Hook - Context-Aware Keyboard Mapping Utilities
 *
 * This hook provides all keyboard mapping utilities bound to the current layout from context.
 * Use this hook in components instead of calling standalone functions directly.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const mapper = useKeyboardMapper();
 *   const char = mapper.getCharacterForKey('KeyA', 'normal');
 *   const results = mapper.findKeysForCharacter('क');
 *   return <div>{char}</div>;
 * }
 * ```
 */
export function useKeyboardMapper() {
  const { currentLayout, keyMap } = useKeyboardLayout();

  return {
    /**
     * Get the character output for a given key and modifier state
     */
    getCharacterForKey(
      key: string,
      modifierState: ModifierState = 'normal'
    ): string {
      const keyMapping = keyMap.get(key);
      if (!keyMapping) return '';

      switch (modifierState) {
        case 'shift':
          return keyMapping.shift;
        case 'altgr':
          return keyMapping.altgr;
        case 'altgr-shift':
          return keyMapping.altgrShift;
        case 'normal':
        default:
          return keyMapping.normal;
      }
    },

    /**
     * Find the KeyMapping for a given physical key
     */
    findKeyMapping(key: string): KeyMapping | undefined {
      return keyMap.get(key);
    },

    /**
     * Determine the modifier state based on currently pressed keys
     */
    getModifierState(pressedKeys: Set<string>): ModifierState {
      const hasShift =
        pressedKeys.has('ShiftLeft') || pressedKeys.has('ShiftRight');
      // AltGr is disabled - ignore it completely
      // const hasAltGr = pressedKeys.has('AltRight');

      // if (hasShift && hasAltGr) {
      //   return 'altgr-shift';
      // }
      // if (hasAltGr) {
      //   return 'altgr';
      // }
      if (hasShift) {
        return 'shift';
      }
      return 'normal';
    },

    /**
     * Check if a key code represents a typeable key
     */
    isTypeableKey(key: string): boolean {
      if (isModifierKey(key)) return false;
      if (
        key === 'Backspace' ||
        key === 'Enter' ||
        key === 'Tab' ||
        key === 'Escape'
      ) {
        return false;
      }
      return keyMap.has(key);
    },

    /**
     * Get all characters that can be typed with a given physical key
     */
    getAllCharactersForKey(key: string): string[] {
      const keyMapping = keyMap.get(key);
      if (!keyMapping) return [];

      return [
        keyMapping.normal,
        keyMapping.shift,
        keyMapping.altgr,
        keyMapping.altgrShift,
      ].filter((char) => char !== '');
    },

    /**
     * Find which key(s) and modifier state(s) produce a given character
     * NOTE: AltGr and AltGr+Shift are disabled, so only returns normal and shift
     */
    findKeysForCharacter(
      character: string
    ): Array<{
      key: string;
      modifierState: ModifierState;
      keyMapping: KeyMapping;
    }> {
      const results: Array<{
        key: string;
        modifierState: ModifierState;
        keyMapping: KeyMapping;
      }> = [];

      for (const keyMapping of keyMap.values()) {
        // Only check normal and shift (AltGr is disabled)
        if (keyMapping.normal === character) {
          results.push({
            key: keyMapping.key,
            modifierState: 'normal',
            keyMapping,
          });
        }
        if (keyMapping.shift === character) {
          results.push({
            key: keyMapping.key,
            modifierState: 'shift',
            keyMapping,
          });
        }
        // AltGr and AltGr+Shift are disabled - don't include them
      }

      return results;
    },

    /**
     * Get the row index for a given key
     */
    getKeyRow(key: string): number {
      for (let i = 0; i < currentLayout.rows.length; i++) {
        if (currentLayout.rows[i].some((k) => k.key === key)) {
          return i;
        }
      }
      return -1;
    },

    /**
     * Get all keys in a specific row
     */
    getKeysInRow(rowIndex: number): KeyMapping[] {
      if (rowIndex < 0 || rowIndex >= currentLayout.rows.length) {
        return [];
      }
      return currentLayout.rows[rowIndex];
    },

    /**
     * Validate if a key combination exists in the layout
     */
    isValidKeyCombination(
      key: string,
      modifierState: ModifierState
    ): boolean {
      const character = this.getCharacterForKey(key, modifierState);
      return character !== '';
    },

    /** Reference to current layout */
    currentLayout,

    /** Reference to current keyMap */
    keyMap,
  };
}
