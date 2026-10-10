import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import api from '../services/api';
import {
  Sparkles,
  ClipboardCheck,
  Code2,
  BotMessageSquare,
  BookOpen,
  FileSearch,
  Trophy,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Lightbulb,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'ROLE_STUDENT') {
    return <StudentDashboard />;
  }
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setSummary(res.data);
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Assessments Taken",
      value: summary?.testsTaken ?? 0,
      icon: ClipboardCheck,
      color: "from-blue-600 to-cyan-500",
      change: "+2 this week"
    },
    {
      title: "Average MCQ Score",
      value: `${summary?.averageScore ?? 0}%`,
      icon: TrendingUp,
      color: "from-emerald-600 to-teal-500",
      change: "Top tier"
    },
    {
      title: "AI Mock Interviews",
      value: summary?.interviewsAttended ?? 0,
      icon: BotMessageSquare,
      color: "from-purple-600 to-pink-500",
      change: "Voice evaluated"
    },
    {
      title: "Coding Problems Solved",
      value: summary?.problemsSolved ?? 0,
      icon: Code2,
      color: "from-amber-600 to-orange-500",
      change: "Algorithmic pass"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-purple-900/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Student Cockpit
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, {user?.name || 'Developer'}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Targeting: <span className="text-slate-200 font-semibold">{user?.targetRole || 'Full Stack Developer'}</span>
            {' • '} Current Rank: <span className="text-amber-400 font-semibold">{summary?.currentRank || 'Advanced Scholar'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/tests"
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Take Test</span>
          </Link>
          <Link
            to="/interviews"
            className="px-5 py-2.5 rounded-xl font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-sm flex items-center gap-2 transition-all"
          >
            <BotMessageSquare className="w-4 h-4" />
            <span>Start AI Interview</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">{card.change}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Skill Radar Breakdown + Quick Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Skill Mastery Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Technical Competency Mastery
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated from MCQ tests, coding challenges, and mock interviews</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-blue-400 hover:underline">
              Full Analytics
            </Link>
          </div>

          <div className="space-y-4">
            {summary?.skillMastery && Object.entries(summary.skillMastery).map(([skill, level]) => (
              <div key={skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{skill}</span>
                  <span className="text-blue-400">{level}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700"
                    style={{ width: `${level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Personalized Recommendation Callout */}
          <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-300 uppercase tracking-wider">AI Study Recommendation</p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Your data shows strong proficiency in SQL and Java Core, but practicing <strong>Sliding Window & Dynamic Programming</strong> algorithms
                in the Coding Arena will accelerate readiness for Senior technical rounds.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" /> Quick Launch
          </h2>

          <Link
            to="/tests"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/60 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Take Assessment</p>
                <p className="text-xs text-slate-400">Timed MCQ test with auto-grading</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/coding"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/60 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">Coding Arena</p>
                <p className="text-xs text-slate-400">Interactive live problem solver</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/interviews"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">AI Mock Interview</p>
                <p className="text-xs text-slate-400">Voice-enabled technical mock session</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/study"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">AI Study Assistant</p>
                <p className="text-xs text-slate-400">RAG-grounded syllabus Q&A</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/resume"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:bg-slate-800/60 transition-all flex items-center justify-between group block"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">Resume Analyzer</p>
                <p className="text-xs text-slate-400">Skill gaps & benchmark matching</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

      </div>

      {/* Recent Activities Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-slate-400" />
          Recent Activity Timeline
        </h2>

        {summary?.recentActivities && summary.recentActivities.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {summary.recentActivities.map((act, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    act.type === 'TEST' ? 'bg-blue-600/20 text-blue-400' :
                    act.type === 'INTERVIEW' ? 'bg-purple-600/20 text-purple-400' :
                    'bg-amber-600/20 text-amber-400'
                  }`}>
                    {act.type === 'TEST' ? <ClipboardCheck className="w-4 h-4" /> :
                     act.type === 'INTERVIEW' ? <BotMessageSquare className="w-4 h-4" /> :
                     <Code2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{act.title}</p>
                    <p className="text-xs text-slate-500">{act.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    act.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    act.score >= 60 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {act.score}% Score
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4">No recent assessment activities recorded yet. Start by taking your first test above!</p>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
