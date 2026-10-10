import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  Send,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const CodeProblemSolve = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/coding-problems/${id}`);
        setProblem(res.data);
        setCode(res.data.starterCodeJava || '');
      } catch (err) {
        console.error("Error loading problem:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (!problem) return;
    if (lang === 'java') setCode(problem.starterCodeJava || '');
    else if (lang === 'python') setCode(problem.starterCodePython || '');
    else if (lang === 'javascript') setCode(problem.starterCodeJs || '');
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.post('/coding-problems/run', {
        problemId: problem.id,
        code,
        language
      });
      setResult(res.data);
    } catch (err) {
      console.error("Run code error:", err);
      setResult({
        status: 'Runtime Error',
        output: 'Failed to communicate with code evaluation engine.',
        passedTestCases: 0,
        totalTestCases: 0
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.post('/coding-problems/submit', {
        problemId: problem.id,
        code,
        language
      });
      setResult(res.data);
      if (res.data.status === 'Accepted') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      console.error("Submit code error:", err);
      setResult({
        status: 'Runtime Error',
        output: 'Submission failed. Please verify syntax.',
        passedTestCases: 0,
        totalTestCases: 0
      });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <p className="text-slate-400">Problem not found.</p>
        <Link to="/coding" className="mt-3 inline-block px-4 py-2 bg-amber-600 rounded-lg text-xs font-semibold text-white">
          Back to Coding Arena
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/coding" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            ← Coding Arena
          </Link>
          <span className="text-slate-600">/</span>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>{problem.title}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {problem.difficulty}
            </span>
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={executing}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>{executing ? "Evaluating..." : "Run Test Cases"}</span>
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={executing}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Two Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-170px)] min-h-[600px]">
        
        {/* Left Pane (5 Cols): Problem Statement */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              {problem.category || 'Algorithms'}
            </span>
            <h2 className="text-xl font-bold text-white mt-1 mb-3">{problem.title}</h2>
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {problem.description}
            </div>
          </div>

          {/* Sample Input & Output */}
          {problem.sampleInput && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Example Walkthrough</h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
                <div>
                  <span className="text-slate-500">Input: </span>
                  <span className="text-slate-200">{problem.sampleInput}</span>
                </div>
                <div>
                  <span className="text-slate-500">Output: </span>
                  <span className="text-emerald-400">{problem.sampleOutput}</span>
                </div>
              </div>
            </div>
          )}

          {/* Hints */}
          {problem.hints && (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showHint ? "Hide Algorithmic Hint" : "Show Algorithmic Hint"}</span>
              </button>
              {showHint && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                  💡 {problem.hints}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Pane (7 Cols): Code Editor & Console */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Editor Header Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-300">Editor</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {['java', 'python', 'javascript'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                    language === lang
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea / Editor */}
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-b-2xl p-4 font-mono text-xs sm:text-sm overflow-hidden flex flex-col">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              placeholder="// Write your algorithm here..."
              className="w-full flex-1 bg-transparent text-emerald-400 font-mono resize-none focus:outline-none leading-relaxed selection:bg-blue-700 selection:text-white"
            />
          </div>

          {/* Execution Console Result */}
          {result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    result.status === 'Accepted'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {result.status}
                  </span>
                  <span className="text-slate-400">
                    Passed {result.passedTestCases} / {result.totalTestCases} Test Cases
                  </span>
                </div>
                {result.executionTimeMs && (
                  <span className="text-slate-500 font-mono text-[11px]">
                    ⏱ {result.executionTimeMs}ms
                  </span>
                )}
              </div>

              {result.output && (
                <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {result.output}
                </p>
              )}

              {/* Individual Test Cases Details */}
              {result.testCaseResults && result.testCaseResults.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {result.testCaseResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        {tc.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className="text-slate-400">Case {idx + 1}: {tc.input}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500">Exp: {tc.expectedOutput} | </span>
                        <span className={tc.passed ? "text-emerald-400" : "text-rose-400"}>
                          Act: {tc.actualOutput}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default CodeProblemSolve;
