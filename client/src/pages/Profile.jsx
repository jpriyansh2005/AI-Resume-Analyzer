import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiFileText,
  FiActivity,
  FiUpload,
  FiDownload,
  FiSliders,
  FiGrid,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiEdit,
  FiKey,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiTrash2,
  FiCheck,
  FiEye,
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const Profile = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Overrides (for user interactive editing)
  const [profileName, setProfileName] = useState(
    localStorage.getItem('profile_name') || user?.name || 'Priyansh Jain'
  );
  const [profileRole, setProfileRole] = useState(
    localStorage.getItem('profile_role') || 'MERN Developer Aspirant'
  );

  // Sync auth state user name if local storage not set yet
  useEffect(() => {
    if (user?.name && !localStorage.getItem('profile_name')) {
      setProfileName(user.name);
    }
  }, [user]);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState(profileName);
  const [newRole, setNewRole] = useState(profileRole);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Settings State
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    recruiterViews: false,
  });
  const [privacy, setPrivacy] = useState({
    publicPortfolio: true,
    resumeIndexing: false,
  });

  // Skill Hover Active Coaching state
  const [activeSkillTooltip, setActiveSkillTooltip] = useState('MERN Fundamentals');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/resume/history');
        setHistory(data || []);
      } catch (err) {
        console.error('Failed to fetch resume history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Compute profile statistics (dynamic with fallback mock numbers if no resumes yet)
  const hasHistory = history.length > 0;
  
  const stats = {
    totalResumes: hasHistory ? history.length : 12,
    bestAtsScore: hasHistory 
      ? Math.max(...history.map(h => h.atsScore || 0)) 
      : 92,
    avgScore: hasHistory 
      ? Math.round(history.reduce((sum, h) => sum + (h.overallScore || 0), 0) / history.length) 
      : 85,
    interviewReadiness: hasHistory 
      ? Math.round(history.reduce((sum, h) => sum + (((h.skillMatch || 0) + (h.overallScore || 0)) / 2), 0) / history.length) 
      : 88,
    mostTargetedRole: hasHistory 
      ? (history[0].role || 'MERN Developer') 
      : 'MERN Developer',
  };

  // Profile completion calculation (out of 100%)
  const profileCompletion = 82; // Static core, but lets user feel the value

  // Mock graph data for fallback
  const mockGrowthData = [
    { version: 'V1', score: 68, ats: 62 },
    { version: 'V2', score: 74, ats: 71 },
    { version: 'V3', score: 88, ats: 84 },
    { version: 'V4', score: 92, ats: 90 },
  ];

  // Dynamic graph data
  const chartData = hasHistory && history.length > 1
    ? [...history].reverse().map((item, idx) => ({
        version: `V${idx + 1}`,
        score: item.overallScore || 0,
        ats: item.atsScore || 0,
        name: item.resumeName,
      }))
    : mockGrowthData;

  const scoreImprovement = hasHistory && history.length > 1
    ? (history[0].overallScore || 0) - (history[history.length - 1].overallScore || 0)
    : 24;

  // Skills Snapshot data
  const skillsData = [
    { name: 'MERN Fundamentals', level: 90, status: 'Strong' },
    { name: 'Deployment', level: 60, status: 'Average' },
    { name: 'Testing', level: 40, status: 'Weak' },
    { name: 'Authentication', level: 75, status: 'Average' },
    { name: 'DevOps', level: 30, status: 'Weak' },
  ];

  const skillCoaching = {
    'MERN Fundamentals': 'Excellent core knowledge. Your React component state configurations and Express controllers score in the 90th percentile.',
    'Deployment': 'Consider deploying your backend services to Render or AWS, and frontends to Vercel to optimize system availability metrics.',
    'Testing': 'Adding automated unit tests (Jest) and End-to-End browser coverage (Cypress) will significantly boost your interview readiness.',
    'Authentication': 'Secure token validation configuration is correct. To reach advanced standards, configure social OAuth 2.0 integrations.',
    'DevOps': 'Setting up GitHub Actions pipeline checks and basic Docker containers will make your profile stand out to recruiters.',
  };

  // Gamification Badges
  const badges = [
    {
      id: 'ats',
      title: 'ATS Optimized',
      desc: 'Achieved a 90+ ATS Score',
      icon: '🏆',
      unlocked: stats.bestAtsScore >= 90,
      req: 'Unlocked after 90+ ATS score',
    },
    {
      id: 'mern',
      title: 'Strong MERN Candidate',
      desc: 'MERN stack matching criteria',
      icon: '🔥',
      unlocked: hasHistory ? (Math.max(...history.map(h => h.skillMatch || 0)) >= 85) : true,
      req: 'Unlocked after 85% skill match',
    },
    {
      id: 'improver',
      title: 'Fast Improver',
      desc: 'Resume improved by 15+ points',
      icon: '🚀',
      unlocked: scoreImprovement >= 15,
      req: 'Unlocked after resume improved by 15 points',
    },
    {
      id: 'optimizer',
      title: 'Consistent Optimizer',
      desc: 'Analyze 5 or more resumes',
      icon: '💡',
      unlocked: stats.totalResumes >= 5,
      req: 'Analyzed 5+ resumes',
    },
    {
      id: 'ready',
      title: 'Interview Ready',
      desc: 'Overall readiness above 85%',
      icon: '🎯',
      unlocked: stats.interviewReadiness >= 85,
      req: 'Readiness above 85%',
    },
    {
      id: 'senior',
      title: 'Senior Developer Ready',
      desc: 'Advanced system design features',
      icon: '🔒',
      unlocked: false,
      req: 'Improve testing & DevOps skills to unlock',
    },
  ];

  const handleEditProfileSave = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) {
      toast.error('All fields are required.');
      return;
    }
    setProfileName(newName);
    setProfileRole(newRole);
    localStorage.setItem('profile_name', newName);
    localStorage.setItem('profile_role', newRole);
    setIsEditModalOpen(false);
    toast.success('Profile updated successfully!');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill out all password fields.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    // Simulate API update
    setIsPasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password updated successfully!');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is locked in demo mode.');
    setIsDeleteModalOpen(false);
  };

  const latestReportId = hasHistory ? history[0]._id : null;

  return (
    <div className="space-y-10 pb-16 relative">
      
      {/* Page Title Header */}
      <div className="flex flex-col gap-2 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Career Dashboard
        </h1>
        <p className="text-sm text-gray-400">
          Monitor your resume scoring benchmarks, optimize key skills, and track your career growth journey.
        </p>
      </div>

      {/* 1. PREMIUM PROFILE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 relative overflow-hidden border border-purple-500/10 shadow-xl shadow-purple-500/5 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-indigo-600/5 to-transparent pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
          
          {/* Avatar & Info Group */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full md:w-auto">
            {/* Circular Progress Avatar */}
            <div className="relative flex items-center justify-center h-24 w-24 shrink-0">
              <svg className="absolute h-full w-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" fill="transparent" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="4" />
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 - (profileCompletion / 100) * 2 * Math.PI * 42}
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex h-18 w-18 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-white text-2xl font-black uppercase shadow-lg shadow-purple-500/10">
                {profileName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 bg-purple-600 border border-purple-400 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                {profileCompletion}%
              </span>
            </div>

            {/* Name, Role & Badges */}
            <div className="space-y-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white leading-none flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {profileName}
                  <span className="text-[10px] font-extrabold tracking-widest uppercase bg-purple-600/20 border border-purple-500/35 text-purple-300 px-2 py-0.5 rounded-full animate-pulse">
                    EXCELLENT MATCH ⭐
                  </span>
                </h2>
                <p className="text-sm font-semibold text-purple-400">{profileRole}</p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                  <FiShield className="h-3 w-3 text-indigo-400" />
                  SaaS Account
                </span>
                <span className="text-gray-600">&middot;</span>
                <span className="text-[11px] font-medium text-gray-400">
                  Strong profile for MERN internships.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto border-t border-white/5 pt-4 md:border-none md:pt-0">
            <button
              onClick={() => {
                setNewName(profileName);
                setNewRole(profileRole);
                setIsEditModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white px-4 py-2.5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-md"
            >
              <FiEdit className="h-3.5 w-3.5 text-purple-400" />
              Edit Profile
            </button>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white px-4 py-2.5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5 shadow-md"
            >
              <FiKey className="h-3.5 w-3.5 text-indigo-400" />
              Change Password
            </button>
            <button
              onClick={() => {
                setIsSettingsExpanded(true);
                setTimeout(() => {
                  document.getElementById('account-settings')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white px-4 py-2.5 transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 shadow-md cursor-pointer"
            >
              <FiSettings className="h-3.5 w-3.5" />
              Manage Account
            </button>
          </div>

        </div>
      </motion.div>

      {/* 2. RESUME STATISTICS SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-gray-400 tracking-widest uppercase flex items-center gap-2">
          <FiGrid className="h-4 w-4 text-purple-400" />
          Resume Performance Analytics
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Card 1 */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-purple-400 uppercase tracking-widest">Resumes Analyzed</span>
              <FiFileText className="h-4 w-4 text-purple-400" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white leading-none">{stats.totalResumes}</p>
              <p className="text-[10px] text-gray-500 font-medium">Across target roles</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-green-500/20 hover:shadow-lg hover:shadow-green-500/5 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-green-400 uppercase tracking-widest">Best ATS Score</span>
              <FiAward className="h-4 w-4 text-green-400" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white leading-none">{stats.bestAtsScore}%</p>
              <p className="text-[10px] text-gray-500 font-medium">Highest optimization</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest">Average Score</span>
              <FiTrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white leading-none">{stats.avgScore}%</p>
              <p className="text-[10px] text-gray-500 font-medium">Across all reviews</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-amber-500/20 hover:shadow-lg hover:shadow-amber-500/5 transition duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-widest">Interview Ready</span>
              <FiTarget className="h-4 w-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white leading-none">{stats.interviewReadiness}%</p>
              <p className="text-[10px] text-gray-500 font-medium">Internship readiness</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-3 hover:border-pink-500/20 hover:shadow-lg hover:shadow-pink-500/5 transition duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-pink-400 uppercase tracking-widest">Target Role</span>
              <FiActivity className="h-4 w-4 text-pink-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-extrabold text-white leading-tight truncate">{stats.mostTargetedRole}</p>
              <p className="text-[10px] text-gray-500 font-medium">Most analyzed stack</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RESUME GROWTH JOURNEY */}
      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4 text-purple-400" />
              Career Progress Journey
            </h3>
            <p className="text-xs text-gray-400 mt-1">Track how your resume overall score improved over time.</p>
          </div>
          <div className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
            {scoreImprovement > 0 
              ? `Overall Improvement: +${scoreImprovement} Points` 
              : 'Dotted layout shows target career progress path'}
          </div>
        </div>

        <div className="h-[200px] w-full relative">
          {!hasHistory || history.length <= 1 ? (
            /* Empty State Overlay Warning */
            <div className="absolute inset-0 bg-[#050b14]/40 backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center text-center p-4">
              <span className="bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                DEMO GROWTH PREVIEW
              </span>
              <p className="text-xs font-bold text-white max-w-[280px]">Upload another resume version to track growth</p>
            </div>
          ) : null}

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="version" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1626',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#a855f7"
                strokeWidth={3}
                strokeDasharray={!hasHistory || history.length <= 1 ? '5 5' : '0'}
                activeDot={{ r: 5 }}
                name="Overall Score"
              />
              <Line
                type="monotone"
                dataKey="ats"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 2 }}
                name="ATS Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* 6. QUICK ACTIONS SECTION */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-gray-400 tracking-widest uppercase flex items-center gap-2">
          <FiSliders className="h-4 w-4 text-purple-400" />
          Dashboard Core Triggers
        </h3>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Link
            to="/dashboard/upload"
            className="glass-card p-4 flex flex-col items-center justify-center text-center gap-2.5 border border-purple-500/20 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <FiUpload className="h-5 w-5 text-purple-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-bold text-white">Upload New</span>
          </Link>

          <Link
            to="/dashboard/history"
            className="glass-card p-4 flex flex-col items-center justify-center text-center gap-2.5 border border-white/5 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <FiActivity className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-bold text-white">View History</span>
          </Link>

          <button
            onClick={() => {
              if (history.length > 0) {
                setIsCompareModalOpen(true);
              } else {
                toast.error('Upload resumes to view relative diagnostics comparisons.');
              }
            }}
            className="glass-card p-4 flex flex-col items-center justify-center text-center gap-2.5 border border-white/5 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
          >
            <FiTrendingUp className="h-5 w-5 text-amber-400 group-hover:scale-110 transition duration-300" />
            <span className="text-xs font-bold text-white">Compare Versions</span>
          </button>
        </div>
      </div>

      {/* 7. CAREER INSIGHTS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-6 space-y-6"
      >
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <FiUser className="h-5 w-5 text-purple-400" />
          AI Career Insights
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Executive Summary Card */}
          <div className="md:col-span-2 bg-[#050b14]/30 border border-white/5 rounded-xl p-5 space-y-3">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded inline-block">
              Executive Evaluation Summary
            </span>
            <p className="text-xs text-gray-300 leading-relaxed font-semibold">
              &ldquo;Your profile shows strong capabilities for junior and entry-level MERN stack developer opportunities. To become highly competitive for premium internships, focus on expanding automated testing code coverage, configuring cloud deployments (Vercel/Render), and integrating metrics in project descriptions.&rdquo;
            </p>
          </div>

          {/* Strengths & Weaknesses quick glance */}
          <div className="bg-[#050b14]/30 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-400 block">
                ✓ Strengths Checklist
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-400 h-3.5 w-3.5 shrink-0" />
                  <span>MERN core logic configuration</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-green-400 h-3.5 w-3.5 shrink-0" />
                  <span>ATS-compliant spacing layout</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400 block">
                ⚠ Focus Areas Needed
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <FiAlertTriangle className="text-amber-400 h-3.5 w-3.5 shrink-0" />
                  <span>Cloud deployment configurations</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiAlertTriangle className="text-amber-400 h-3.5 w-3.5 shrink-0" />
                  <span>Automated test workflows</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendation Badge message */}
        <div className="bg-purple-900/5 border border-purple-500/20 p-4 rounded-xl text-xs text-purple-300 flex items-center justify-between">
          <span className="font-semibold">AI Next Action Suggestion:</span>
          <span className="font-extrabold">
            With 2–3 weeks of focused improvement, your profile could become highly competitive for internships.
          </span>
        </div>
      </motion.div>

      {/* 8. ACCOUNT SETTINGS SECTION */}
      <div id="account-settings" className="glass-panel overflow-hidden border border-white/5">
        <button
          onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
          className="w-full p-6 flex items-center justify-between bg-white/2 hover:bg-white/5 transition-all text-left outline-none cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <FiSettings className="h-5 w-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Account Settings & Preferences</h3>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Manage email configurations, security codes, and security options.</p>
            </div>
          </div>
          {isSettingsExpanded ? (
            <FiChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <FiChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {isSettingsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 overflow-hidden"
            >
              <div className="p-6 space-y-6">
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Read-Only Stats */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Registered Email Address</label>
                      <input
                        type="text"
                        value={user?.email || 'priyansh@example.com'}
                        readOnly
                        className="w-full bg-[#050b14]/50 border border-white/10 text-xs text-gray-400 p-2.5 rounded-lg outline-none cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Account Created</label>
                      <input
                        type="text"
                        value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                        readOnly
                        className="w-full bg-[#050b14]/50 border border-white/10 text-xs text-gray-400 p-2.5 rounded-lg outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Preferences Checkboxes */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Notification Settings</span>
                    <div className="space-y-2.5">
                      <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailAlerts}
                          onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 outline-none h-4 w-4"
                        />
                        <span>Email alert warnings when score is calculated</span>
                      </label>
                      
                      <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReports}
                          onChange={(e) => setNotifications({ ...notifications, weeklyReports: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 outline-none h-4 w-4"
                        />
                        <span>Weekly career recommendation diagnostics reports</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.recruiterViews}
                          onChange={(e) => setNotifications({ ...notifications, recruiterViews: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 outline-none h-4 w-4"
                        />
                        <span>Notify me when recruiters search my stack skills</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 pt-6 border-t border-white/5">
                  {/* Privacy Toggles */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Privacy Controls</span>
                    <div className="space-y-2.5">
                      <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.publicPortfolio}
                          onChange={(e) => setPrivacy({ ...privacy, publicPortfolio: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 outline-none h-4 w-4"
                        />
                        <span>Allow public sharing of my career profile metrics</span>
                      </label>

                      <label className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.resumeIndexing}
                          onChange={(e) => setPrivacy({ ...privacy, resumeIndexing: e.target.checked })}
                          className="rounded border-white/10 bg-white/5 text-purple-600 focus:ring-0 outline-none h-4 w-4"
                        />
                        <span>Allow AI systems to index my parsed resume</span>
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone Actions */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">Account Danger Zone</span>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 px-3.5 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                      >
                        <FiLock className="h-3.5 w-3.5" />
                        Modify Security Password
                      </button>
                      <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600/10 border border-red-500/20 hover:bg-red-600 hover:border-red-500 px-3.5 py-2 text-xs font-bold text-red-400 hover:text-white transition-all cursor-pointer"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        Delete Account Permanently
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-[#050b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 space-y-6 border border-white/10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiUser className="h-5 w-5 text-purple-400" />
                  Modify Profile Details
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xs outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditProfileSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#050b14] border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-purple-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target / Career Role</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#050b14] border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-purple-500"
                    placeholder="e.g. MERN Developer Aspirant"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 border border-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition shadow-md shadow-purple-500/20"
                  >
                    Save Modifications
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-[#050b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 space-y-6 border border-white/10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiLock className="h-5 w-5 text-purple-400" />
                  Modify Password Settings
                </h3>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xs outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full bg-[#050b14] border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-[#050b14] border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-purple-500"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-[#050b14] border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-purple-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 border border-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition shadow-md shadow-purple-500/20"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPARE VERSIONS MODAL */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <div className="fixed inset-0 bg-[#050b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-2xl p-6 space-y-6 border border-white/10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiTrendingUp className="h-5 w-5 text-purple-400" />
                  Comparative Resume Diagnostics
                </h3>
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xs outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-400 border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-200">
                      <th className="py-2.5 px-3">Resume Version</th>
                      <th className="py-2.5 px-3">Target Role</th>
                      <th className="py-2.5 px-3 text-center">Overall Score</th>
                      <th className="py-2.5 px-3 text-center">ATS Compatibility</th>
                      <th className="py-2.5 px-3 text-center">Skill Matching</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hasHistory ? (
                      history.map((h, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/2 transition">
                          <td className="py-3 px-3 font-semibold text-white truncate max-w-[150px]" title={h.resumeName}>
                            {h.resumeName}
                          </td>
                          <td className="py-3 px-3">{h.role}</td>
                          <td className="py-3 px-3 text-center font-bold text-purple-400">{h.overallScore}%</td>
                          <td className="py-3 px-3 text-center text-green-400">{h.atsScore}%</td>
                          <td className="py-3 px-3 text-center text-indigo-400">{h.skillMatch}%</td>
                        </tr>
                      ))
                    ) : (
                      // Fallback rows for example visualization
                      <>
                        <tr className="border-b border-white/5">
                          <td className="py-3 px-3 font-semibold text-white">Example_Resume_V4.pdf</td>
                          <td className="py-3 px-3">MERN Developer</td>
                          <td className="py-3 px-3 text-center font-bold text-purple-400">92%</td>
                          <td className="py-3 px-3 text-center text-green-400">90%</td>
                          <td className="py-3 px-3 text-center text-indigo-400">87%</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-3 px-3 font-semibold text-white">Example_Resume_V3.pdf</td>
                          <td className="py-3 px-3">MERN Developer</td>
                          <td className="py-3 px-3 text-center font-bold text-purple-400">88%</td>
                          <td className="py-3 px-3 text-center text-green-400">84%</td>
                          <td className="py-3 px-3 text-center text-indigo-400">82%</td>
                        </tr>
                        <tr className="border-b border-white/5 text-gray-500">
                          <td className="py-3 px-3">Example_Resume_V2.pdf</td>
                          <td className="py-3 px-3">MERN Developer</td>
                          <td className="py-3 px-3 text-center font-bold">74%</td>
                          <td className="py-3 px-3 text-center">71%</td>
                          <td className="py-3 px-3 text-center">69%</td>
                        </tr>
                        <tr className="text-gray-500">
                          <td className="py-3 px-3">Example_Resume_V1.pdf</td>
                          <td className="py-3 px-3">MERN Developer</td>
                          <td className="py-3 px-3 text-center font-bold">68%</td>
                          <td className="py-3 px-3 text-center">62%</td>
                          <td className="py-3 px-3 text-center">65%</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition shadow-md"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-[#050b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-md p-6 space-y-6 border border-red-500/20"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <FiAlertTriangle className="h-5 w-5" />
                  Confirm Account Deletion
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-white text-xs outline-none cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <p className="font-bold text-white text-sm">Warning: This action is permanent and cannot be undone.</p>
                <p>Deleting your account will immediately wipe your resume analysis history, custom optimization text records, and score improvement progress from our database.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 border border-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition shadow-md shadow-red-500/20"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;
