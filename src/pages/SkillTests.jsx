import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  ClipboardCheck,
  Clock,
  HelpCircle,
  Award,
  Filter,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

const SkillTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/tests');
        setTests(res.data);
      } catch (err) {
        console.error("Error fetching tests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const skillsList = ['ALL', 'Java', 'Spring Boot', 'React', 'SQL', 'Algorithms'];
  const difficultiesList = ['ALL', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTests = tests.filter((t) => {
    const matchSkill = selectedSkill === 'ALL' || t.skill.toLowerCase().includes(selectedSkill.toLowerCase());
    const matchDiff = selectedDifficulty === 'ALL' || t.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchSkill && matchDiff;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Skill Benchmarking
          </div>
          <h1 className="text-3xl font-extrabold text-white">Technical Skill Assessments</h1>
          <p className="text-slate-400 text-sm mt-1">
            Standardized, timed multiple-choice assessments with comprehensive explanations and automated scoring.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="self-start md:self-auto text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Skill:
          </span>
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSkill === skill
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Difficulty:</span>
          {difficultiesList.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all hover:-translate-y-1 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {test.skill}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    test.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    test.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {test.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {test.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">
                  {test.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {test.duration} Minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    {test.questions ? test.questions.length : 5} Questions
                  </span>
                </div>

                <Link
                  to={`/tests/${test.id}`}
                  className="w-full py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all group-hover:shadow-blue-500/30"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">No assessments match selected filters.</p>
          <button
            onClick={() => { setSelectedSkill('ALL'); setSelectedDifficulty('ALL'); }}
            className="mt-3 text-xs text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

    </div>
  );
};

export default SkillTests;
