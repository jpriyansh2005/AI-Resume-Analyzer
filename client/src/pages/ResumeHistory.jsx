import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { FiTrash2, FiExternalLink, FiClock, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ResumeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/resume/history');
      setHistory(data);
    } catch (error) {
      console.error('Fetch history error:', error);
      toast.error('Failed to load resume analysis history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) {
      return;
    }

    try {
      await api.delete(`/resume/${id}`);
      toast.success('Report deleted successfully');
      setHistory(history.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete analysis report');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Analysis History
        </h1>
        <p className="text-sm text-gray-400">
          Review and manage all your past AI resume reviews.
        </p>
      </div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto space-y-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/10 border border-purple-500/25 text-purple-400">
            <FiClock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">History is empty</h2>
            <p className="text-sm text-gray-400 max-w-sm">
              You haven&apos;t analyzed any resumes yet. Upload one to build your history log.
            </p>
          </div>
          <Link
            to="/dashboard/upload"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/20"
          >
            Upload Resume
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {history.map((item) => (
            <div
              key={item._id}
              className="glass-card p-6 flex flex-col justify-between min-h-[220px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                    <FiFileText className="h-5 w-5" />
                  </div>
                  <div className="flex items-end flex-col">
                    <span className="text-lg font-extrabold text-purple-400">
                      {item.overallScore}%
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-500">
                      Score
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="truncate text-base font-bold text-white" title={item.resumeName}>
                    {item.resumeName}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                    {item.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-200"
                    title="Delete Report"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/dashboard/analysis/${item._id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/20 transition-all duration-200"
                    title="View Analysis"
                  >
                    <FiExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeHistory;
