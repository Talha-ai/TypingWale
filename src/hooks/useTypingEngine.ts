/**
 * useTypingEngine Hook
 * Core typing logic for the Hindi typing platform
 * Handles keystroke detection, validation, and real-time statistics
 * Optimized for <50ms latency
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useKeyPress } from './useKeyPress';
import { useTimer } from './useTimer';
import {
  ModifierState,
  TypingStats,
  KeystrokeData,
} from '@/types/keyboard.types';
import { getCharacterForKey, isTypeableKey } from '@/utils/keyboardMapper';
import { compareHindiChars, normalizeHindiText } from '@/utils/hindiUtils';
import { calculateDetailedStats } from '@/utils/statsCalculator';

type TypingMode = 'learn' | 'practice';

interface UseTypingEngineOptions {
  /** Target text to type */
  targetText: string;

  /** Typing mode */
  mode: TypingMode;

  /** Duration limit in seconds (for practice mode) */
  duration?: number;

  /** Callback when typing completes */
  onComplete?: (stats: TypingStats) => void;

  /** Callback on each keystroke */
  onKeystroke?: (keystroke: KeystrokeData) => void;
}

interface UseTypingEngineReturn {
  /** Current character index */
  currentIndex: number;

  /** Text typed so far */
  typedText: string;

  /** Array of error indices */
  errors: number[];

  /** Complete keystroke history */
  keystrokeHistory: KeystrokeData[];

  /** Whether typing session is active */
  isActive: boolean;

  /** Current elapsed time */
  timeElapsed: number;

  /** Remaining time (practice mode) */
  timeRemaining: number;

  /** Current statistics */
  currentStats: TypingStats;

  /** Current modifier state */
  modifierState: ModifierState;

  /** Whether target text is completed */
  isCompleted: boolean;

  /** Reset the typing session */
  reset: () => void;

  /** Start typing (activates on first keystroke automatically) */
  start: () => void;
}

/**
 * Main typing engine hook
 * Coordinates keyboard input, validation, timing, and statistics
 */
export function useTypingEngine({
  targetText,
  mode,
  duration,
  onComplete,
  keyPress,
}: {
  targetText: string;
  mode: 'learn' | 'practice';
  duration?: number;
  onComplete?: (stats: TypingStats) => void;
  keyPress: {
    modifierState: ModifierState;
    pressedKeys: Set<string>;
    setOnKeyPress: (fn: (key: string, m: ModifierState) => void) => void;
  };
}) {
  const normalizedTarget = useMemo(
    () => normalizeHindiText(targetText),
    [targetText]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [errors, setErrors] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);

  const timer = useTimer({
    duration: mode === 'practice' ? duration : undefined,
    onComplete: () => finish(),
  });

  const isCompleted = currentIndex >= normalizedTarget.length;

  const currentStats = useMemo(
    () =>
      calculateDetailedStats(
        typedText.length,
        typedText.length - errors.length,
        errors.length,
        timer.elapsed || 0.1
      ),
    [typedText.length, errors.length, timer.elapsed]
  );

  const finish = useCallback(() => {
    setIsActive(false);
    timer.pause();
    onComplete?.(currentStats);
  }, [timer, onComplete, currentStats]);

  const handleKeyPress = useCallback(
    (key: string, modifiers: ModifierState) => {
      if (!isTypeableKey(key) || isCompleted) return;

      if (!isActive) {
        setIsActive(true);
        timer.start();
      }

      const char = getCharacterForKey(key, modifiers);
      if (!char) return;

      const expected = normalizedTarget[currentIndex];
      const correct = compareHindiChars(char, expected);

      setTypedText((t) => t + char);
      if (!correct) setErrors((e) => [...e, currentIndex]);

      const next = currentIndex + 1;
      setCurrentIndex(next);

      if (next >= normalizedTarget.length) {
        setTimeout(finish, 50);
      }
    },
    [currentIndex, normalizedTarget, isCompleted, isActive, timer, finish]
  );

  // 🔹 Wire keyboard → engine
  useEffect(() => {
    keyPress.setOnKeyPress(handleKeyPress);
  }, [handleKeyPress, keyPress]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setTypedText('');
    setErrors([]);
    setIsActive(false);
    timer.reset();
  }, [timer]);

  return {
    currentIndex,
    errors,
    currentStats,
    timeElapsed: timer.elapsed,
    modifierState: keyPress.modifierState,
    isCompleted,
    reset,
  };
}