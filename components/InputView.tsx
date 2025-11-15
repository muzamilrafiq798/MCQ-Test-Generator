
import React, { useState } from 'react';
import { Loader } from './Loader';

interface InputViewProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
  error: string | null;
}

const placeholderText = `Paste your questions here. For best results, use a clear format like this:

1. What is the capital of France?
   a) Berlin
   b) Madrid
   c) Paris
   d) Rome
   Correct Answer: Paris

2. Which planet is known as the Red Planet?
   a) Earth
   b) Mars
   c) Jupiter
   d) Venus
   Correct Answer: Mars
`;

const InputView: React.FC<InputViewProps> = ({ onGenerate, isLoading, error }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(text);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="mcq-data" className="block text-lg font-semibold text-slate-700 mb-2">
            Paste MCQ Data
          </label>
          <textarea
            id="mcq-data"
            rows={15}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 text-sm font-mono bg-slate-50 disabled:opacity-50"
            placeholder={placeholderText}
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader />
              Generating Test...
            </>
          ) : (
            'Generate Interactive Test'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputView;
