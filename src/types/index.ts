export type Difficulty = 'easy' | 'medium' | 'hard';

export type Severity = 'high' | 'medium' | 'low';

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
