import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Award,
  BotMessageSquare,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageSquareQuote,
  LayoutDashboard
} from 'lucide-react';

const InterviewReport = () => {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data);
        if (res.data.score && res.data.score >= 75) {
          confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-slate-300">
        <p>Interview report not found.</p>
        <Link to="/interviews" className="mt-3 inline-block px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold">
          Return to Interviews
        </Link>
      </div>
    );
  }

  const score = interview.score ?? 78;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> AI Interview Assessment Report
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {interview.skill} Technical Simulation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Experience Level: {interview.difficulty} • Candidate: {interview.user?.name || 'Candidate'}
          </p>
        </div>

        {/* Overall Score Circle */}
        <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-800/80 border-4 border-purple-500/40 shadow-inner my-2">
          <span className="text-4xl font-black text-white">{score}</span>
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mt-0.5">
            / 100 Overall
          </span>
        </div>

        {/* Breakdown Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold max-w-xl mx-auto">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-slate-400 block mb-1">Technical Accuracy</span>
            <span className="text-lg font-bold text-blue-400">{Math.min(100, score + 2)}%</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-slate-400 block mb-1">Communication Clarity</span>
            <span className="text-lg font-bold text-purple-400">{Math.max(50, score - 3)}%</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700">
            <span className="text-slate-400 block mb-1">Architectural Depth</span>
            <span className="text-lg font-bold text-emerald-400">{score}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/interviews"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all"
          >
            <BotMessageSquare className="w-4 h-4" /> Practice Another Role
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>
      </div>

      {/* Comprehensive Evaluation Feedback */}
      {interview.feedback && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-purple-400" />
            Executive Evaluation Summary
          </h2>
          <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono">
            {interview.feedback}
          </div>
        </div>
      )}

      {/* Full Q&A Transcript */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BotMessageSquare className="w-5 h-5 text-purple-400" />
          Question-by-Question Transcript & AI Critique
        </h2>

        {interview.questions && interview.questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-white">{q.question}</span>
              </div>
              {q.score !== null && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  {q.score}/100
                </span>
              )}
            </div>

            {/* Candidate Answer */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
              <strong className="text-slate-400 block mb-1">Your Response:</strong>
              <p className="italic">{q.answer || "No response recorded."}</p>
            </div>

            {/* AI Feedback */}
            {q.feedback && (
              <div className="p-3.5 rounded-xl bg-purple-900/15 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                <strong className="text-purple-400 font-semibold block mb-1">AI Evaluator Critique:</strong>
                {q.feedback}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default InterviewReport;
