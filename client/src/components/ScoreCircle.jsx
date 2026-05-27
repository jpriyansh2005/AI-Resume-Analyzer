import { motion } from 'framer-motion';

const ScoreCircle = ({ score = 0, label = '', colorClass = 'from-purple-500 to-indigo-500' }) => {
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* SVG Container */}
        <svg className="h-32 w-32 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke={`url(#gradient-${label})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="stop-purple" stopColor="#9333ea" />
              <stop offset="100%" className="stop-indigo" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Text inside the circle */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">/ 100</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-semibold tracking-wide text-gray-200">{label}</span>
    </div>
  );
};

export default ScoreCircle;
