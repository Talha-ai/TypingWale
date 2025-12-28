/**
 * useKeyPress Hook
 * Handles low-level keyboard event detection and modifier state tracking
 * Optimized for <50ms latency
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ModifierState } from '@/types/keyboard.types';
import { getModifierState, isModifierKey } from '@/utils/keyboardMapper';

interface UseKeyPressOptions {
  /** Whether to capture events (default: true) */
  enabled?: boolean;

  /** Callback when a typeable key is pressed */
  onKeyPress?: (key: string, modifiers: ModifierState) => void;

  /** Callback when any key is released */
  onKeyRelease?: (key: string) => void;
}

interface UseKeyPressReturn {
  /** Set of currently pressed keys */
  pressedKeys: Set<string>;

  /** Current modifier state */
  modifierState: ModifierState;

  /** Whether any key is currently pressed */
  isAnyKeyPressed: boolean;

  /** Reset all pressed keys */
  reset: () => void;
}

/**
 * Hook for tracking keyboard events and modifier states
 * Provides real-time key press detection with minimal latency
 */
export function useKeyPress({ enabled = true } = {}) {
  const pressedRef = useRef<Set<string>>(new Set());
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [modifierState, setModifierState] = useState<ModifierState>('normal');

  const onKeyPressRef = useRef<
    ((key: string, m: ModifierState) => void) | null
  >(null);

  const setOnKeyPress = useCallback((fn: ((key: string, m: ModifierState) => void) | null) => {
    onKeyPressRef.current = fn;
  }, []);

  const handleDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const { code } = e;
      if (!isModifierKey(code)) e.preventDefault();

      if (pressedRef.current.has(code)) return;

      const next = new Set(pressedRef.current);
      next.add(code);
      pressedRef.current = next;
      setPressedKeys(new Set(next));

      const m = getModifierState(next);
      setModifierState(m);

      if (!isModifierKey(code)) {
        onKeyPressRef.current?.(code, m);
      }
    },
    [enabled]
  );

  const handleUp = useCallback((e: KeyboardEvent) => {
    const next = new Set(pressedRef.current);
    next.delete(e.code);
    pressedRef.current = next;
    setPressedKeys(new Set(next));
    setModifierState(getModifierState(next));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [enabled, handleDown, handleUp]);

  return {
    pressedKeys,
    modifierState,
    setOnKeyPress,
  };
}
