import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BookOpen,
  Sparkles,
  Send,
  Upload,
  BotMessageSquare,
  FileText,
  CheckCircle2,
  Bookmark,
  ChevronRight
} from 'lucide-react';

const StudyAssistant = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Study Assistant powered by RAG (Retrieval-Augmented Generation). Ask me anything about Java 21, Spring Boot 3, React 18, SQL indexing, or system design, and I'll retrieve answers grounded in verified technical course materials.",
      sources: []
    }
  ]);
  const [asking, setAsking] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Java');
  const [uploadContent, setUploadContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const samplePrompts = [
    "Explain Spring IoC container and Dependency Injection with code",
    "What is the difference between useEffect and useMemo in React?",
    "How does RAG architecture work with vector embeddings?",
    "Explain B-Tree indexing and query optimization in relational databases"
  ];

  const handleSendQuery = async (queryText = query) => {
    const textToSend = queryText.trim();
    if (!textToSend || asking) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setAsking(true);

    try {
      const res = await api.post('/rag/ask', {
        query: textToSend,
        category: category === 'ALL' ? null : category
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.answer,
          sources: res.data.sources || []
        }
      ]);
    } catch (err) {
      console.error("RAG query failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I encountered an error querying the knowledge base. Please ensure backend services are running.",
          sources: []
        }
      ]);
    } finally {
      setAsking(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim() || uploading) return;
    setUploading(true);
    setUploadSuccess('');
    try {
      await api.post('/rag/upload', {
        title: uploadTitle.trim(),
        category: uploadCategory,
        content: uploadContent.trim()
      });
      setUploadSuccess('Document successfully indexed and chunked into the RAG knowledge base!');
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadTitle('');
        setUploadContent('');
        setUploadSuccess('');
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> LLM + RAG Knowledge Grounding
          </div>
          <h1 className="text-3xl font-extrabold text-white">AI Study Assistant</h1>
          <p className="text-slate-400 text-sm mt-1">
            Query indexed technical documentation, syllabi, and reference materials with semantic source citations.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Suggested Prompts Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <span className="text-xs font-semibold text-slate-400">💡 Common Syllabus Questions:</span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendQuery(prompt)}
              className="text-xs text-slate-300 bg-slate-800 hover:bg-slate-700/80 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 min-h-[500px] flex flex-col justify-between space-y-6">
        <div className="space-y-6 overflow-y-auto max-h-[550px] pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shrink-0">
                  <BotMessageSquare className="w-5 h-5" />
                </div>
              )}

              <div className={`max-w-2xl p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-4'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Grounded RAG Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Bookmark className="w-3.5 h-3.5" /> Retrieved RAG Citations:
                    </span>
                    <div className="space-y-1.5">
                      {msg.sources.map((s, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400"
                        >
                          <strong className="text-slate-200">{s.documentTitle}</strong> ({s.category}):
                          <p className="italic text-slate-400 mt-0.5 line-clamp-2">"{s.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {asking && (
            <div className="flex gap-3.5 items-center text-xs text-slate-400">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span>Searching semantic knowledge base & generating answer...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="pt-4 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a technical or syllabus question (e.g. explain Spring Security filter chain)..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
            />
            <button
              type="submit"
              disabled={!query.trim() || asking}
              className="px-5 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>
      </div>

      {/* Upload Material Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Upload Course Notes / Syllabus
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Kafka Notes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  <option value="Java">Java</option>
                  <option value="Spring Boot">Spring Boot</option>
                  <option value="React">React</option>
                  <option value="SQL & Databases">SQL & Databases</option>
                  <option value="System Design">System Design</option>
                  <option value="Algorithms">Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Material Text Content
                </label>
                <textarea
                  rows={6}
                  required
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder="Paste syllabus notes, lecture transcripts, or textbook chapters here. The system will chunk and index it for semantic RAG queries..."
                  className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                >
                  {uploading ? "Indexing Material..." : "Index in RAG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudyAssistant;
