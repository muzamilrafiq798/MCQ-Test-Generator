
export enum TestState {
  INPUT = 'INPUT',
  TESTING = 'TESTING',
  RESULTS = 'RESULTS',
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface UserAnswers {
  [questionIndex: number]: string;
}
