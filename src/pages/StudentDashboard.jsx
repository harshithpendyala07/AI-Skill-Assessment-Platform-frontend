import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart3, Clock, CheckCircle2, Trophy, Zap, ArrowRight, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard')
      .then(res => setSummary(res.data))
      .catch(err => console.error('Student dashboard error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>;

  const n = (v) => v ?? 0;

  const cards = [
    { title: 'Overall Percentage', value: `${n(summary?.averageScore)}%`, icon: BarChart3, color: 'text-emerald-400' },
    { title: 'Participation', value: `${n(summary?.participationPercentage)}%`, icon: CheckCircle2, color: 'text-blue-400' },
    { title: 'Completed', value: `${n(summary?.completedAssessments)}/${n(summary?.totalAssessments)}`, icon: ClipboardList, color: 'text-amber-400' },
    { title: 'Interviews', value: n(summary?.interviewsAttended), icon: Trophy, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Zap className="w-3.5 h-3.5" /> Student Dashboard
        </div>
        <h1 className="text-3xl font-extrabold text-white">My Learning Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Track your assignments, percentage and participation.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => {
          const Icon = c.icon;
          return <div key={c.title} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <Icon className={`w-5 h-5 ${c.color} mb-3`} />
            <p className="text-2xl font-black text-white">{c.value}</p>
            <p className="text-xs text-slate-400 mt-1">{c.title}</p>
          </div>;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">Assignment Progress</h2>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Participation</span>
            <span className="font-bold text-blue-400">{n(summary?.participationPercentage)}%</span>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, n(summary?.participationPercentage))}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            {n(summary?.completedAssessments)} of {n(summary?.totalAssessments)} available assignments completed.
          </p>
          <Link to="/tests" className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold">
            View Assignments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">Skill Performance</h2>
          <div className="space-y-4">
            {Object.entries(summary?.skillMastery || {}).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{skill}</span>
                  <span className="font-bold text-emerald-400">{score}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, score)}%` }} />
                </div>
              </div>
            ))}
            {Object.keys(summary?.skillMastery || {}).length === 0 &&
              <p className="text-xs text-slate-500">Complete an assignment to see skill performance.</p>}
          </div>
        </section>
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" /> Recent Results
        </h2>
        {summary?.recentActivities?.length ? (
          <div className="divide-y divide-slate-800">
            {summary.recentActivities.map((a, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{a.title}</p>
                  <p className="text-xs text-slate-500">{a.date}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">{a.score}%</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-3">No results yet. Start your first assignment.</p>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
