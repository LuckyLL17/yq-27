export type Difficulty = 'easy' | 'medium' | 'hard';

export type Severity = 'high' | 'medium' | 'low';

export type ExamStatus = 'idle' | 'configuring' | 'ongoing' | 'finished';

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  questionCount: number;
  color: string;
}

export interface CodeExample {
  language: string;
  code: string;
}

export interface Pitfall {
  title: string;
  description: string;
  severity: Severity;
}

export interface Question {
  id: string;
  title: string;
  categoryId: string;
  difficulty: Difficulty;
  content: string;
  standardSolution: string;
  pitfalls: Pitfall[];
  codeExamples: CodeExample[];
  relatedQuestionIds: string[];
  isHot: boolean;
}

export interface ExamConfig {
  categoryId: string;
  difficulty: Difficulty | 'all';
  questionCount: number;
  duration: number;
}

export interface ExamQuestion {
  question: Question;
  userAnswer: string;
  isAnswered: boolean;
  isMarked: boolean;
}

export interface ExamResult {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  score: number;
  timeSpent: number;
  answers: ExamQuestion[];
}
