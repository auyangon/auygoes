// src/types/exam/exam.types.ts
export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName?: string;
  duration: number; // minutes
  totalPoints: number;
  passingScore: number;
  questions: Question[];
  settings: ExamSettings;
  createdBy: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'published' | 'active' | 'ended';
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
}

export interface ExamSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  showResults: boolean;
  maxAttempts: number;
  timeLimit: number;
  antiCheating: AntiCheatingSettings;
}

export interface AntiCheatingSettings {
  fullscreen: boolean;
  preventTabSwitch: boolean;
  preventCopyPaste: boolean;
  preventRightClick: boolean;
  faceDetection: boolean;
  randomizeQuestions: boolean;
  ipTracking: boolean;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  studentEmail: string;
  studentName?: string;
  answers: Record<string, any>;
  score?: number;
  percentage?: number;
  startedAt: string;
  submittedAt?: string;
  timeSpent?: number;
  violations: ExamViolation[];
  status: 'in-progress' | 'submitted' | 'timed-out' | 'terminated';
}

export interface ExamViolation {
  type: 'tab-switch' | 'copy-paste' | 'right-click' | 'fullscreen-exit' | 'multiple-ip' | 'window-blur';
  timestamp: string;
  details?: string;
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  studentId: string;
  studentEmail: string;
  score: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  timeSpent: number;
}
