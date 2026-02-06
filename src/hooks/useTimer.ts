/**
 * useTimer Hook
 * Handles countdown and elapsed time tracking for typing tests
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  /** Duration limit in seconds (optional, for countdown mode) */
  duration?: number;

  /** Callback when timer completes */
  onComplete?: () => void;

  /** Update interval in milliseconds (default: 100ms) */
  updateInterval?: number;
}

interface UseTimerReturn {
  /** Current elapsed time in milliseconds */
  elapsed: number;

  /** Remaining time in milliseconds (if duration is set) */
  remaining: number;

  /** Whether timer is currently running */
  isRunning: boolean;

  /** Start or resume the timer */
  start: () => void;

  /** Pause the timer */
  pause: () => void;

  /** Reset the timer to 0 */
  reset: () => void;

  /** Stop and reset the timer */
  stop: () => void;
}

/**
 * Hook for managing typing test timers
 * Supports both elapsed time tracking and countdown mode
 */
export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { duration, onComplete, updateInterval = 100 } = options;

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  /**
   * Calculate remaining time (for countdown mode)
   */
  const remaining = duration ? Math.max(0, duration * 1000 - elapsed) : 0;

  /**
   * Update elapsed time
   */
  const updateTime = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const newElapsed = now - startTimeRef.current + pausedTimeRef.current;

    setElapsed(newElapsed);

    // Check if duration is reached (duration is in seconds, newElapsed is in ms)
    if (duration && newElapsed >= duration * 1000 && !completedRef.current) {
      completedRef.current = true;
      setIsRunning(false);

      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (onComplete) {
        onComplete();
      }
    }
  }, [duration, onComplete]);

  /**
   * Start the timer
   */
  const start = useCallback(() => {
    if (isRunning) return;

    completedRef.current = false;
    startTimeRef.current = Date.now();
    setIsRunning(true);

    // Start interval for updating
    intervalRef.current = window.setInterval(updateTime, updateInterval);
  }, [isRunning, updateInterval, updateTime]);

  /**
   * Pause the timer
   */
  const pause = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Store paused time
    if (startTimeRef.current) {
      pausedTimeRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
  }, [isRunning]);

  /**
   * Reset the timer to 0
   */
  const reset = useCallback(() => {
    setElapsed(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    completedRef.current = false;

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Stop and reset the timer
   */
  const stop = useCallback(() => {
    setIsRunning(false);
    reset();
  }, [reset]);

  /**
   * Cleanup interval on unmount
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    elapsed,
    remaining,
    isRunning,
    start,
    pause,
    reset,
    stop,
  };
}
