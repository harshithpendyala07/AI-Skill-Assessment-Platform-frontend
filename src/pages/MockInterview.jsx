import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  BotMessageSquare,
  Sparkles,
  Mic,
  Award,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const MockInterview = () => {
  const [skill, setSkill] = useState('Full Stack Developer');
  const [difficulty, setDifficulty] = useState('Mid-Level');
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/interviews');
        setInterviews(res.data);
      } catch (err) {
        console.error("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const res = await api.post('/interviews/start', { skill, difficulty });
      navigate(`/interviews/session/${res.data.id}`);
    } catch (err) {
      console.error("Error starting interview:", err);
      alert("Failed to initiate interview session.");
      setStarting(false);
    }
  };

  const roles = [
    { title: "Full Stack Developer", desc: "Covers Spring Boot, React, RESTful architectures, and database design." },
    { title: "Java Backend Engineer", desc: "Focuses on Java 21 internals, multithreading, Spring Security, and JPA." },
    { title: "Frontend React Specialist", desc: "Emphasizes React 18 hooks, Virtual DOM reconciliation, and web performance." },
    { title: "AI & Machine Learning Engineer", desc: "Questions on RAG architectures, LLM fine-tuning, embeddings, and Python." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Speech & Technical Simulation
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Mock Interview Simulator</h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulate realistic interview rounds with speech-to-text voice recognition, intelligent follow-ups, and in-depth performance scorecards.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="self-start md:self-auto text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Dashboard
        </Link>
      </div>

      {/* Setup Config Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          Configure New Interview Session
        </h2>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Choose Target Role
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {roles.map((r) => (
              <div
                key={r.title}
                onClick={() => setSkill(r.title)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  skill === r.title
                    ? 'bg-purple-600/15 border-purple-500 shadow-md shadow-purple-500/10'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white">{r.title}</h3>
                  {skill === r.title && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-xs text-slate-400">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Seniority Level
          </label>
          <div className="flex flex-wrap gap-3">
            {['Junior (0-2 Yrs)', 'Mid-Level (2-5 Yrs)', 'Senior (5+ Yrs)'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDifficulty(lvl.split(' ')[0])}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  difficulty === lvl.split(' ')[0]
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            onClick={handleStartInterview}
            disabled={starting}
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <BotMessageSquare className="w-5 h-5" />
            <span>{starting ? "Initializing AI Interview Room..." : "Begin Mock Interview"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Past Interviews History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Past Interview Sessions
        </h2>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : interviews.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {interviews.map((iv) => (
              <div key={iv.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-sm font-bold text-white">{iv.skill}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-purple-400 border border-slate-700">
                      {iv.difficulty}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      iv.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {iv.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Session ID: #{iv.id} • Date: {new Date(iv.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {iv.score !== null && (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Overall Score</span>
                      <span className="text-base font-bold text-purple-400">{iv.score}/100</span>
                    </div>
                  )}

                  {iv.status === 'COMPLETED' ? (
                    <Link
                      to={`/interviews/report/${iv.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-all"
                    >
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to={`/interviews/session/${iv.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 transition-all"
                    >
                      <span>Resume</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No previous mock interview sessions. Launch your first session above!</p>
        )}
      </div>

    </div>
  );
};

export default MockInterview;
