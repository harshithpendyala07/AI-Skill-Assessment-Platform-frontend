import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  ShieldAlert, Users, ClipboardCheck, Code2, BotMessageSquare, Plus,
  Trash2, RotateCcw, BarChart3, UserRound, X, CheckCircle2
} from 'lucide-react';

const emptyQuestion = () => ({
  question: '', optionA: '', optionB: '', optionC: '', optionD: '',
  answer: 'A', category: '', explanation: ''
});

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [skill, setSkill] = useState('Java');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState(15);
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/students')
      ]);
      setStats(statsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error('Admin fetch error:', err);
      alert(err.response?.data?.message || 'Could not load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const openStudent = async (student) => {
    setSelectedStudent(student);
    setStudentDetails(null);
    try {
      const { data } = await api.get(`/admin/students/${student.id}`);
      setStudentDetails(data);
    } catch (err) {
      console.error('Student detail error:', err);
      setStudentDetails(student);
    }
  };

  const updateQuestion = (index, field, value) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
  };

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()]);
  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const resetTestForm = () => {
    setTitle('');
    setSkill('Java');
    setDifficulty('Intermediate');
    setDuration(15);
    setDescription('');
    setQuestions([emptyQuestion()]);
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (questions.some(q => !q.question.trim() || !q.optionA.trim() || !q.optionB.trim() ||
      !q.optionC.trim() || !q.optionD.trim())) {
      alert('Please complete the question and all four options.');
      return;
    }

    setCreating(true);
    try {
      await api.post('/admin/tests', {
        title, skill, difficulty, duration, description,
        questions: questions.map(q => ({
          ...q,
          category: q.category || skill,
          explanation: q.explanation || ''
        }))
      });
      alert('Assessment created successfully with your questions.');
      setShowTestModal(false);
      resetTestForm();
      fetchAdminData();
    } catch (err) {
      console.error('Test creation error:', err);
      alert(err.response?.data?.message || 'Failed to create assessment.');
    } finally {
      setCreating(false);
    }
  };

  const clearHistory = async (student) => {
    if (!window.confirm(`Clear all assessment/coding/interview/resume history for ${student.name}?`)) return;
    try {
      await api.delete(`/admin/users/${student.id}/history`);
      alert('Student history cleared.');
      fetchAdminData();
      if (selectedStudent?.id === student.id) setSelectedStudent(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not clear history.');
    }
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Delete student account "${student.name}" and all stored history? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${student.id}`);
      alert('Student account deleted.');
      fetchAdminData();
      if (selectedStudent?.id === student.id) setSelectedStudent(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete student.');
    }
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  const statItems = [
    { title: 'Registered Students', value: stats?.totalStudents ?? 0, icon: Users, color: 'text-blue-400' },
    { title: 'Assessments', value: stats?.totalTests ?? 0, icon: ClipboardCheck, color: 'text-emerald-400' },
    { title: 'MCQ Questions', value: stats?.totalQuestions ?? 0, icon: CheckCircle2, color: 'text-cyan-400' },
    { title: 'Average Percentage', value: `${stats?.averagePercentage ?? 0}%`, icon: BarChart3, color: 'text-amber-400' },
    { title: 'Participation', value: `${stats?.participationPercentage ?? 0}%`, icon: Users, color: 'text-purple-400' },
    { title: 'Coding Problems', value: stats?.totalCodingProblems ?? 0, icon: Code2, color: 'text-indigo-400' },
    { title: 'Interviews', value: stats?.totalInterviews ?? 0, icon: BotMessageSquare, color: 'text-pink-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrator
          </div>
          <h1 className="text-3xl font-extrabold text-white">Campus Assessment Control Center</h1>
          <p className="text-slate-400 text-sm mt-1">Create your own MCQs and monitor real student participation and percentages.</p>
        </div>
        <button onClick={() => setShowTestModal(true)}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-amber-600 hover:bg-amber-500 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {statItems.map(item => {
          const Icon = item.icon;
          return <div key={item.title} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <Icon className={`w-5 h-5 ${item.color} mb-2`} />
            <p className="text-xl font-black text-white">{item.value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{item.title}</p>
          </div>;
        })}
      </div>

      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> Student Details & Performance
          </h2>
          <span className="text-xs text-slate-500">{students.length} students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Completed</th>
                <th className="py-3 px-3">Percentage</th>
                <th className="py-3 px-3">Participation</th>
                <th className="py-3 px-3">Last Activity</th>
                <th className="py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <button onClick={() => openStudent(s)} className="text-left">
                      <p className="font-bold text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-500">#{s.id} • {s.targetRole || 'Student'}</p>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{s.email}</td>
                  <td className="py-3 px-3 text-slate-300">{s.completedAssessments}/{s.totalAssessments}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{s.averagePercentage}%</td>
                  <td className="py-3 px-3 font-bold text-blue-400">{s.participationPercentage}%</td>
                  <td className="py-3 px-3 text-slate-500">{s.lastActivity ? new Date(s.lastActivity).toLocaleString() : 'No activity'}</td>
                  <td className="py-3 px-3">
                    <div className="flex gap-1.5">
                      <button title="View" onClick={() => openStudent(s)} className="p-2 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700"><UserRound className="w-3.5 h-3.5" /></button>
                      <button title="Clear history" onClick={() => clearHistory(s)} className="p-2 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"><RotateCcw className="w-3.5 h-3.5" /></button>
                      <button title="Delete student" onClick={() => deleteStudent(s)} className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-slate-700"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <p className="text-center text-slate-500 py-8">No registered students yet.</p>}
        </div>
      </section>

      {selectedStudent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500">{selectedStudent.email}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Average %" value={`${(studentDetails || selectedStudent).averagePercentage}%`} />
              <Metric label="Participation" value={`${(studentDetails || selectedStudent).participationPercentage}%`} />
              <Metric label="Completed" value={`${(studentDetails || selectedStudent).completedAssessments}/${(studentDetails || selectedStudent).totalAssessments}`} />
              <Metric label="Target Role" value={(studentDetails || selectedStudent).targetRole || 'Not set'} />
            </div>
            <p className="text-xs text-slate-400 mt-5">Joined: {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : '-'}</p>
            <div className="mt-5">
              <h4 className="text-sm font-bold text-white mb-2">Assignment History</h4>
              {studentDetails?.history?.length ? (
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {studentDetails.history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-800">
                      <div>
                        <p className="text-xs font-semibold text-white">{h.assignment}</p>
                        <p className="text-[10px] text-slate-500">{h.skill} • {new Date(h.completedAt).toLocaleString()}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{h.percentage}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">{studentDetails ? 'No completed assignments.' : 'Loading history...'}</p>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => clearHistory(selectedStudent)} className="flex-1 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold">Clear History</button>
              <button onClick={() => deleteStudent(selectedStudent)} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold">Delete Student</button>
            </div>
          </div>
        </div>
      )}

      {showTestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4">
          <div className="max-w-4xl mx-auto my-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">Create Assignment</h3>
                <p className="text-xs text-slate-500 mt-1">Questions are entered by the administrator. No automatic MCQ generation.</p>
              </div>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Assignment title"
                  className="md:col-span-3 px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
                <select value={skill} onChange={e => setSkill(e.target.value)} className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">
                  <option>Java</option><option>Spring Boot</option><option>React</option><option>SQL</option><option>DevOps</option><option>Python</option>
                </select>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <input type="number" min="1" max="180" value={duration} onChange={e => setDuration(Number(e.target.value) || 15)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" placeholder="Duration (minutes)" />
              </div>
              <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Assignment description" className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Questions ({questions.length})</h4>
                <button type="button" onClick={addQuestion} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold"><Plus className="inline w-3.5 h-3.5 mr-1" /> Add Question</button>
              </div>

              {questions.map((q, index) => (
                <div key={index} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Question {index + 1}</span>
                    {questions.length > 1 && <button type="button" onClick={() => removeQuestion(index)} className="text-rose-400"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                  <textarea required rows={2} value={q.question} onChange={e => updateQuestion(index, 'question', e.target.value)}
                    placeholder="Enter question" className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['A','B','C','D'].map(letter => (
                      <input key={letter} required value={q[`option${letter}`]} onChange={e => updateQuestion(index, `option${letter}`, e.target.value)}
                        placeholder={`Option ${letter}`} className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" />
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <select value={q.answer} onChange={e => updateQuestion(index, 'answer', e.target.value)}
                      className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm">
                      <option value="A">Correct Answer: A</option><option value="B">Correct Answer: B</option>
                      <option value="C">Correct Answer: C</option><option value="D">Correct Answer: D</option>
                    </select>
                    <input value={q.category} onChange={e => updateQuestion(index, 'category', e.target.value)} placeholder="Category"
                      className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" />
                    <input value={q.explanation} onChange={e => updateQuestion(index, 'explanation', e.target.value)} placeholder="Explanation (optional)"
                      className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm" />
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setShowTestModal(false); resetTestForm(); }}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm">Cancel</button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm">
                  {creating ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value }) => (
  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
    <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
    <p className="text-lg font-black text-white mt-1">{value}</p>
  </div>
);

export default AdminPanel;
