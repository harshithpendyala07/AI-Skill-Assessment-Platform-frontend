import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  BotMessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interviews/${id}`);
        setInterview(res.data);
        const qList = res.data.questions || [];
        setQuestions(qList);

        // Find first unanswered question
        const firstUnanswered = qList.findIndex((q) => !q.answer || q.answer.trim() === '');
        if (firstUnanswered !== -1) {
          setCurrentIndex(firstUnanswered);
        }
      } catch (err) {
        console.error("Error fetching interview session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. You can type your response directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic start error:", e);
      }
    }
  };

  const handleSpeakQuestion = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || submitting) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/interviews/${id}/answer`, {
        questionId: currentQ.id,
        answer: answer.trim()
      });

      // Update question in local state
      const updatedList = [...questions];
      updatedList[currentIndex] = res.data;
      setQuestions(updatedList);
      setCurrentFeedback(res.data);
    } catch (err) {
      console.error("Answer submission failed:", err);
      alert("Failed to submit response.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setCurrentFeedback(null);
    setAnswer('');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinalizeInterview = async () => {
    setSubmitting(true);
    try {
      await api.post(`/interviews/${id}/complete`);
      navigate(`/interviews/report/${id}`);
    } catch (err) {
      console.error("Complete error:", err);
      navigate(`/interviews/report/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!interview || questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center text-slate-300">
        <p>Interview session is not available.</p>
        <Link to="/interviews" className="mt-3 inline-block px-4 py-2 bg-purple-600 rounded-lg text-xs font-semibold">
          Return to Interviews
        </Link>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const isQuestionAnswered = currentFeedback !== null || (currentQ?.score !== null && currentQ?.score !== undefined);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Session Top Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/interviews" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            ← Exit Session
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-bold text-purple-400">
            {interview.skill} ({interview.difficulty})
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-400">
          Question <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{questions.length}</strong>
        </div>
      </div>

      {/* AI Interviewer Avatar & Speech Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden space-y-6 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <BotMessageSquare className="w-7 h-7 text-white" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">AI Technical Interviewer</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30">
                Live Simulation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Assessing depth, clarity, and architectural understanding</p>
          </div>
        </div>

        {/* Current Question Display */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
              Prompt #{currentIndex + 1}
            </span>

            <button
              onClick={() => handleSpeakQuestion(currentQ.question)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
              <span>{isSpeaking ? "Mute Voice" : "Speak Question"}</span>
            </button>
          </div>

          <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed">
            "{currentQ.question}"
          </p>
        </div>

        {/* Candidate Response Workspace */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Your Technical Response</span>

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-purple-400" />}
              <span>{isListening ? "Listening... (Click to Stop)" : "Voice Dictate (Microphone)"}</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isQuestionAnswered}
            placeholder="Dictate with your microphone or type your detailed technical response here... (Explain core concepts, design trade-offs, and practical examples)"
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm leading-relaxed"
          />

          {!isQuestionAnswered && (
            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || submitting}
              className="w-full py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-40 shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "AI is Evaluating Your Response..." : "Submit Answer & Get AI Feedback"}</span>
            </button>
          )}
        </div>

        {/* AI Evaluation Box (Shows once answered) */}
        {(currentFeedback || currentQ.feedback) && (
          <div className="p-5 rounded-2xl bg-purple-900/20 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Instant AI Feedback
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-600/30 text-purple-300 border border-purple-500/30">
                Score: {currentFeedback?.score || currentQ.score}/100
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentFeedback?.feedback || currentQ.feedback}
            </p>

            <div className="pt-2 flex justify-end">
              {isLastQuestion ? (
                <button
                  onClick={handleFinalizeInterview}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>{submitting ? "Finalizing Report..." : "Complete Interview & View Report"}</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 flex items-center gap-2 transition-all"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default InterviewSession;
