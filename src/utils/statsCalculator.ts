/**
 * Statistics calculation utilities for typing tests
 * Implements standard WPM calculation (5-character rule)
 */

import { TypingStats } from '@/types/keyboard.types';

/**
 * Calculate Words Per Minute (WPM) using the standard 5-character rule
 *
 * Standard WPM calculation:
 * - 1 word = 5 characters (including spaces)
 * - Gross WPM = (Total characters / 5) / (Time in minutes)
 * - Net WPM = Gross WPM - (Errors / 5) / (Time in minutes)
 *
 * @param characterCount - Total number of characters typed
 * @param timeInSeconds - Time elapsed in seconds
 * @param errorCount - Number of errors (for net WPM)
 * @returns WPM (rounded to nearest integer)
 */
export function calculateWPM(
  characterCount: number,
  timeInSeconds: number,
  errorCount: number = 0
): number {
  if (timeInSeconds === 0) return 0;

  const timeInMinutes = timeInSeconds / 60;
  const grossWords = characterCount / 5;
  const grossWPM = grossWords / timeInMinutes;

  // Net WPM accounts for errors
  const errorPenalty = errorCount / 5;
  const netWPM = Math.max(0, grossWPM - errorPenalty / timeInMinutes);

  return Math.round(netWPM);
}

/**
 * Calculate Gross WPM (without error penalty)
 * @param characterCount - Total number of characters typed
 * @param timeInSeconds - Time elapsed in seconds
 * @returns Gross WPM
 */
export function calculateGrossWPM(
  characterCount: number,
  timeInSeconds: number
): number {
  if (timeInSeconds === 0) return 0;

  const timeInMinutes = timeInSeconds / 60;
  const words = characterCount / 5;
  const grossWPM = words / timeInMinutes;

  return Math.round(grossWPM);
}

/**
 * Calculate Net WPM (with error penalty)
 * @param characterCount - Total number of characters typed
 * @param timeInSeconds - Time elapsed in seconds
 * @param errorCount - Number of errors
 * @returns Net WPM
 */
export function calculateNetWPM(
  characterCount: number,
  timeInSeconds: number,
  errorCount: number
): number {
  if (timeInSeconds === 0) return 0;

  const grossWPM = calculateGrossWPM(characterCount, timeInSeconds);
  const timeInMinutes = timeInSeconds / 60;
  const errorPenalty = (errorCount / 5) / timeInMinutes;

  return Math.max(0, Math.round(grossWPM - errorPenalty));
}

/**
 * Calculate accuracy percentage
 * Accuracy = (Correct characters / Total characters) × 100
 *
 * @param correctCount - Number of correct characters
 * @param totalCount - Total characters typed
 * @returns Accuracy percentage (0-100, rounded to 2 decimal places)
 */
export function calculateAccuracy(
  correctCount: number,
  totalCount: number
): number {
  if (totalCount === 0) return 100;

  const accuracy = (correctCount / totalCount) * 100;
  return Math.round(accuracy * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate detailed typing statistics
 * @param typedCharCount - Total characters typed
 * @param correctCharCount - Number of correct characters
 * @param errorCount - Number of errors
 * @param timeInSeconds - Time elapsed in seconds
 * @returns Complete TypingStats object
 */
export function calculateDetailedStats(
  typedCharCount: number,
  correctCharCount: number,
  errorCount: number,
  timeInSeconds: number
): TypingStats {
  const grossWPM = calculateGrossWPM(typedCharCount, timeInSeconds);
  const netWPM = calculateNetWPM(typedCharCount, timeInSeconds, errorCount);
  const accuracy = calculateAccuracy(correctCharCount, typedCharCount);

  return {
    wpm: netWPM,
    grossWPM,
    netWPM,
    accuracy,
    correctChars: correctCharCount,
    incorrectChars: errorCount,
    totalChars: typedCharCount,
    timeElapsed: timeInSeconds,
  };
}

/**
 * Calculate CPM (Characters Per Minute)
 * Alternative metric that's sometimes clearer than WPM
 *
 * @param characterCount - Total characters typed
 * @param timeInSeconds - Time elapsed in seconds
 * @returns Characters per minute
 */
export function calculateCPM(
  characterCount: number,
  timeInSeconds: number
): number {
  if (timeInSeconds === 0) return 0;

  const timeInMinutes = timeInSeconds / 60;
  return Math.round(characterCount / timeInMinutes);
}

/**
 * Calculate average keystroke interval
 * Useful for analyzing typing rhythm and consistency
 *
 * @param totalKeystrokes - Total number of keystrokes
 * @param timeInSeconds - Total time in seconds
 * @returns Average milliseconds between keystrokes
 */
export function calculateAverageKeystrokeInterval(
  totalKeystrokes: number,
  timeInSeconds: number
): number {
  if (totalKeystrokes <= 1) return 0;

  const totalMilliseconds = timeInSeconds * 1000;
  return Math.round(totalMilliseconds / (totalKeystrokes - 1));
}

/**
 * Determine performance level based on WPM
 * @param wpm - Words per minute
 * @returns Performance level description
 */
export function getPerformanceLevel(wpm: number): {
  level: string;
  description: string;
  color: string;
} {
  if (wpm < 10) {
    return {
      level: 'Beginner',
      description: 'Keep practicing! Speed will come with time.',
      color: 'text-gray-500',
    };
  } else if (wpm < 20) {
    return {
      level: 'Novice',
      description: 'You\'re making progress. Focus on accuracy.',
      color: 'text-blue-500',
    };
  } else if (wpm < 30) {
    return {
      level: 'Intermediate',
      description: 'Good progress! Keep building muscle memory.',
      color: 'text-green-500',
    };
  } else if (wpm < 40) {
    return {
      level: 'Advanced',
      description: 'Excellent typing speed!',
      color: 'text-purple-500',
    };
  } else if (wpm < 50) {
    return {
      level: 'Expert',
      description: 'Outstanding! You\'re a proficient typist.',
      color: 'text-orange-500',
    };
  } else {
    return {
      level: 'Master',
      description: 'Exceptional speed! You\'re among the best.',
      color: 'text-red-500',
    };
  }
}

/**
 * Determine accuracy level
 * @param accuracy - Accuracy percentage
 * @returns Accuracy level description
 */
export function getAccuracyLevel(accuracy: number): {
  level: string;
  description: string;
  color: string;
} {
  if (accuracy >= 98) {
    return {
      level: 'Excellent',
      description: 'Near-perfect accuracy!',
      color: 'text-green-600',
    };
  } else if (accuracy >= 95) {
    return {
      level: 'Very Good',
      description: 'Great accuracy!',
      color: 'text-green-500',
    };
  } else if (accuracy >= 90) {
    return {
      level: 'Good',
      description: 'Good accuracy. Minor improvements needed.',
      color: 'text-blue-500',
    };
  } else if (accuracy >= 85) {
    return {
      level: 'Fair',
      description: 'Decent accuracy. Focus on reducing errors.',
      color: 'text-yellow-500',
    };
  } else if (accuracy >= 80) {
    return {
      level: 'Needs Improvement',
      description: 'Slow down and focus on accuracy.',
      color: 'text-orange-500',
    };
  } else {
    return {
      level: 'Poor',
      description: 'Accuracy needs significant improvement.',
      color: 'text-red-500',
    };
  }
}

/**
 * Format time in seconds to readable format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "2:34", "0:45")
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate progress percentage
 * @param current - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}
