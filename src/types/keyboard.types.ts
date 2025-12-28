/**
 * Keyboard mapping types for Hindi typing platform
 * Supports Remington GAIL layout with 4 modifier states
 */

/**
 * Modifier states for keyboard input
 * - normal: No modifier keys pressed
 * - shift: Shift key held
 * - altgr: Right Alt (AltGr) key held
 * - altgr-shift: Both Right Alt and Shift held
 */
export type ModifierState = 'normal' | 'shift' | 'altgr' | 'altgr-shift';

/**
 * Mapping of a single physical key to Hindi characters across all modifier states
 */
export interface KeyMapping {
  /** Physical key code (e.g., 'KeyA', 'Digit1', 'Space') */
  key: string;

  /** Character output with no modifiers */
  normal: string;

  /** Character output with Shift held */
  shift: string;

  /** Character output with Right Alt (AltGr) held */
  altgr: string;

  /** Character output with Right Alt + Shift held */
  altgrShift: string;

  /** Finger assignment for touch typing (0-9: left pinky to right pinky) */
  finger: number;

  /** Hand assignment */
  hand: 'left' | 'right';

  /** Display label for visual keyboard (optional, defaults to key) */
  label?: string;
}

/**
 * Complete keyboard layout structure
 */
export interface KeyboardLayout {
  /** Name of the keyboard layout */
  name: string;

  /** Description */
  description: string;

  /** Keyboard rows from top to bottom */
  rows: KeyMapping[][];

  /** Modifier key codes */
  modifiers: {
    shift: string[];
    altgr: string[];
  };
}

/**
 * State of a key during typing
 */
export interface KeyState {
  /** Physical key code */
  key: string;

  /** Whether key is currently pressed */
  isPressed: boolean;

  /** Whether the keystroke was correct (null if not yet validated) */
  isCorrect: boolean | null;

  /** Timestamp of key press */
  timestamp: number;

  /** Character that was output */
  character?: string;
}

/**
 * Typing statistics interface
 */
export interface TypingStats {
  /** Words per minute (net WPM) */
  wpm: number;

  /** Gross WPM (before error penalty) */
  grossWPM: number;

  /** Net WPM (after error penalty) */
  netWPM: number;

  /** Accuracy percentage (0-100) */
  accuracy: number;

  /** Number of correct characters typed */
  correctChars: number;

  /** Number of incorrect characters typed */
  incorrectChars: number;

  /** Total characters typed */
  totalChars: number;

  /** Time elapsed in seconds */
  timeElapsed: number;
}

/**
 * Individual keystroke data for analysis
 */
export interface KeystrokeData {
  /** Physical key code */
  key: string;

  /** Character output */
  character: string;

  /** Timestamp of keystroke */
  timestamp: number;

  /** Whether keystroke was correct */
  isCorrect: boolean;

  /** Time since last keystroke (ms) */
  timeSinceLast: number;

  /** Modifier state when key was pressed */
  modifierState: ModifierState;
}
