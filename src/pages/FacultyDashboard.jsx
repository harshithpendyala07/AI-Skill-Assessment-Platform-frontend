import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, BarChart2, Calendar, ShieldAlert, CheckCircle2, Plus, Download } from 'lucide-react';

// FacultyDashboard – central hub for instructors/admins
// Shows class‑wide metrics, assessment management and student‑level analytics.
const FacultyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [studentsNeedingHelp, setStudentsNeedingHelp] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch aggregated stats and attention‑list from backend
  const fetchData = async () => {
    try {
      const [{ data: statsRes }, { data: attentionRes }] = await Promise.all([
        api.get('/faculty/stats'), // totalStudents, classAvg, placementReadiness, etc.
        api.get('/faculty/attention'), // list of students flagged by AI
      ]);
      setStats(statsRes);
      setStudentsNeedingHelp(attentionRes);
    } catch (err) {
      console.error('Faculty dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Helper to format numbers safely
  const fmt = (n) => (n !== undefined && n !== null ? n : 0);

  const statItems = [
    { title: 'Total Students', value: fmt(stats?.totalStudents), icon: Users, color: 'text-blue-400' },
    { title: 'Class Avg. Score', value: fmt(stats?.classAverage) + '%', icon: BarChart2, color: 'text-emerald-400' },
    { title: 'Placement Ready', value: fmt(stats?.placementReady) + '%', icon: CheckCircle2, color: 'text-amber-400' },
    { title: 'Upcoming Assessments', value: fmt(stats?.upcomingAssessments), icon: Calendar, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Faculty Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-white">Course & Student Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor class performance, schedule assessments and help students improve placement readiness.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Open assessment creation flow')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-500 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Assessment
          </button>
          <button
            onClick={() => alert('Open interview creation flow')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Interview
          </button>
          <button
            onClick={() => alert('Export reports')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-600 text-white hover:bg-slate-500 shadow-md"
          >
            <Download className="w-4 h-4" /> Export CSV/PDF
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <Icon className={`w-5 h-5 ${item.color} mb-3`} />
              <p className="text-2xl font-black text-white">{item.value}</p>
              <p className="text-xs text-slate-400 mt-1">{item.title}</p>
            </div>
          );
        })}
      </div>

      {/* Students Needing Attention */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-400" /> Students Requiring Attention
        </h2>
        {studentsNeedingHelp.length === 0 ? (
          <p className="text-slate-400">All students are on track.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Score</th>
                  <th className="py-2 px-3">Weak Areas</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {studentsNeedingHelp.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-medium text-white">{s.name}</td>
                    <td className="py-2 px-3 text-amber-300">{s.overallScore}%</td>
                    <td className="py-2 px-3 text-slate-300">{s.weakSkills?.join(', ')}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => alert(`Open detailed report for ${s.name}`)}
                        className="px-3 py-1 rounded-md bg-amber-600 text-xs text-white hover:bg-amber-500"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default FacultyDashboard;
