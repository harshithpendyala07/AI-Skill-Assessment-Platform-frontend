import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Clock, AlertTriangle, CheckCircle, ArrowLeft, ArrowRight, Send } from 'lucide-react';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await api.get(`/tests/${id}`);
        setTest(res.data);
        const qList = res.data.questions || [];
        setQuestions(qList);
        setTimeLeft((res.data.duration || 15) * 60);
      } catch (err) {
        console.error("Error loading test:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, loading]);

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeSpent = test ? (test.duration * 60) - timeLeft : 300;
      const res = await api.post(`/tests/${id}/submit`, {
        answers: answers,
        timeSpentSeconds: Math.max(timeSpent, 10)
      });
      navigate(`/tests/result`, { state: { result: res.data, test: test } });
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission error. Please retry.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!test || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-slate-300">
        <p className="text-lg font-semibold">Test questions are currently not available.</p>
        <button onClick={() => navigate('/tests')} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg text-xs font-semibold">
          Return to Catalog
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Test Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
            {test.skill} • {test.difficulty}
          </span>
          <h1 className="text-xl font-bold text-white">{test.title}</h1>
        </div>

        {/* Live Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold ${
          timeLeft < 120
            ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse'
            : 'bg-slate-800 border-slate-700 text-slate-200'
        }`}>
          <Clock className="w-4 h-4 text-blue-400" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Assessment Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Cols: Active Question Display */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-4 pb-3 border-b border-slate-800">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {currentQ.category || 'General'}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed mb-6">
              {currentQ.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {[
                { key: 'A', text: currentQ.optionA },
                { key: 'B', text: currentQ.optionB },
                { key: 'C', text: currentQ.optionC },
                { key: 'D', text: currentQ.optionD },
              ].map(({ key, text }) => {
                const isSelected = answers[currentQ.id] === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, key)}
                    className={`w-full p-4 rounded-xl text-left text-sm font-medium border transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {key}
                    </span>
                    <span className="flex-1">{text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                Finish & Submit <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Col: Question Navigation Grid Palette */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 h-fit">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Progress</span>
            <span className="text-blue-400">{answeredCount} of {questions.length} Answered</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-blue-500 bg-blue-600 text-white'
                      : isAnswered
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Submit Assessment
          </button>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Ready to Submit?</h3>
            <p className="text-xs text-slate-300">
              You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
              Once submitted, the AI engine will score your test and provide detailed feedback.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20 transition-all"
              >
                {submitting ? "Scoring..." : "Yes, Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TakeTest;
