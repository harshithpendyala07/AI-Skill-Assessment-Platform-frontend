import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ClipboardCheck,
  Code2,
  BotMessageSquare,
  BookOpen,
  FileSearch,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Cpu,
  ShieldCheck
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: ClipboardCheck,
      title: "Skill-Based Assessments",
      desc: "Timed technical MCQs covering Java Core, Spring Boot, React, and SQL with detailed explanation breakdowns.",
      color: "from-blue-500 to-cyan-500",
      path: "/tests"
    },
    {
      icon: Code2,
      title: "Interactive Coding Arena",
      desc: "Solve algorithmic challenges with multi-language support (Java, Python, JS) and instant test-case execution.",
      color: "from-amber-500 to-orange-500",
      path: "/coding"
    },
    {
      icon: BotMessageSquare,
      title: "AI Voice Mock Interview",
      desc: "Simulate real technical interviews with voice speech recognition, AI evaluation, and scorecards.",
      color: "from-purple-500 to-pink-500",
      path: "/interviews"
    },
    {
      icon: BookOpen,
      title: "AI Study Assistant (RAG)",
      desc: "LLM + RAG pipeline that retrieves knowledge from indexed course syllabi, textbooks, and notes with citations.",
      color: "from-emerald-500 to-teal-500",
      path: "/study"
    },
    {
      icon: FileSearch,
      title: "AI Resume & Skill Gap Analyzer",
      desc: "Match your resume against industry job profiles, identify missing competencies, and receive a guided path.",
      color: "from-rose-500 to-red-500",
      path: "/resume"
    },
    {
      icon: Trophy,
      title: "Analytics & Leaderboards",
      desc: "Track skill mastery radar, benchmark against peers, and earn badges as you reach technical proficiency.",
      color: "from-yellow-500 to-amber-600",
      path: "/leaderboard"
    }
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Learning & Interview Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-tight">
            Elevate Your Technical Skills with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              AI-Powered Assessment
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Assess technical competencies, practice algorithmic coding, simulate voice-driven AI mock interviews,
            and query course materials with RAG intelligence. Designed for ambitious software engineers.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Assessment"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/tests"
              className="px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-2 transition-all hover:border-slate-600"
            >
              <span>Explore Skill Catalog</span>
            </Link>
          </div>

          {/* Quick Credential Hint */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pre-configured Demo Accounts
            </span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" /> Full Stack: Spring Boot + React + MySQL
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> JWT Role-Based Security
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Integrated Technical Preparation Suite
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            Everything you need to benchmark, refine, and interview for top-tier software engineering roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                to={feat.path}
                className="group relative p-6 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-purple-900/30 border border-slate-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-blue-400 font-mono text-xs uppercase tracking-wider font-semibold">
                Architecture Blueprint
              </span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                Enterprise Full-Stack Implementation
              </h2>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Frontend:</strong> React.js, Vite, React Router, Tailwind CSS, Web Speech Recognition.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Backend:</strong> Java 21, Spring Boot 3, Spring Security with stateless JWT, Hibernate JPA.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Database:</strong> MySQL 8.0 with normalized schema (Users, Tests, Questions, Results, Submissions, Interviews).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>AI & RAG:</strong> Chunking engine, semantic relevance scoring, automated mock interview critique.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-950/90 rounded-2xl p-6 border border-slate-800 font-mono text-xs text-slate-300 shadow-2xl">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800 text-slate-400">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span>System Health & Live Services</span>
              </div>
              <div className="space-y-2">
                <p className="text-emerald-400">✓ Spring Boot 3.3 REST API: Connected (Port 8080)</p>
                <p className="text-emerald-400">✓ MySQL 8.0 Database: Schema initialized & seeded</p>
                <p className="text-emerald-400">✓ JWT Security Filter: Active & validating requests</p>
                <p className="text-emerald-400">✓ RAG Knowledge Base: Documents loaded & chunked</p>
                <p className="text-blue-400">✓ Swagger UI Documentation: Available at /swagger-ui.html</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
