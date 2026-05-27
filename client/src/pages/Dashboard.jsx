import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FiFileText,
  FiAward,
  FiTrendingUp,
  FiPlus,
  FiActivity,
  FiGrid,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/resume/history');
        setHistory(data);
      } catch (error) {
        console.error('Fetch history error:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-purple-500"></div>
      </div>
    );
  }

  // Calculate Metrics
  const totalResumes = history.length;
  const avgScore =
    totalResumes > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / totalResumes)
      : 0;
  const bestAts =
    totalResumes > 0
      ? Math.max(...history.map((item) => item.atsScore))
      : 0;

  // Chart data: reverse history to show chronologically
  const chartData = [...history]
    .reverse()
    .map((item, idx) => ({
      name: `Report ${idx + 1}`,
      overall: item.overallScore,
      ats: item.atsScore,
      skills: item.skillMatch,
      date: new Date(item.createdAt).toLocaleDateString(),
    }));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-400">
            Welcome back! Here is a summary of your resume analyses.
          </p>
        </div>
        <Link
          to="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 hover:opacity-90 hover:scale-105 transform transition-all duration-300"
        >
          <FiPlus className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      {totalResumes === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto space-y-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 border border-purple-500/25 text-purple-400">
            <FiFileText className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">No resumes analyzed yet</h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Upload your PDF or DOCX resume to get a breakdown of your score, missing skills, and detailed improvements.
            </p>
          </div>
          <Link
            to="/dashboard/upload"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-90"
          >
            Get Started
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Stat 1 */}
            <div className="glass-panel p-6 flex items-center justify-between border-b-2 border-b-purple-500">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Resumes
                </span>
                <p className="text-3xl font-extrabold text-white">{totalResumes}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                <FiFileText className="h-6 w-6" />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="glass-panel p-6 flex items-center justify-between border-b-2 border-b-pink-500">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Average Score
                </span>
                <p className="text-3xl font-extrabold text-white">{avgScore}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-600/10 border border-pink-500/20 text-pink-400">
                <FiActivity className="h-6 w-6" />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="glass-panel p-6 flex items-center justify-between border-b-2 border-b-indigo-500">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Best ATS Score
                </span>
                <p className="text-3xl font-extrabold text-white">{bestAts}%</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
                <FiAward className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FiTrendingUp className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Score Trends Over Time</h2>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1626',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="overall"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorOverall)"
                    name="Overall Quality"
                  />
                  <Area
                    type="monotone"
                    dataKey="ats"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAts)"
                    name="ATS Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Recent activity */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Uploads */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <FiGrid className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Recent Analyses</h2>
                </div>
                <Link to="/dashboard/history" className="text-xs text-purple-400 hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {history.slice(0, 3).map((item) => (
                  <Link
                    key={item._id}
                    to={`/dashboard/analysis/${item._id}`}
                    className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 hover:border-purple-500/20 transition-all duration-200"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {item.resumeName}
                      </p>
                      <p className="text-xs text-gray-400">{item.role}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-extrabold text-purple-400">
                          {item.overallScore}
                        </span>
                        <span className="text-[10px] text-gray-500">Score</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <FiAward className="h-5 w-5 text-pink-400" />
                <h2 className="text-lg font-bold text-white">ATS Optimization Tips</h2>
              </div>
              <ul className="space-y-3 text-sm text-gray-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                  Use clear, standard headings (e.g. &ldquo;Work Experience&rdquo;, &ldquo;Education&rdquo;).
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                  Avoid complex multi-column layouts, charts inside boxes, or graphic headers.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>
                  Use strong, metrics-driven bullet points (e.g., &ldquo;Improved API latency by 35%&rdquo;).
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
