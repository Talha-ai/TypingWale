import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Settings2,
  RotateCcw,
  Pause,
  Play,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard';
import { useKeyboardLayout } from '@/contexts/KeyboardLayoutContext';
import { useKeyboardMapper } from '@/utils/keyboardMapper';
import { useKeyPress } from '@/hooks/useKeyPress';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useTimer } from '@/hooks/useTimer';
import { soundEffects } from '@/utils/soundEffects';
import { decomposeTargetText } from '@/utils/hindiComposition';
import { normalizeHindiText, splitIntoGraphemes } from '@/utils/hindiUtils';
import { getLessonById, getTotalLessons } from '@/data/lessons';

// Free practice text
const FREE_PRACTICE_TEXT = `भारत एक विशाल देश है जहाँ विविध भाषा, संस्कृति और परंपराएँ पाई जाती हैं। प्राचीन काल से यहाँ शिक्षा, धर्म, कर्म, ज्ञान और विज्ञान का विशेष महत्व रहा है। शर्मा, वर्मा और गुप्ता जैसे नाम सामान्य रूप से प्रयोग में आते हैं। छात्र कक्षा में प्रश्न, उत्तर, अभ्यास और मूल्यांकन पर ध्यान देते हैं। कृषि, उद्योग, व्यापार और तकनीक देश की अर्थव्यवस्था को सशक्त बनाते हैं। पर्यावरण संरक्षण, स्वास्थ्य सेवा और सामाजिक न्याय आज की प्रमुख आवश्यकता हैं। कठिन परिश्रम, आत्मविश्वास और अनुशासन से व्यक्ति लक्ष्य प्राप्त करता है। कंप्यूटर, मोबाइल, इंटरनेट और कृत्रिम बुद्धिमत्ता ने कार्य प्रणाली को सरल बनाया है। हमें समय का सदुपयोग करते हुए सत्य, अहिंसा और सहयोग के मार्ग पर चलना चाहिए।`;

const TEST_PRACTICE_TEXT = 'भारत एक विशाल देश है जहाँ विविध भाषा, संस्कृति और परंपराएँ पाई जाती हैं। प्राचीन काल से यहाँ शिक्षा, धर्म, कर्म, ज्ञान और विज्ञान का विशेष महत्व रहा है। शर्मा, वर्मा और गुप्ता जैसे नाम सामान्य रूप से प्रयोग में आते हैं। छात्र कक्षा में प्रश्न, उत्तर, अभ्यास और मूल्यांकन पर ध्यान देते हैं। कृषि, उद्योग, व्यापार और तकनीक देश की अर्थव्यवस्था को सशक्त बनाते हैं। पर्यावरण संरक्षण, स्वास्थ्य सेवा और सामाजिक न्याय आज की प्रमुख आवश्यकता हैं। कठिन परिश्रम, आत्मविश्वास और अनुशासन से व्यक्ति लक्ष्य प्राप्त करता है। कंप्यूटर, मोबाइल, इंटरनेट और कृत्रिम बुद्धिमत्ता ने कार्य प्रणाली को सरल बनाया है। हमें समय का सदुपयोग करते हुए सत्य, अहिंसा और सहयोग के मार्ग पर चलना चाहिए।';

type PracticeMode = 'tutor' | 'free' | 'test';

// Finger mapping for standard keyboard
const fingerMap: Record<string, { hand: 'left' | 'right'; finger: number }> = {
  // Left hand - pinky (0), ring (1), middle (2), index (3)
  Backquote: { hand: 'left', finger: 0 },
  Digit1: { hand: 'left', finger: 0 },
  Digit2: { hand: 'left', finger: 1 },
  Digit3: { hand: 'left', finger: 2 },
  Digit4: { hand: 'left', finger: 3 },
  Digit5: { hand: 'left', finger: 3 },
  Tab: { hand: 'left', finger: 0 },
  KeyQ: { hand: 'left', finger: 0 },
  KeyW: { hand: 'left', finger: 1 },
  KeyE: { hand: 'left', finger: 2 },
  KeyR: { hand: 'left', finger: 3 },
  KeyT: { hand: 'left', finger: 3 },
  CapsLock: { hand: 'left', finger: 0 },
  KeyA: { hand: 'left', finger: 0 },
  KeyS: { hand: 'left', finger: 1 },
  KeyD: { hand: 'left', finger: 2 },
  KeyF: { hand: 'left', finger: 3 },
  KeyG: { hand: 'left', finger: 3 },
  ShiftLeft: { hand: 'left', finger: 0 },
  KeyZ: { hand: 'left', finger: 0 },
  KeyX: { hand: 'left', finger: 1 },
  KeyC: { hand: 'left', finger: 2 },
  KeyV: { hand: 'left', finger: 3 },
  KeyB: { hand: 'left', finger: 3 },
  ControlLeft: { hand: 'left', finger: 0 },
  AltLeft: { hand: 'left', finger: 0 },
  Space: { hand: 'left', finger: 4 }, // Thumb
  // Right hand - index (3), middle (2), ring (1), pinky (0)
  Digit6: { hand: 'right', finger: 3 },
  Digit7: { hand: 'right', finger: 3 },
  Digit8: { hand: 'right', finger: 2 },
  Digit9: { hand: 'right', finger: 1 },
  Digit0: { hand: 'right', finger: 0 },
  Minus: { hand: 'right', finger: 0 },
  Equal: { hand: 'right', finger: 0 },
  Backspace: { hand: 'right', finger: 0 },
  KeyY: { hand: 'right', finger: 3 },
  KeyU: { hand: 'right', finger: 3 },
  KeyI: { hand: 'right', finger: 2 },
  KeyO: { hand: 'right', finger: 1 },
  KeyP: { hand: 'right', finger: 0 },
  BracketLeft: { hand: 'right', finger: 0 },
  BracketRight: { hand: 'right', finger: 0 },
  Backslash: { hand: 'right', finger: 0 },
  KeyH: { hand: 'right', finger: 3 },
  KeyJ: { hand: 'right', finger: 3 },
  KeyK: { hand: 'right', finger: 2 },
  KeyL: { hand: 'right', finger: 1 },
  Semicolon: { hand: 'right', finger: 0 },
  Quote: { hand: 'right', finger: 0 },
  Enter: { hand: 'right', finger: 0 },
  KeyN: { hand: 'right', finger: 3 },
  KeyM: { hand: 'right', finger: 3 },
  Comma: { hand: 'right', finger: 2 },
  Period: { hand: 'right', finger: 1 },
  Slash: { hand: 'right', finger: 0 },
  ShiftRight: { hand: 'right', finger: 0 },
  AltRight: { hand: 'right', finger: 0 },
  ControlRight: { hand: 'right', finger: 0 },
};

// Hand SVG Component with finger highlighting
function HandSVG({
  side,
  activeFingers,
  needsShift,
  needsAltGr,
}: {
  side: 'left' | 'right';
  activeFingers: number[];
  needsShift?: boolean;
  needsAltGr?: boolean;
}) {
  const isLeft = side === 'left';

  // Finger positions (from pinky to index, then thumb)
  // For left hand: pinky(0), ring(1), middle(2), index(3), thumb(4)
  // For right hand: index(3), middle(2), ring(1), pinky(0), thumb(4)
  const fingerColors = [0, 1, 2, 3, 4].map((finger) =>
    activeFingers.includes(finger) ? '#22c55e' : '#6b7280',
  );

  return (
    <div className="flex flex-col items-center">
      <svg
        width="140"
        height="180"
        viewBox="0 0 140 180"
        className={`${isLeft ? '' : 'scale-x-[-1]'}`}
      >
        {/* Palm */}
        <path
          d="M30 90 Q25 120 35 150 Q50 170 70 175 Q90 170 105 150 Q115 120 110 90 Q105 85 100 80 L40 80 Q35 85 30 90"
          fill="#d1d5db"
          className="dark:fill-gray-600"
        />

        {/* Pinky - finger 0 */}
        <rect
          x="25"
          y="25"
          width="16"
          height="60"
          rx="8"
          fill={isLeft ? fingerColors[0] : fingerColors[0]}
          className="transition-colors duration-200"
        />

        {/* Ring - finger 1 */}
        <rect
          x="45"
          y="10"
          width="18"
          height="75"
          rx="9"
          fill={isLeft ? fingerColors[1] : fingerColors[1]}
          className="transition-colors duration-200"
        />

        {/* Middle - finger 2 */}
        <rect
          x="67"
          y="5"
          width="18"
          height="80"
          rx="9"
          fill={isLeft ? fingerColors[2] : fingerColors[2]}
          className="transition-colors duration-200"
        />

        {/* Index - finger 3 */}
        <rect
          x="89"
          y="15"
          width="18"
          height="70"
          rx="9"
          fill={isLeft ? fingerColors[3] : fingerColors[3]}
          className="transition-colors duration-200"
        />

        {/* Thumb - finger 4 */}
        <ellipse
          cx="115"
          cy="130"
          rx="15"
          ry="30"
          fill={fingerColors[4]}
          transform={isLeft ? 'rotate(-20 115 130)' : 'rotate(-20 115 130)'}
          className="transition-colors duration-200"
        />
      </svg>

      <p className="text-sm text-muted-foreground mt-1 mb-5">
        {isLeft ? 'Left Hand' : 'Right Hand'}
      </p>

      {/* Modifier indicators */}
      <div className="flex gap-1 mt-2 h-6">
        {needsShift && isLeft && (
          <Badge variant="secondary" className="text-xs">
            Shift
          </Badge>
        )}
        {needsAltGr && !isLeft && (
          <Badge variant="secondary" className="text-xs">
            AltGr
          </Badge>
        )}
      </div>
    </div>
  );
}

export function PracticePage() {
  const { mode = 'free', lessonId } = useParams<{ mode: PracticeMode; lessonId?: string }>();
  const navigate = useNavigate();
  const { currentLayoutId, setLayout, availableLayouts } = useKeyboardLayout();
  const { findKeysForCharacter } = useKeyboardMapper();
  const keyPress = useKeyPress({ enabled: true });
  const { pressedKeys, modifierState } = keyPress;
  const [isPaused, setIsPaused] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Get current lesson ID (default to 1 for tutor mode)
  const currentLessonId = lessonId ? parseInt(lessonId, 10) : 1;
  const totalLessons = getTotalLessons();

  // Get current practice content based on mode
  const currentPractice = useMemo(() => {
    if (mode === 'tutor') {
      const lesson = getLessonById(currentLessonId);
      if (lesson) {
        return {
          title: `Lesson ${lesson.id}: ${lesson.title}`,
          description: lesson.focus,
          text: lesson.text,
        };
      }
    }

    if (mode === 'test') {
      return {
        title: 'CPCT Practice Test',
        description: '5 minute timed test',
        text: TEST_PRACTICE_TEXT,
      };
    }

    // Default: free mode
    return {
      title: 'Free Practice',
      description: 'Practice typing at your own pace',
      text: FREE_PRACTICE_TEXT,
    };
  }, [mode, currentLessonId]);

  // Navigate to next/previous lesson
  const goToLesson = (id: number) => {
    if (id >= 1 && id <= totalLessons) {
      navigate(`/practice/tutor/${id}`);
    }
  };

  const {
    currentIndex,
    typedText,
    errors,
    currentStats,
    isCompleted: isComplete,
    reset,
    nextExpectedChar,
    normalizedTarget,
  } = useTypingEngine({
    targetText: currentPractice.text,
    mode: mode === 'test' ? 'practice' : 'learn',
    keyPress,
    onComplete: () => {
      setShowCompleteDialog(true);
    },
    isTutorMode: mode === 'tutor',
  });

  const { elapsed, isRunning, start, pause, reset: resetTimer } = useTimer();

  // Decompose target text for index mapping (same as typing engine does)
  const decomposedText = useMemo(
    () => decomposeTargetText(normalizeHindiText(currentPractice.text)),
    [currentPractice.text],
  );

  // Pre-calculate grapheme to decomposed index mapping for proper error highlighting
  const graphemeToDecomposedIndex = useMemo(() => {
    const graphemes = splitIntoGraphemes(currentPractice.text);
    const mapping: number[] = [];

    for (let i = 0; i < graphemes.length; i++) {
      const prefixGraphemes = graphemes.slice(0, i);
      const prefixComposed = prefixGraphemes.join('');
      const prefixDecomposed = decomposeTargetText(
        normalizeHindiText(prefixComposed),
      );
      mapping.push(prefixDecomposed.length);
    }

    return mapping;
  }, [currentPractice.text]);

  // Map decomposed index to composed text position
  // Strategy: Find the shortest prefix of original text whose decomposition matches currentIndex
  const composedTypedText = useMemo(() => {
    if (currentIndex === 0) return '';

    const originalText = currentPractice.text;
    let left = 0;
    let right = originalText.length;
    let result = '';

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const prefix = originalText.substring(0, mid);
      const decomposed = decomposeTargetText(normalizeHindiText(prefix));

      if (decomposed.length === currentIndex) {
        // Perfect match
        result = prefix;
        break;
      } else if (decomposed.length < currentIndex) {
        // Need more characters
        left = mid + 1;
      } else {
        // Too many characters, but save as potential result
        result = prefix;
        right = mid - 1;
      }
    }

    return result;
  }, [currentIndex, currentPractice.text]);

  // Start timer when user starts typing
  useEffect(() => {
    if (currentIndex > 0 && !isRunning && !isPaused && !isComplete) {
      start();
    }
  }, [currentIndex, isRunning, isPaused, isComplete, start]);

  // Pause timer when paused
  useEffect(() => {
    if (isPaused && isRunning) {
      pause();
    } else if (!isPaused && currentIndex > 0 && !isComplete) {
      start();
    }
  }, [isPaused, isRunning, currentIndex, isComplete, pause, start]);

  // Stop timer when complete
  useEffect(() => {
    if (isComplete && isRunning) {
      pause();
    }
  }, [isComplete, isRunning, pause]);

  const handleReset = () => {
    reset();
    resetTimer();
    setIsPaused(false);
    setShowCompleteDialog(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundEffects.setEnabled(newState);
  };

  // Set initial sound state
  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Find the next character to type and its key (using decomposed/normalized text from engine)
  const nextChar = nextExpectedChar;
  const nextKeyInfo = nextChar ? findKeysForCharacter(nextChar) : null;

  // Determine which fingers should be active
  const getActiveFingers = () => {
    if (!nextKeyInfo || nextKeyInfo.length === 0)
      return { left: [], right: [] };

    const keyCode = nextKeyInfo[0].key;
    const fingerInfo = fingerMap[keyCode];

    if (!fingerInfo) return { left: [], right: [] };

    return {
      left: fingerInfo.hand === 'left' ? [fingerInfo.finger] : [],
      right: fingerInfo.hand === 'right' ? [fingerInfo.finger] : [],
    };
  };

  const activeFingers = getActiveFingers();
  const needsShift = nextKeyInfo?.[0]?.modifierState === 'shift';
  const needsAltGr = nextKeyInfo?.[0]?.modifierState === 'altgr';

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm shrink-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{currentPractice.title}</h1>
              <p className="text-xs text-muted-foreground">
                {currentPractice.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  {availableLayouts[currentLayoutId]?.name || 'Layout'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Keyboard Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(availableLayouts).map(([id, layout]) => (
                  <DropdownMenuItem
                    key={id}
                    onClick={() => setLayout(id as typeof currentLayoutId)}
                    className={currentLayoutId === id ? 'bg-accent' : ''}
                  >
                    {layout.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Lesson Navigation (Tutor mode only) */}
            {mode === 'tutor' && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToLesson(currentLessonId - 1)}
                  disabled={currentLessonId <= 1}
                  title="Previous Lesson"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2">
                  {currentLessonId}/{totalLessons}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToLesson(currentLessonId + 1)}
                  disabled={currentLessonId >= totalLessons}
                  title="Next Lesson"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Sound Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>

            {/* Pause/Resume */}
            <Button
              variant="outline"
              size="icon"
              onClick={togglePause}
              disabled={currentIndex === 0 || isComplete}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>

            {/* Reset */}
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-3 flex flex-col gap-3 overflow-hidden">
        {/* Stats Bar - Hidden in tutor mode */}
        {mode !== 'tutor' && (
          <>
            <div className="grid grid-cols-5 gap-3 shrink-0">
              <Card className="p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Time
                </p>
                <p className="text-2xl font-bold font-mono">
                  {formatTime(Math.floor(elapsed / 1000))}
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  WPM
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentStats.wpm}
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Accuracy
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentStats.accuracy.toFixed(1)}%
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Errors
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {currentStats.incorrectChars}
                </p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Progress
                </p>
                <p className="text-2xl font-bold">
                  {Math.round((currentIndex / normalizedTarget.length) * 100)}%
                </p>
              </Card>
            </div>

            {/* Progress Bar */}
            <Progress
              value={(currentIndex / normalizedTarget.length) * 100}
              className="h-1.5 shrink-0"
            />
          </>
        )}

        {/* Typing Area - Scrolling single line for tutor/free mode */}
        <Card
          className={`p-4 shrink-0 ${mode === 'tutor' ? 'flex items-center justify-center' : ''}`}
        >
          <div
            className={`leading-relaxed font-hindi tracking-wide select-none overflow-hidden ${
              mode === 'tutor'
                ? 'text-xl text-center max-h-14'
                : 'text-lg text-center max-h-20'
            }`}
          >
            {/* Display text with grapheme-based error highlighting */}
            {(() => {
              const fullText = currentPractice.text;
              const graphemes = splitIntoGraphemes(fullText);
              const typedLen = composedTypedText.length;

              // For tutor mode: show ~60 chars centered around current position
              // For other modes: show ~120 chars
              const windowSize = mode === 'tutor' ? 60 : 120;
              const halfWindow = Math.floor(windowSize / 2);

              // Calculate start position to keep current char roughly centered
              let startPos = Math.max(0, typedLen - halfWindow);
              let endPos = Math.min(fullText.length, startPos + windowSize);

              // Adjust start if we're near the end
              if (endPos === fullText.length) {
                startPos = Math.max(0, endPos - windowSize);
              }

              // Find grapheme indices that fall within the window
              let charCount = 0;
              let startGraphemeIdx = 0;
              let endGraphemeIdx = graphemes.length;

              for (let i = 0; i < graphemes.length; i++) {
                if (charCount < startPos) {
                  startGraphemeIdx = i + 1;
                }
                charCount += graphemes[i].length;
                if (charCount >= endPos && endGraphemeIdx === graphemes.length) {
                  endGraphemeIdx = i + 1;
                }
              }

              // Add ellipsis indicators
              const showStartEllipsis = startPos > 0;
              const showEndEllipsis = endPos < fullText.length;

              return (
                <>
                  {showStartEllipsis && (
                    <span className="text-muted-foreground/50">… </span>
                  )}
                  {graphemes.slice(startGraphemeIdx, endGraphemeIdx).map((grapheme, idx) => {
                    const graphemeIdx = startGraphemeIdx + idx;
                    const decompIdx = graphemeToDecomposedIndex[graphemeIdx];

                    if (decompIdx >= currentIndex) {
                      // Not typed yet - default color
                      return <span key={graphemeIdx}>{grapheme}</span>;
                    }

                    // Check if ANY character in this grapheme has an error
                    const nextDecompIdx =
                      graphemeToDecomposedIndex[graphemeIdx + 1] ||
                      decomposedText.length;
                    const graphemeLength = nextDecompIdx - decompIdx;

                    let hasError = false;
                    for (let i = 0; i < graphemeLength; i++) {
                      if (errors.includes(decompIdx + i)) {
                        hasError = true;
                        break;
                      }
                    }

                    return (
                      <span
                        key={graphemeIdx}
                        className={
                          hasError
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }
                      >
                        {grapheme}
                      </span>
                    );
                  })}
                  {showEndEllipsis && (
                    <span className="text-muted-foreground/50"> …</span>
                  )}
                </>
              );
            })()}
          </div>

          {/* Paused Overlay */}
          {isPaused && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
              <Pause className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="font-medium">Paused</p>
              <p className="text-sm text-muted-foreground">
                Press the play button to continue
              </p>
            </div>
          )}
        </Card>

        {/* Next Key Hint - Larger in tutor mode */}
        {nextChar && !isComplete && !isPaused && mode !== 'tutor' && (
          <div className="flex items-center justify-center gap-2 text-xs shrink-0">
            <span className="text-muted-foreground">Next:</span>
            <Badge
              variant="secondary"
              className="text-sm font-hindi px-2 py-0.5"
            >
              {nextChar === ' ' ? '␣ Space' : nextChar}
            </Badge>
            {nextKeyInfo && nextKeyInfo.length > 0 && (
              <>
                <span className="text-muted-foreground">|</span>
                <Badge variant="outline" className="text-xs">
                  {nextKeyInfo[0].modifierState !== 'normal' && (
                    <span className="mr-1 capitalize">
                      {nextKeyInfo[0].modifierState} +{' '}
                    </span>
                  )}
                  {nextKeyInfo[0].key.replace('Key', '').replace('Digit', '')}
                </Badge>
              </>
            )}
          </div>
        )}

        {/* Keyboard with Hands - Keyboard at focal point in tutor mode */}
        <div
          className={`flex-1 flex items-center justify-center gap-6 min-h-0 ${mode === 'tutor' ? 'flex-col' : ''}`}
        >
          {mode === 'tutor' ? (
            <>
              {/* Virtual Keyboard - At top in tutor mode */}
              <div className="shrink-0">
                <VirtualKeyboard
                  modifierState={modifierState}
                  pressedKeys={pressedKeys}
                  nextCharacter={isPaused || isComplete ? '' : nextChar}
                  isTutorMode={true}
                />
              </div>

              {/* Hands below keyboard in tutor mode */}
              <div className="flex items-center justify-center gap-8 shrink-0">
                <HandSVG
                  side="left"
                  activeFingers={
                    isPaused || isComplete ? [] : activeFingers.left
                  }
                  needsShift={needsShift}
                />
                <HandSVG
                  side="right"
                  activeFingers={
                    isPaused || isComplete ? [] : activeFingers.right
                  }
                  needsAltGr={needsAltGr}
                />
              </div>
            </>
          ) : (
            <>
              {/* Left Hand */}
              <div className="shrink-0">
                <HandSVG
                  side="left"
                  activeFingers={
                    isPaused || isComplete ? [] : activeFingers.left
                  }
                  needsShift={needsShift}
                />
              </div>

              {/* Virtual Keyboard */}
              <div className="shrink-0">
                <VirtualKeyboard
                  modifierState={modifierState}
                  pressedKeys={pressedKeys}
                  nextCharacter={isPaused || isComplete ? '' : nextChar}
                />
              </div>

              {/* Right Hand */}
              <div className="shrink-0">
                <HandSVG
                  side="right"
                  activeFingers={
                    isPaused || isComplete ? [] : activeFingers.right
                  }
                  needsAltGr={needsAltGr}
                />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Completion Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-md text-black dark:text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span className="text-black dark:text-white">Great Job!</span>
            </DialogTitle>
            <DialogDescription>
              You've completed the practice session.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {currentStats.wpm}
              </p>
              <p className="text-sm text-muted-foreground">Words Per Minute</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {currentStats.accuracy.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-foreground">
                {formatTime(Math.floor(elapsed / 1000))}
              </p>
              <p className="text-sm text-muted-foreground">Time</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {currentStats.incorrectChars}
              </p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleReset}>
              <div className="text-black dark:text-white flex justify-center items-center gap-2">
                <RotateCcw className="h-4 w-4 mt-0.5" />
                Try Again
              </div>
            </Button>
            {mode === 'tutor' && currentLessonId < totalLessons && (
              <Button onClick={() => goToLesson(currentLessonId + 1)}>
                <div className="flex justify-center items-center gap-2">
                  Next Lesson
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            )}
            {(mode !== 'tutor' || currentLessonId >= totalLessons) && (
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
