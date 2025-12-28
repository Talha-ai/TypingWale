import { useState } from 'react';
import { useTypingEngine } from './hooks';
import { useKeyPress } from './hooks/useKeyPress';
import { formatTime } from './utils/statsCalculator';
import { VirtualKeyboard } from './components/keyboard';
import { findKeysForCharacter } from './utils/keyboardMapper';

function App() {
  const targetText = 'यह एक परीक्षण है'; // "This is a test"
  const [showFingerGuide, setShowFingerGuide] = useState(true);
  const [showHandGuide, setShowHandGuide] = useState(true);

  // 🔹 Keyboard hook (SINGLE SOURCE OF TRUTH)
  const keyPress = useKeyPress({ enabled: true });

  // 🔹 Typing engine consumes keyboard state
  const {
    currentIndex,
    errors,
    currentStats,
    timeElapsed,
    isCompleted,
    reset,
    modifierState,
  } = useTypingEngine({
    targetText,
    mode: 'learn',
    keyPress,
    onComplete: (stats) => {
      console.log('Typing completed!', stats);
    },
  });

  const { pressedKeys } = keyPress;

  // 🔹 Next character + key mapping
  const nextChar = targetText[currentIndex];

  const nextKeyInfo = nextChar
    ? findKeysForCharacter(nextChar).find(
        (k) => k.modifierState === modifierState
      ) || findKeysForCharacter(nextChar)[0]
    : undefined;

  const nextKeyMapping = nextKeyInfo?.keyMapping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-theme">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-3 pt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            हिंदी टाइपिंग प्लेटफॉर्म
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Learn Hindi Typing with Interactive Keyboard Guide
          </p>
        </header>

        {/* Main Content - Single Column Centered Layout */}
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Stats Bar */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">WPM</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentStats.wpm}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Accuracy
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {currentStats.accuracy.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
                <p className="text-2xl font-bold">{formatTime(timeElapsed)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Errors
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {errors.length}
                </p>
              </div>
            </div>
          </div>

          {/* Text to Type - Simple boxes */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Press: <span className="font-bold">{nextChar || '...'}</span>
            </p>
            <div className="flex justify-center gap-1 flex-wrap">
              {targetText.split('').map((char, index) => {
                const isTyped = index < currentIndex;
                const isError = errors.includes(index);
                const isCurrent = index === currentIndex;

                return (
                  <div
                    key={index}
                    className={`
                      w-12 h-16 flex items-center justify-center
                      border-2 font-hindi text-3xl font-semibold
                      ${
                        isTyped && !isError
                          ? 'border-gray-300 bg-gray-100 text-gray-400'
                          : ''
                      }
                      ${isError ? 'border-red-500 bg-red-100 text-red-600' : ''}
                      ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-500 text-white scale-110 shadow-lg'
                          : ''
                      }
                      ${
                        !isTyped && !isCurrent
                          ? 'border-gray-400 bg-white text-blue-600'
                          : ''
                      }
                    `}
                  >
                    {char === ' ' ? '␣' : char}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {currentIndex} / {targetText.length}
            </p>
          </div>

          {/* Keyboard + Hands on both sides */}
          <div className="flex justify-center items-start gap-4">
            {/* Left Hand - Always show when hand guide is enabled */}
            {showHandGuide && (
              <div className="flex flex-col items-center pt-20">
                <svg
                  width="120"
                  height="160"
                  viewBox="0 0 120 160"
                  className="drop-shadow-md"
                >
                  <rect
                    x="20"
                    y="80"
                    width="80"
                    height="70"
                    rx="15"
                    className="fill-gray-300 dark:fill-gray-600"
                  />
                  {[0, 1, 2, 3].map((f) => (
                    <rect
                      key={f}
                      x={30 + f * 15}
                      y="10"
                      width="12"
                      height="75"
                      rx="6"
                      className={
                        nextKeyMapping && nextKeyMapping.finger === f
                          ? 'fill-green-500'
                          : 'fill-gray-400'
                      }
                    />
                  ))}
                  <rect
                    x="97"
                    y="110"
                    width="18"
                    height="35"
                    rx="8"
                    className="fill-gray-400"
                  />
                </svg>
                <p className="text-xs text-gray-500 mt-2">Left Hand</p>
              </div>
            )}

            {/* Keyboard */}
            <VirtualKeyboard
              modifierState={modifierState}
              pressedKeys={pressedKeys}
              nextCharacter={nextChar}
              showFingerGuide={showFingerGuide}
              size="normal"
            />

            {/* Right Hand - Always show when hand guide is enabled */}
            {showHandGuide && (
              <div className="flex flex-col items-center pt-20">
                <svg
                  width="120"
                  height="160"
                  viewBox="0 0 120 160"
                  className="drop-shadow-md"
                >
                  <rect
                    x="20"
                    y="80"
                    width="80"
                    height="70"
                    rx="15"
                    className="fill-gray-300 dark:fill-gray-600"
                  />
                  {[4, 5, 6, 7].map((f) => (
                    <rect
                      key={f}
                      x={30 + (f - 4) * 15}
                      y="10"
                      width="12"
                      height="75"
                      rx="6"
                      className={
                        nextKeyMapping && nextKeyMapping.finger === f
                          ? 'fill-green-500'
                          : 'fill-gray-400'
                      }
                    />
                  ))}
                  <rect
                    x="5"
                    y="110"
                    width="18"
                    height="35"
                    rx="8"
                    className="fill-gray-400"
                  />
                </svg>
                <p className="text-xs text-gray-500 mt-2">Right Hand</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
            >
              Reset
            </button>
            {/* <button
              onClick={() => setShowFingerGuide(!showFingerGuide)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold"
            >
              {showFingerGuide ? 'Hide' : 'Show'} Finger Colors
            </button> */}
            <button
              onClick={() => setShowHandGuide(!showHandGuide)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold"
            >
              {showHandGuide ? 'Hide' : 'Show'} Hands
            </button>
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500 text-center">
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                Completed!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                WPM: {currentStats.wpm} | Accuracy:{' '}
                {currentStats.accuracy.toFixed(1)}%
              </p>
              <button
                onClick={reset}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
