/**
 * HandGuide Component
 * Visual guide showing proper hand position on keyboard
 * Highlights which finger to use for next key
 */

import { cn } from '@/utils/cn';

interface HandGuideProps {
  /** Which finger should be used (0-9) */
  activeFinger?: number;

  /** Whether to show the guide */
  show?: boolean;

  /** Additional CSS classes */
  className?: string;
}

/**
 * Finger colors matching the keyboard
 */
const FINGER_COLORS = [
  'fill-pink-500', // 0: Left Pinky
  'fill-red-500', // 1: Left Ring
  'fill-orange-500', // 2: Left Middle
  'fill-yellow-500', // 3: Left Index
  'fill-green-500', // 4: Right Index
  'fill-teal-500', // 5: Right Middle
  'fill-blue-500', // 6: Right Ring
  'fill-purple-500', // 7: Right Pinky
  'fill-gray-500', // 8: Left Thumb
  'fill-gray-500', // 9: Right Thumb
];

const FINGER_NAMES = [
  'Left Pinky',
  'Left Ring',
  'Left Middle',
  'Left Index',
  'Right Index',
  'Right Middle',
  'Right Ring',
  'Right Pinky',
  'Left Thumb',
  'Right Thumb',
];

export function HandGuide({
  activeFinger,
  show = true,
  className,
}: HandGuideProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        'p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
        Hand Position Guide
      </h3>

      <div className="flex justify-center gap-8">
        {/* Left Hand */}
        <HandSVG
          hand="left"
          activeFingers={
            activeFinger !== undefined && activeFinger < 4 ? [activeFinger] : []
          }
        />

        {/* Right Hand */}
        <HandSVG
          hand="right"
          activeFingers={
            activeFinger !== undefined && activeFinger >= 4 && activeFinger < 8
              ? [activeFinger]
              : []
          }
        />
      </div>

      {/* Active finger label */}
      {activeFinger !== undefined && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use:{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {FINGER_NAMES[activeFinger]}
            </span>
          </p>
        </div>
      )}

      {/* Home row indicator */}
      <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        <p>Home Row: ASDF (Left) | JKL; (Right)</p>
      </div>
    </div>
  );
}

/**
 * Simplified hand SVG illustration
 */
function HandSVG({
  hand,
  activeFingers,
}: {
  hand: 'left' | 'right';
  activeFingers: number[];
}) {
  return (
    <div className="relative">
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        className="drop-shadow-md"
      >
        {/* Palm */}
        <rect
          x="20"
          y="80"
          width="80"
          height="70"
          rx="15"
          className="fill-gray-300 dark:fill-gray-600"
        />

        {/* Fingers (simplified as rectangles) */}
        {hand === 'left' ? (
          <>
            {/* Pinky */}
            <Finger
              x={25}
              active={activeFingers.includes(0)}
              color={FINGER_COLORS[0]}
            />
            {/* Ring */}
            <Finger
              x={40}
              active={activeFingers.includes(1)}
              color={FINGER_COLORS[1]}
            />
            {/* Middle */}
            <Finger
              x={55}
              active={activeFingers.includes(2)}
              color={FINGER_COLORS[2]}
            />
            {/* Index */}
            <Finger
              x={70}
              active={activeFingers.includes(3)}
              color={FINGER_COLORS[3]}
            />
          </>
        ) : (
          <>
            {/* Index */}
            <Finger
              x={25}
              active={activeFingers.includes(4)}
              color={FINGER_COLORS[4]}
            />
            {/* Middle */}
            <Finger
              x={40}
              active={activeFingers.includes(5)}
              color={FINGER_COLORS[5]}
            />
            {/* Ring */}
            <Finger
              x={55}
              active={activeFingers.includes(6)}
              color={FINGER_COLORS[6]}
            />
            {/* Pinky */}
            <Finger
              x={70}
              active={activeFingers.includes(7)}
              color={FINGER_COLORS[7]}
            />
          </>
        )}

        {/* Thumb - left hand thumb on LEFT side, right hand thumb on RIGHT side */}
        <rect
          // x={hand === 'left' ? '97' : '5'}
          x="5"
          y="110"
          width="18"
          height="35"
          rx="8"
          className={cn(
            'transition-all duration-200',
            activeFingers.includes(hand === 'left' ? 8 : 9)
              ? FINGER_COLORS[hand === 'left' ? 8 : 9]
              : 'fill-gray-400 dark:fill-gray-500'
          )}
        />
      </svg>
      {/* Hand label */}
      <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400 font-medium">
        {hand === 'left' ? 'Left Hand' : 'Right Hand'}
      </p>
    </div>
  );
}

/**
 * Individual finger component
 */
function Finger({
  x,
  active,
  color,
}: {
  x: number;
  active: boolean;
  color: string;
}) {
  return (
    <rect
      x={x}
      y="10"
      width="12"
      height="75"
      rx="6"
      className={cn(
        'transition-all duration-200',
        active ? cn(color, 'scale-110') : 'fill-gray-400 dark:fill-gray-500'
      )}
    />
  );
}
