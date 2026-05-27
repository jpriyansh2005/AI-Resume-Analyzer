import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiFileText, FiTarget, FiAlertCircle } from 'react-icons/fi';

const ROLES = [
  'MERN Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Software Engineer Intern',
  'Data Analyst',
  'Data Scientist',
  'DevOps Engineer',
  'UI/UX Designer',
  'Mobile App Developer (iOS/Android)',
  'Cloud Architect',
  'Cybersecurity Specialist',
  'AI/Machine Learning Engineer',
  'QA Automation Engineer',
  'Product Manager',
  'Systems Administrator',
  'Database Administrator (DBA)',
];

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = ROLES.filter((roleOpt) =>
    roleOpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext === 'pdf' || ext === 'docx') {
      setFile(selectedFile);
    } else {
      toast.error('Unsupported file format. Please upload PDF or DOCX.');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload your resume file first.');
      return;
    }

    if (!role) {
      toast.error('Please select your target job role.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    setIsAnalyzing(true);

    try {
      const { data } = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Resume analyzed successfully!');
      navigate(`/dashboard/analysis/${data._id}`);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Upload & Analyze
        </h1>
        <p className="text-sm text-gray-400">
          Upload your resume and select a target role to receive AI-powered feedback.
        </p>
      </div>

      {/* Main Upload Panel */}
      <div className="glass-panel p-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* File Upload Region */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Resume File (PDF or DOCX)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-purple-500 bg-purple-500/5'
                  : file
                  ? 'border-green-500/40 bg-green-500/5'
                  : 'border-white/10 bg-[#050b14]/30 hover:border-white/20'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.docx"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              {file ? (
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
                    <FiFileText className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                    }}
                    className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400">
                    <FiUploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drag & drop your resume here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">Supports PDF and DOCX up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="space-y-2 relative">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <FiTarget className="h-3.5 w-3.5" />
              Target Job Role
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setSearchQuery('');
                }}
                className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-[#050b14]/70 p-4 text-sm text-white outline-none focus:border-purple-500/50 transition-all cursor-pointer text-left"
              >
                <span className={role ? 'text-white font-medium' : 'text-gray-500'}>
                  {role || 'Choose Target Role'}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Backdrop to close dropdown on click outside */}
              {isOpen && (
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsOpen(false)} 
                />
              )}

              {/* Dropdown Menu Container */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 mt-2 z-50 rounded-xl border border-white/10 bg-[#0d1626]/95 backdrop-blur-md shadow-2xl p-2 max-h-80 overflow-hidden flex flex-col"
                  >
                    {/* Search Input */}
                    <div className="p-2 border-b border-white/5">
                      <input
                        type="text"
                        placeholder="Search roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#050b14]/50 border border-white/10 text-xs text-white p-2.5 rounded-lg outline-none focus:border-purple-500/40"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* Scrollable list */}
                    <div className="overflow-y-auto flex-1 max-h-56 mt-1 space-y-0.5 custom-scrollbar pr-1">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((roleOpt) => {
                          const isSelected = role === roleOpt;
                          return (
                            <button
                              key={roleOpt}
                              type="button"
                              onClick={() => {
                                setRole(roleOpt);
                                setIsOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-xs rounded-lg transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-purple-600/30 text-purple-300 font-semibold'
                                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span>{roleOpt}</span>
                              {isSelected && (
                                <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-xs text-gray-500 text-center py-4">No matching roles found</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all hover:opacity-90 active:scale-95"
          >
            Analyze Resume
          </button>
        </form>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050b14]/90 backdrop-blur-md"
          >
            <div className="space-y-6 text-center max-w-sm px-4">
              {/* Spinner */}
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/10"></div>
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Analyzing Resume...</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Our AI is extracting content, analyzing grammar, parsing metrics, and scanning ATS match. Please wait a few seconds.
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 text-xs text-yellow-300">
                <FiAlertCircle className="h-4 w-4" />
                Processing using Gemini 2.5 Flash
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadResume;
