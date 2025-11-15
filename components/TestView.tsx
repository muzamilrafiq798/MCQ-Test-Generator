import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { ThumbUpIcon, ThumbDownIcon } from './Icons';
import { Confetti } from './Confetti';

interface TestViewProps {
  questions: Question[];
  currentQuestionIndex: number;
  onAnswerSelect: (questionIndex: number, answer: string) => void;
  onNext: () => void;
  onSubmit: () => void;
  correctCount: number;
  incorrectCount: number;
}

const TestView: React.FC<TestViewProps> = ({
  questions,
  currentQuestionIndex,
  onAnswerSelect,
  onNext,
  onSubmit,
  correctCount,
  incorrectCount
}) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Reset state when question changes
  useEffect(() => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowConfetti(false);
  }, [currentQuestionIndex]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    setIsAnswered(true);
    setSelectedAnswer(option);
    onAnswerSelect(currentQuestionIndex, option);

    if (isCorrect) {
      setShowConfetti(true);
    }

    setTimeout(() => {
      if (isLastQuestion) {
        onSubmit();
      } else {
        onNext();
      }
    }, 2000);
  };

  const getOptionClass = (option: string) => {
    const baseClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-slate-800';

    if (!isAnswered) {
      return `${baseClass} bg-white border-slate-300 hover:bg-slate-100 hover:border-slate-400 transform hover:scale-[1.02]`;
    }

    const isCorrectAnswer = option === currentQuestion.correctAnswer;
    const isSelectedAnswer = option === selectedAnswer;

    if (isCorrectAnswer) {
      return `${baseClass} bg-green-100 border-green-500 font-bold shadow-lg scale-105`;
    }
    if (isSelectedAnswer && !isCorrectAnswer) {
      return `${baseClass} bg-red-100 border-red-500 font-bold shadow-lg scale-105`;
    }
    
    return `${baseClass} bg-slate-100 border-slate-300 opacity-50 cursor-not-allowed`;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 relative overflow-hidden">
      {showConfetti && <Confetti />}
      {/* Header with Progress and Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-indigo-600">Question {currentQuestionIndex + 1} of {questions.length}</span>
           <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600 font-semibold">
              <ThumbUpIcon className="w-5 h-5" />
              <span>{correctCount}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600 font-semibold">
              <ThumbDownIcon className="w-5 h-5" />
              <span>{incorrectCount}</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 min-h-[6rem] flex items-center">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">{currentQuestion.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={getOptionClass(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestView;
