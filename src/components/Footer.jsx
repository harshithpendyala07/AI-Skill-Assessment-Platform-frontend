import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-300">
            SkillForge AI &copy; {new Date().getFullYear()}
          </span>
          <span className="text-xs text-slate-500">| Technical Assessment & Mock Interview Suite</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span>React.js + Spring Boot 3 + MySQL + RAG AI</span>
          <span className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic & Career Mastery
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
