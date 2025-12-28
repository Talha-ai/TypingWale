/**
 * Lesson and progress tracking types
 */

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * A typing lesson
 */
export interface Lesson {
  /** Unique lesson identifier */
  id: number;

  /** Lesson title */
  title: string;

  /** Brief description of what will be learned */
  description: string;

  /** Difficulty level */
  level: LessonLevel;

  /** Physical keys that will be practiced in this lesson */
  targetKeys: string[];

  /** Hindi characters that will be practiced */
  targetCharacters: string[];

  /** Text to practice typing */
  practiceText: string;

  /** Minimum accuracy required to pass (percentage) */
  minAccuracy: number;

  /** Minimum WPM required to pass */
  minWPM: number;

  /** Step-by-step instructions for the lesson */
  instructions: string[];

  /** Estimated time to complete (minutes) */
  estimatedTime?: number;
}

/**
 * User's progress on a specific lesson
 */
export interface LessonProgress {
  /** Lesson ID */
  lessonId: number;

  /** Whether lesson has been completed successfully */
  completed: boolean;

  /** Best WPM achieved in this lesson */
  bestWPM: number;

  /** Best accuracy achieved in this lesson */
  bestAccuracy: number;

  /** Number of attempts made */
  attempts: number;

  /** Timestamp of last attempt */
  lastAttempt: Date;

  /** Whether lesson is currently unlocked */
  unlocked: boolean;
}

/**
 * Overall user progress across all lessons
 */
export interface UserProgress {
  /** Progress for each lesson */
  lessons: Record<number, LessonProgress>;

  /** Current lesson being worked on */
  currentLesson: number;

  /** Total lessons completed */
  totalCompleted: number;

  /** Date user started */
  startedAt: Date;

  /** Last activity timestamp */
  lastActivity: Date;
}
