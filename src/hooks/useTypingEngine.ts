/**
 * useTypingEngine Hook
 * Core typing logic for the Hindi typing platform
 * Handles keystroke detection, validation, and real-time statistics
 * Optimized for <50ms latency
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useTimer } from './useTimer';
import {
  ModifierState,
  TypingStats,
  KeystrokeData,
} from '@/types/keyboard.types';
import { useKeyboardMapper } from '@/utils/keyboardMapper';
import { compareHindiChars, normalizeHindiText } from '@/utils/hindiUtils';
import { calculateDetailedStats } from '@/utils/statsCalculator';
import { soundEffects } from '@/utils/soundEffects';
import { decomposeTargetText } from '@/utils/hindiComposition';

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
  isTutorMode = false,
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
  isTutorMode?: boolean;
}) {
  // 🔹 Use context-aware keyboard mapper
  const mapper = useKeyboardMapper();

  // Normalize and decompose the target text into keystroke sequences
  const normalizedTarget = useMemo(
    () => decomposeTargetText(normalizeHindiText(targetText)),
    [targetText]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [errors, setErrors] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Track if last typed character was a multi-char unit (like म्) for dummy backspace
  const [needsDummyBackspace, setNeedsDummyBackspace] = useState(false);

  const timer = useTimer({
    duration: mode === 'practice' ? duration : undefined,
    onComplete: () => finish(),
  });

  const isCompleted = currentIndex >= normalizedTarget.length;

  // Throttle stats calculation to every 200ms instead of every keystroke
  const lastStatsUpdateRef = useRef(0);
  const [cachedStats, setCachedStats] = useState<TypingStats>({
    wpm: 0,
    grossWPM: 0,
    netWPM: 0,
    accuracy: 100,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    timeElapsed: 0,
  });

  // Update stats only every 200ms to reduce lag
  useEffect(() => {
    const now = Date.now();
    if (now - lastStatsUpdateRef.current > 200 || isCompleted) {
      const stats = calculateDetailedStats(
        typedText.length,
        typedText.length - errors.length,
        errors.length,
        (timer.elapsed || 100) / 1000
      );
      setCachedStats(stats);
      lastStatsUpdateRef.current = now;
    }
  }, [typedText.length, errors.length, timer.elapsed, isCompleted]);

  const currentStats = cachedStats;

  const finish = useCallback(() => {
    setIsActive(false);
    timer.pause();
    onComplete?.(currentStats);
  }, [timer, onComplete, currentStats]);

  const handleKeyPress = useCallback(
    (key: string, modifiers: ModifierState) => {
      if (isCompleted) return;

      // Handle backspace
      if (key === 'Backspace' && currentIndex > 0) {
        requestAnimationFrame(() => soundEffects.playBackspace());

        // Check if we need a dummy backspace (for multi-char units like म्)
        if (needsDummyBackspace) {
          // First backspace: just remove the "needs dummy" flag
          // This shows the actual म् instead of rendered half-form
          // Don't remove any text, just the visual rendering flag
          setNeedsDummyBackspace(false);
          return;
        }

        // Normal backspace: remove one character at a time
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        setTypedText((t) => t.slice(0, -1));
        // Remove error at previous position if it exists
        setErrors((e) => e.filter((idx) => idx !== prevIndex));

        return;
      }

      if (!mapper.isTypeableKey(key)) return;

      if (!isActive) {
        setIsActive(true);
        timer.start();
      }

      const char = mapper.getCharacterForKey(key, modifiers);
      if (!char) return;

      // Handle multi-character outputs (e.g., Shift+; → "रू", Shift+E → "म्")
      const charLength = char.length;
      const expectedSequence = normalizedTarget.slice(currentIndex, currentIndex + charLength);
      const correct = compareHindiChars(char, expectedSequence);

      // Check if this is a half-form (ends with halant) for dummy backspace
      // Examples: म् (2 chars), क्ष् (4 chars), etc.
      const HALANT = '\u094D';
      const isHalfForm = charLength >= 2 && char[char.length - 1] === HALANT;
      if (isHalfForm) {
        setNeedsDummyBackspace(true);
      } else {
        setNeedsDummyBackspace(false);
      }

      // In tutor mode, block wrong key presses
      // TEMPORARILY DISABLED FOR TESTING - uncomment to re-enable blocking
      // if (isTutorMode && !correct) {
      //   requestAnimationFrame(() => soundEffects.playIncorrect());
      //   return;
      // }

      // Play sound effect asynchronously (non-blocking)
      requestAnimationFrame(() => {
        if (correct) {
          soundEffects.playCorrect();
        } else {
          soundEffects.playIncorrect();
        }
      });

      // Advance by the length of the character output
      // Single characters advance by 1, multi-character outputs (like रू) advance by their length
      const next = currentIndex + charLength;

      // Batch state updates for better performance
      setTypedText((t) => t + char);
      setCurrentIndex(next);
      if (!correct) {
        // Mark all positions covered by this keystroke as errors if incorrect
        for (let i = 0; i < charLength; i++) {
          setErrors((e) => [...e, currentIndex + i]);
        }
      }

      if (next >= normalizedTarget.length) {
        requestAnimationFrame(() => soundEffects.playCompletion());
        setTimeout(finish, 50);
      }
    },
    [currentIndex, normalizedTarget, isCompleted, isActive, timer, finish, mapper, typedText, isTutorMode]
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

  // Get the next expected character (from decomposed text)
  // Check if the next characters form a multi-character sequence produced by a single key
  const nextExpectedChar = useMemo(() => {
    if (currentIndex >= normalizedTarget.length) return '';

    const HALANT = '\u094D';
    const RA = '\u0930'; // र
    const currentChar = normalizedTarget[currentIndex];
    const nextChar = normalizedTarget[currentIndex + 1] || '';
    const charAfterNext = normalizedTarget[currentIndex + 2] || '';

    // Known multi-character sequences that are typed with a single key
    // Order matters: longer sequences should be checked first
    // CHECK THIS BEFORE half-form check to catch क्ष्, त्र, etc.
    const knownSequences = [
      'क्ष्', // Shift+[ (half form of ksha) - 4 chars, must be first
      'त्र',  // Shift+9
      'द्ध',  // Shift+8
      'द्य',  // Shift+`
      'श्र',  // Shift+J
      'ज्ञ',  // Shift+K
      'रू',   // Shift+;
      'र्',   // Shift+X (reph - ra + halant, typed after consonant with inverted logic)
      '्र',   // KeyZ (rakar - ra below consonant, typed after consonant)
    ];

    // Check if the next characters match a known multi-character sequence
    for (const knownSeq of knownSequences) {
      const nextChars = normalizedTarget.slice(currentIndex, currentIndex + knownSeq.length);
      if (nextChars === knownSeq) {
        // Verify that a key actually produces this sequence
        const keys = mapper.findKeysForCharacter(knownSeq);
        if (keys.length > 0) {
          return knownSeq;
        }
      }
    }

    // Check if current char is a consonant followed by halant (half-form)
    // This handles भ्, ध्, घ्, थ्, म्, etc.
    // BUT NOT if it's a rakar pattern (consonant + halant + र)
    // For rakar, user types: consonant + ्र (KeyZ)
    if (nextChar === HALANT && charAfterNext !== RA) {
      const halfForm = currentChar + HALANT;
      // Verify that a key produces this half-form
      const keys = mapper.findKeysForCharacter(halfForm);
      if (keys.length > 0) {
        return halfForm;
      }
    }

    // Default: return single character
    return normalizedTarget[currentIndex] || '';
  }, [currentIndex, normalizedTarget, mapper]);

  return {
    currentIndex,
    typedText,
    errors,
    currentStats,
    timeElapsed: timer.elapsed,
    modifierState: keyPress.modifierState,
    isCompleted,
    reset,
    /** The next character expected to be typed (from decomposed/normalized text) */
    nextExpectedChar,
    /** The decomposed target text (for debugging/display) */
    normalizedTarget,
    /** Whether a dummy backspace is needed for visual feedback */
    needsDummyBackspace,
  };
}