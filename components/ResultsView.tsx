
import React from 'react';
import { Question, UserAnswers } from '../types.ts';
import { CheckCircleIcon, XCircleIcon } from './Icons.tsx';

interface ResultsViewProps {
  questions: Question[];
  userAnswers: UserAnswers;
  onStartNew: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ questions, userAnswers, onStartNew }) => {
  const score = questions.reduce((acc, question, index) => {
    return userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
  }, 0);

  const scorePercentage = Math.round((score / questions.length) * 100);

  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'text-green-600';
    if (scorePercentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Test Complete!</h2>
        <p className="text-slate-600 text-lg">Here's how you did:</p>
        <div className={`text-6xl font-bold my-4 ${getScoreColor()}`}>
          {score} / {questions.length}
        </div>
        <p className="text-2xl font-semibold text-slate-800">({scorePercentage}%)</p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;
          
          return (
            <div key={index} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                )}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">{index + 1}. {question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isCorrectAnswer = option === question.correctAnswer;
                      const isUserAnswer = option === userAnswer;

                      let optionClass = 'flex items-center gap-2 p-2 rounded text-sm';
                      if (isCorrectAnswer) {
                        optionClass += ' bg-green-100 text-green-800';
                      } else if (isUserAnswer) {
                        optionClass += ' bg-red-100 text-red-800';
                      } else {
                        optionClass += ' bg-slate-100 text-slate-700';
                      }

                      return (
                        <div key={optIndex} className={optionClass}>
                          <span>{option}</span>
                          {isCorrectAnswer && <span className="text-xs font-bold">(Correct)</span>}
                          {isUserAnswer && !isCorrectAnswer && <span className="text-xs font-bold">(Your Answer)</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <button
          onClick={onStartNew}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Create New Test
        </button>
      </div>
    </div>
  );
};

export default ResultsView;