import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Briefcase,
  Lightbulb
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const sampleResume = `Alex Johnson | alex.johnson@example.com
EDUCATION: B.Tech Computer Science, 2024
TECHNICAL SKILLS:
- Languages: Java, SQL, JavaScript
- Frameworks & Tools: Spring Boot, React, Git, Docker, RESTful APIs
- Databases: MySQL, PostgreSQL
PROJECTS:
- Built full-stack e-commerce system with Java Spring Boot backend, JWT security, and React frontend.
- Created microservices with Docker containerization and PostgreSQL storage.`;

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() || analyzing) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await api.post('/resume/analyze', {
        resumeText: resumeText.trim(),
        targetRole
      });
      setAnalysis(res.data);
      if (res.data.matchPercentage >= 75) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error("Resume analysis failed:", err);
      alert("Failed to evaluate resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Career Readiness & Gap Analysis
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Resume & Skill Gap Analyzer</h1>
          <p className="text-slate-400 text-sm mt-1">
            Compare your resume text against verified industry standards, discover competency blindspots, and receive guided remediation paths.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="self-start md:self-auto text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Dashboard
        </Link>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Target Job Profile
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500 text-sm font-medium"
            >
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Backend Java Engineer">Backend Java Engineer</option>
              <option value="Frontend React Developer">Frontend React Developer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setResumeText(sampleResume)}
            className="self-end px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            📋 Paste Sample Resume
          </button>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Resume Text Content
            </label>
            <textarea
              rows={8}
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content, skills section, or project summaries here..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={!resumeText.trim() || analyzing}
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <FileSearch className="w-4 h-4" />
            <span>{analyzing ? "Scanning Competencies..." : "Analyze Profile Match"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Benchmark Evaluation Result
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">
                {analysis.targetRole} Alignment
              </h2>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Profile Match</span>
                <span className="text-2xl font-black text-white">{analysis.matchPercentage}%</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white ${
                analysis.matchPercentage >= 75 ? 'bg-emerald-600' :
                analysis.matchPercentage >= 50 ? 'bg-amber-600' : 'bg-rose-600'
              }`}>
                {analysis.matchPercentage >= 75 ? 'A' : analysis.matchPercentage >= 50 ? 'B' : 'C'}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {analysis.detailedSummary}
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matched Competencies */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Validated Competencies ({analysis.extractedSkills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.extractedSkills && analysis.extractedSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Competencies */}
            <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Identified Skill Gaps ({analysis.missingSkills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills && analysis.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20"
                  >
                    ✗ {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Actionable Recommendations */}
          <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-500/30 space-y-3">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" /> Guided Remediation Plan
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {analysis.recommendedTopics && analysis.recommendedTopics.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};

export default ResumeAnalyzer;
