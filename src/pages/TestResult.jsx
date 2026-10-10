import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  LayoutDashboard,
  BotMessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const TestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, test } = location.state || {};

  useEffect(() => {
    if (result && result.score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p className="text-slate-400 mb-4">No recent test results found in session context.</p>
        <Link to="/tests" className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-semibold text-white">
          Browse Assessments
        </Link>
      </div>
    );
  }

  const isPassing = result.score >= 60;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Score Summary Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Assessment Evaluation
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {test?.title || 'Technical Assessment'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Skill: {test?.skill} • Difficulty: {test?.difficulty}
          </p>
        </div>

        {/* Circular / Badge Score */}
        <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-800/80 border-4 border-blue-500/30 shadow-inner my-2">
          <span className="text-4xl font-black text-white">{result.score}%</span>
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mt-0.5">
            {result.score >= 85 ? 'Mastery' : isPassing ? 'Proficient' : 'Needs Practice'}
          </span>
        </div>

        {/* Correct / Wrong breakdown pills */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{result.correctCount} Correct</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <XCircle className="w-4 h-4" />
            <span>{result.wrongCount} Incorrect</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>{result.totalQuestions} Questions</span>
          </div>
        </div>

        {/* AI Performance Feedback Callout */}
        <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-500/30 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
            <BotMessageSquare className="w-4 h-4" /> AI Performance Feedback & Recommendation
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {result.feedback}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {test?.id && (
            <button
              onClick={() => navigate(`/tests/${test.id}`)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </button>
          )}

          <Link
            to="/study"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 flex items-center gap-2 transition-all"
          >
            <BotMessageSquare className="w-3.5 h-3.5" /> Study Assistant (RAG)
          </Link>

          <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          Detailed Question Breakdown & Explanations
        </h2>

        {result.questionDetails && result.questionDetails.map((q, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl bg-slate-900 border transition-all ${
              q.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  q.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-sm font-semibold text-slate-100">{q.question}</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                q.isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {q.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium my-3">
              <div className={`p-2.5 rounded-lg border ${
                q.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                Your Answer: <strong className="uppercase">{q.selectedAnswer}</strong>
              </div>
              <div className="p-2.5 rounded-lg border bg-slate-800 border-slate-700 text-slate-300">
                Correct Answer: <strong className="uppercase text-emerald-400">{q.correctAnswer}</strong>
              </div>
            </div>

            {q.explanation && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
                <strong className="text-blue-400 font-semibold">Explanation: </strong>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default TestResult;
