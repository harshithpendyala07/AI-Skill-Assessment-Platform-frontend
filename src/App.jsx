import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SkillTests from './pages/SkillTests';
import TakeTest from './pages/TakeTest';
import TestResult from './pages/TestResult';
import CodingArena from './pages/CodingArena';
import CodeProblemSolve from './pages/CodeProblemSolve';
import MockInterview from './pages/MockInterview';
import InterviewSession from './pages/InterviewSession';
import InterviewReport from './pages/InterviewReport';
import StudyAssistant from './pages/StudyAssistant';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/tests" element={<SkillTests />} />
                <Route path="/tests/:id" element={<TakeTest />} />
                <Route path="/tests/result" element={<TestResult />} />
                <Route path="/coding" element={<CodingArena />} />
                <Route path="/coding/:id" element={<CodeProblemSolve />} />
                <Route path="/interviews" element={<MockInterview />} />
                <Route path="/interviews/session/:id" element={<InterviewSession />} />
                <Route path="/interviews/report/:id" element={<InterviewReport />} />
                <Route path="/study" element={<StudyAssistant />} />
                <Route path="/resume" element={<ResumeAnalyzer />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>

              {/* Admin Protected Route */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
