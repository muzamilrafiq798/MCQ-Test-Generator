
import React, { useState, useCallback } from 'react';
import { TestState, Question, UserAnswers } from './types.ts';
import { parseMCQs } from './services/geminiService.ts';
import InputView from './components/InputView.tsx';
import TestView from './components/TestView.tsx';
import ResultsView from './components/ResultsView.tsx';
import { LogoIcon } from './components/Icons.tsx';

const App: React.FC = () => {
  const [testState, setTestState] = useState<TestState>(TestState.INPUT);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const handleGenerateTest = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('Please enter some question data.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const parsedQuestions = await parseMCQs(text);
      if (parsedQuestions.length === 0) {
        setError('Could not parse any questions. Please check the format and try again.');
        setIsLoading(false);
        return;
      }
      setQuestions(parsedQuestions);
      setUserAnswers({});
      setCurrentQuestionIndex(0);
      setTestState(TestState.TESTING);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (errorMessage.includes("API key is not configured")) {
           setError('Configuration Error: The application is missing the required API key to connect to the AI service. Please ensure it is configured in the deployment environment.');
      } else {
           setError('Failed to generate test. The AI could not understand the data. Please ensure it is in a clear MCQ format.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
     // Prevent re-scoring if an answer for this question already exists
    if (userAnswers[questionIndex] !== undefined) return;

    const isCorrect = questions[questionIndex].correctAnswer === answer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
    }
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitTest = () => {
    setTestState(TestState.RESULTS);
  };
  
  const handleStartNew = () => {
    setTestState(TestState.INPUT);
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setError(null);
    setCorrectCount(0);
    setIncorrectCount(0);
  }

  const renderContent = () => {
    switch (testState) {
      case TestState.INPUT:
        return <InputView onGenerate={handleGenerateTest} isLoading={isLoading} error={error} />;
      case TestState.TESTING:
        return (
          <TestView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            onSubmit={handleSubmitTest}
            correctCount={correctCount}
            incorrectCount={incorrectCount}
          />
        );
      case TestState.RESULTS:
        return <ResultsView questions={questions} userAnswers={userAnswers} onStartNew={handleStartNew} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <LogoIcon className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              MCQ Test Generator
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste your multiple-choice questions, and let AI create an interactive test for you.
          </p>
        </header>
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
