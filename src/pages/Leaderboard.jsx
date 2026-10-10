import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Trophy,
  Medal,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  UserCheck
} from 'lucide-react';

const Leaderboard = () => {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await api.get('/analytics/leaderboard');
        setBoard(res.data);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const filteredBoard = board.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.targetRole?.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = board.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Platform Rankings
          </div>
          <h1 className="text-3xl font-extrabold text-white">Global Technical Leaderboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Top candidates ranked by assessment scores, coding completions, and mock interview performance.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="self-start md:self-auto text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Dashboard
        </Link>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* 2nd Place */}
          <div className="order-2 md:order-1 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-slate-400/20 text-slate-300 flex items-center justify-center font-black text-xl mb-3 border border-slate-400/30">
              #2
            </div>
            <h3 className="text-base font-bold text-white">{topThree[1].name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{topThree[1].targetRole}</p>
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 w-full space-y-1 text-xs">
              <span className="text-slate-400">Total Score:</span>
              <p className="text-base font-bold text-slate-200">{topThree[1].points} pts</p>
              <span className="text-[11px] text-blue-400">Avg {topThree[1].avgScore}%</span>
            </div>
          </div>

          {/* 1st Place (Gold) */}
          <div className="order-1 md:order-2 p-8 rounded-3xl bg-gradient-to-b from-yellow-600/20 via-slate-900 to-slate-900 border-2 border-yellow-500/50 flex flex-col items-center text-center relative overflow-hidden shadow-2xl scale-105">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500 text-slate-950 flex items-center justify-center shadow-lg shadow-yellow-500/30 mb-3 font-black text-2xl">
              <Trophy className="w-9 h-9" />
            </div>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 mb-1">
              Top Ranked Candidate
            </span>
            <h3 className="text-lg font-bold text-white">{topThree[0].name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{topThree[0].targetRole}</p>
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-yellow-500/30 w-full space-y-1 text-xs">
              <span className="text-slate-400">Grand Total:</span>
              <p className="text-xl font-black text-yellow-400">{topThree[0].points} pts</p>
              <span className="text-[11px] text-emerald-400 font-semibold">Avg {topThree[0].avgScore}% • {topThree[0].testsTaken} Tests</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="order-3 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-500 flex items-center justify-center font-black text-xl mb-3 border border-amber-700/30">
              #3
            </div>
            <h3 className="text-base font-bold text-white">{topThree[2].name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{topThree[2].targetRole}</p>
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 w-full space-y-1 text-xs">
              <span className="text-slate-400">Total Score:</span>
              <p className="text-base font-bold text-slate-200">{topThree[2].points} pts</p>
              <span className="text-[11px] text-blue-400">Avg {topThree[2].avgScore}%</span>
            </div>
          </div>

        </div>
      )}

      {/* Search Bar & Full Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-400" />
            Ranked Directory
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name or role..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-7 h-7 border-3 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBoard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4 text-center">Tests Taken</th>
                  <th className="py-3 px-4 text-center">Avg Score</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBoard.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      <span className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-mono ${
                        row.rank === 1 ? 'bg-yellow-500 text-slate-950' :
                        row.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        row.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-white">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{row.targetRole}</td>
                    <td className="py-3.5 px-4 text-center text-slate-300">{row.testsTaken}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                        {row.avgScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-yellow-400 font-mono">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">No candidates match your search query.</p>
        )}
      </div>

    </div>
  );
};

export default Leaderboard;
