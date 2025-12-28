/**
 * Practice mode and test result types
 */

import { TypingStats, KeystrokeData } from './keyboard.types';

export type TestDuration = 60 | 180 | 300; // 1, 3, or 5 minutes in seconds
export type TestDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Practice text for typing tests
 */
export interface PracticeText {
  /** Unique identifier */
  id: number;

  /** The text to type */
  text: string;

  /** Difficulty level */
  difficulty: TestDifficulty;

  /** Category or topic */
  category: string;

  /** Approximate character count */
  characterCount?: number;
}

/**
 * Result of a completed typing test
 */
export interface TestResult {
  /** Unique identifier */
  id: string;

  /** Test mode (learn or practice) */
  mode: 'learn' | 'practice';

  /** Test duration in seconds */
  duration: number;

  /** Final statistics */
  stats: TypingStats;

  /** Lesson ID (if in learn mode) */
  lessonId?: number;

  /** Text that was typed */
  textUsed: string;

  /** Complete keystroke history */
  keystrokeHistory: KeystrokeData[];

  /** Timestamp when test was taken */
  timestamp: Date;

  /** Whether test was passed (for lessons) */
  passed?: boolean;
}

/**
 * Test session state
 */
export interface TestSession {
  /** Whether test is active */
  isActive: boolean;

  /** Start time */
  startTime: number | null;

  /** Target text */
  targetText: string;

  /** Duration limit (seconds, optional) */
  durationLimit?: number;

  /** Current typing index */
  currentIndex: number;

  /** Text typed so far */
  typedText: string;

  /** Error indices */
  errors: number[];

  /** Current stats */
  currentStats: TypingStats;
}
