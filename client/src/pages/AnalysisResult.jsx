import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiBookOpen,
  FiCode,
  FiCornerDownRight,
  FiArrowLeft,
  FiCalendar,
  FiTrendingUp,
  FiDownload,
  FiActivity,
  FiAlertTriangle,
  FiCompass,
  FiTarget,
  FiFileText,
  FiLayers,
  FiCopy,
  FiAward,
  FiEye,
  FiCheck,
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

const AnalysisResult = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verdictExpanded, setVerdictExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [confettiActive, setConfettiActive] = useState(false);
  
  // Signature features states
  const [hoveredHeatmapSection, setHoveredHeatmapSection] = useState(null);
  const [activeOptimizeSection, setActiveOptimizeSection] = useState('summary');
  const [customOptimizedSummary, setCustomOptimizedSummary] = useState('');
  const [customOptimizedSkills, setCustomOptimizedSkills] = useState('');

  // Redesign/UX Improvements states
  const [heatmapExpanded, setHeatmapExpanded] = useState(false);
  const [grammarExpanded, setGrammarExpanded] = useState(false);
  const [strengthsExpanded, setStrengthsExpanded] = useState(false);
  const [concernsExpanded, setConcernsExpanded] = useState(false);
  const [expandedSkillId, setExpandedSkillId] = useState(null);

  // Skill Intelligence mapper for expandable details
  const getSkillIntelligence = (skill) => {
    const name = (skill.name || '').toLowerCase();
    
    let info = {
      impact: skill.priority === 'HIGH' ? 'High' : skill.priority === 'MEDIUM' ? 'Medium' : 'Low',
      time: skill.priority === 'HIGH' ? '2–3 Days' : skill.priority === 'MEDIUM' ? '3–5 Days' : '1 Week',
      difficulty: 'Medium',
      whyItMatters: 'Required by modern industry standards to build scalable and robust applications.',
      wordingExample: `Integrated ${skill.name} to optimize system capabilities and align with engineering best practices.`,
      howToLearn: `Review the official ${skill.name} documentation, build a small standalone prototype, and integrate it into your main project.`,
      resources: `Learn ${skill.name} →`,
      resourceLink: `https://www.google.com/search?q=learn+${encodeURIComponent(skill.name)}`
    };

    if (name.includes('jwt') || name.includes('auth')) {
      info.difficulty = 'Easy';
      info.whyItMatters = 'Critical for secure, stateless communication between frontend and backend in modern APIs.';
      info.wordingExample = 'Designed and implemented secure JWT-based authentication with HttpOnly cookies, securing 15+ backend routes.';
      info.howToLearn = 'Understand stateless tokens, learn the jsonwebtoken package in Node.js, and implement refresh/access token rotation.';
      info.resources = 'Learn JWT Authentication →';
      info.resourceLink = 'https://jwt.io/introduction';
    } else if (name.includes('docker') || name.includes('container')) {
      info.difficulty = 'Medium';
      info.whyItMatters = 'Standardizes development and production environments, eliminating "works on my machine" issues.';
      info.wordingExample = 'Containerized MERN stack applications using Docker, reduction onboarding setup time and simplifying cloud deployment.';
      info.howToLearn = 'Study containerization concepts, write Dockerfiles, configure multi-container setups using Docker Compose.';
      info.resources = 'Learn Docker →';
      info.resourceLink = 'https://docs.docker.com/get-started/';
    } else if (name.includes('testing') || name.includes('jest') || name.includes('cypress')) {
      info.difficulty = 'Hard';
      info.whyItMatters = 'Ensures code reliability, prevents regression bugs, and is a key requirement for professional workflows.';
      info.wordingExample = 'Authored 50+ Jest unit tests and Cypress E2E flows, maintaining 85%+ code coverage and preventing regression errors.';
      info.howToLearn = 'Start with unit tests using Jest, then explore integration testing, and finish with Cypress for end-to-end user flows.';
      info.resources = 'Learn Testing →';
      info.resourceLink = 'https://jestjs.io/docs/getting-started';
    } else if (name.includes('typescript')) {
      info.difficulty = 'Medium';
      info.whyItMatters = 'Provides static type-safety, leading to fewer runtime crashes and self-documenting codebases.';
      info.wordingExample = 'Migrated React components and Express API routes to TypeScript, eliminating runtime type errors and improving developer productivity.';
      info.howToLearn = 'Understand types vs interfaces, set up tsconfig.json, and convert a basic Javascript project to TypeScript.';
      info.resources = 'Learn TypeScript →';
      info.resourceLink = 'https://www.typescriptlang.org/docs/';
    } else if (name.includes('redis') || name.includes('cache')) {
      info.difficulty = 'Medium';
      info.whyItMatters = 'Improves response times and database load by keeping frequently queried datasets in memory.';
      info.wordingExample = 'Configured Redis cache layers for active database queries, reducing average API response latency by 65%.';
      info.howToLearn = 'Understand caching patterns (Cache-Aside), install Redis locally, and use the redis npm client in Express.';
      info.resources = 'Learn Redis Caching →';
      info.resourceLink = 'https://redis.io/docs/latest/develop/';
    } else if (name.includes('aws') || name.includes('cloud') || name.includes('deploy')) {
      info.difficulty = 'Hard';
      info.whyItMatters = 'Shows you can take code from local development and deliver it to production users reliably.';
      info.wordingExample = 'Architected cloud deployment pipeline on AWS using EC2, S3, and Route53, handling 5,000+ monthly requests.';
      info.howToLearn = 'Deploy a simple app to Vercel/Render, then study cloud basics (AWS/GCP), networking, and CI/CD pipelines.';
      info.resources = 'Learn Cloud Deployment →';
      info.resourceLink = 'https://aws.amazon.com/getting-started/';
    }
    
    return info;
  };

  // Keyboard Shortcuts & Report Data Fetching
  useEffect(() => {
    const fetchDetailAndHistory = async () => {
      try {
        const detailRes = await api.get(`/resume/${id}`);
        setReport(detailRes.data);
        setCompletedSteps(detailRes.data.analysis?.completedSteps || []);

        const historyRes = await api.get('/resume/history');
        setHistory(historyRes.data);
      } catch (error) {
        console.error('Fetch detail error:', error);
        toast.error('Failed to load analysis report details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetailAndHistory();

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        window.location.href = '/dashboard/upload';
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id]);

  // Load section-based optimized values once data is resolved
  useEffect(() => {
    if (report) {
      setCustomOptimizedSummary(`Driven developer focused on ${report.role || 'Full Stack'} solutions. Proven track record of optimizing React architectures, designing REST APIs, and implementing security workflows. Quantified achievements include increasing feature performance by 35% and maintaining 95% test coverage.`);
      setCustomOptimizedSkills(`Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3\nFrameworks & Libraries: React, Node.js, Express, Redux Toolkit, Tailwind CSS v4\nDatabases & Storage: MongoDB, Redis, PostgreSQL\nDevOps & Testing: Docker, Vercel, Render, Jest, Cypress, Supertest`);
    }
  }, [report]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-6 w-32 bg-white/5 rounded"></div>
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-10 w-64 bg-white/5 rounded"></div>
          <div className="h-4 w-48 bg-white/5 rounded"></div>
        </div>
        {/* Hero Card Skeleton */}
        <div className="h-64 bg-white/5 rounded-2xl"></div>
        {/* Score Cards Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="h-44 bg-white/5 rounded-2xl"></div>
          <div className="h-44 bg-white/5 rounded-2xl"></div>
          <div className="h-44 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="glass-panel p-8 text-center max-w-md mx-auto space-y-4 my-12">
        <FiXCircle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Report not found</h2>
        <Link to="/dashboard" className="text-sm text-purple-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { overallScore, atsScore, skillMatch, analysis } = report;

  // Safe analysis parser supporting legacy and YC premium formats
  const safeAnalysis = {
    strengthLevel: analysis?.strengthLevel || (overallScore >= 80 ? 'EXCELLENT MATCH ⭐' : overallScore >= 70 ? 'STRONG MATCH ✨' : overallScore >= 60 ? 'GOOD MATCH ⭐' : 'NEEDS WORK ⚠️'),
    verdict: analysis?.verdict || analysis?.summary || 'Your resume demonstrates a good foundation, but project impact and deployment experience need improvement.',
    interviewReadiness: analysis?.interviewReadiness || Math.round((overallScore + atsScore) / 2),
    jobFit: analysis?.jobFit || {
      readyFor: [report.role + ' Intern', 'Junior ' + report.role, 'Associate Developer'],
      needsImprovementFor: ['Lead Software Architect', 'Senior Systems Engineer']
    },
    topPriorityFixes: analysis?.topPriorityFixes || [
      'Quantify project descriptions using key performance indicators (KPIs)',
      'List specific deployment environments and container tools (Docker/AWS)',
      'Increase density of keyword matches related to ' + report.role
    ],
    strengths: Array.isArray(analysis?.strengths) && typeof analysis.strengths[0] === 'object'
      ? analysis.strengths
      : (analysis?.strengths || []).map((str, idx) => ({
          title: idx === 0 ? 'Solid Technical Stack' : idx === 1 ? 'Clear Layout Structure' : 'Relevant Experience',
          description: str
        })),
    weaknesses: Array.isArray(analysis?.weaknesses) && typeof analysis.weaknesses[0] === 'object'
      ? analysis.weaknesses
      : (analysis?.weaknesses || []).map((weak, idx) => ({
          title: idx === 0 ? 'Lacking Quantified Scope' : idx === 1 ? 'DevOps Exposure Absent' : 'Missing testing frameworks',
          description: weak
        })),
    missingSkills: Array.isArray(analysis?.missingSkills) && typeof analysis.missingSkills[0] === 'object'
      ? analysis.missingSkills
      : (analysis?.missingSkills || []).map((skill, idx) => ({
          name: skill,
          priority: idx % 3 === 0 ? 'HIGH' : idx % 3 === 1 ? 'MEDIUM' : 'LOW'
        })),
    projectFeedback: analysis?.projectFeedback || [],
    improvementSuggestions: typeof analysis?.improvementSuggestions === 'object' && !Array.isArray(analysis?.improvementSuggestions)
      ? analysis.improvementSuggestions
      : {
          projectImprovements: (analysis?.improvementSuggestions || []).filter((_, i) => i % 5 === 0),
          skillsImprovements: (analysis?.improvementSuggestions || []).filter((_, i) => i % 5 === 1),
          resumeFormatting: (analysis?.improvementSuggestions || []).filter((_, i) => i % 5 === 2),
          atsOptimization: (analysis?.improvementSuggestions || []).filter((_, i) => i % 5 === 3),
          technicalImprovements: (analysis?.improvementSuggestions || []).filter((_, i) => i % 5 === 4)
        },
    roadmap: analysis?.roadmap || [
      { step: 'STEP 1: Quantify Metrics', description: 'Modify project bullet points to describe performance, scale, or savings with figures.', duration: '1-2 days', difficulty: 'Easy' },
      { step: 'STEP 2: Deploy Active URLs', description: 'Deploy client apps to Vercel/Netlify, API services to Render, and add links.', duration: '2-3 days', difficulty: 'Medium' },
      { step: 'STEP 3: Add Testing coverage', description: 'Implement basic testing using Jest/Cypress and add them under your skills section.', duration: '3-5 days', difficulty: 'Hard' }
    ],
    grammarIssues: Array.isArray(analysis?.grammarIssues) && typeof analysis.grammarIssues[0] === 'object'
      ? analysis.grammarIssues.map(issue => {
          let problemPart = issue.issue || '';
          let recommendationPart = issue.correction || issue.reason || 'Correct spacing or casing.';
          if (typeof problemPart === 'string' && problemPart.includes('Recommendation:')) {
            const parts = problemPart.split('Recommendation:');
            problemPart = parts[0].trim();
            if (problemPart.endsWith('.')) problemPart = problemPart.slice(0, -1).trim();
            recommendationPart = parts[1].trim();
          }
          
          let cleanCorrection = recommendationPart;
          const match = recommendationPart.match(/'([^']+)'/);
          if (match) {
            cleanCorrection = match[1];
          }
          
          return {
            issue: problemPart,
            correction: recommendationPart,
            cleanCorrection,
            reason: issue.reason || 'Identified minor formatting issue.'
          };
        })
      : (analysis?.grammarIssues || []).map(issue => {
          let problemPart = issue;
          let recommendationPart = 'Correct spacing or casing.';
          if (typeof issue === 'string' && issue.includes('Recommendation:')) {
            const parts = issue.split('Recommendation:');
            problemPart = parts[0].trim();
            if (problemPart.endsWith('.')) problemPart = problemPart.slice(0, -1).trim();
            recommendationPart = parts[1].trim();
          } else if (typeof issue === 'string' && issue.includes('->')) {
            const parts = issue.split('->');
            problemPart = parts[0].trim();
            recommendationPart = parts[1].trim();
          }
          
          let cleanCorrection = recommendationPart;
          const match = recommendationPart.match(/'([^']+)'/);
          if (match) {
            cleanCorrection = match[1];
          }
          
          return {
            issue: problemPart,
            correction: recommendationPart,
            cleanCorrection,
            reason: 'Identified minor formatting issue.'
          };
        }),
    summary: analysis?.summary || 'Resume analysis summary completed.',
    heatmap: analysis?.heatmap || null
  };

  // Unique Strengths & Concerns Titles Fix (avoids AI repetitions)
  const dedupedStrengths = safeAnalysis.strengths.map((str, idx) => {
    const titles = ['Strong MERN Foundation', 'Excellent Problem Solving', 'ATS-Friendly Structure', 'Strong Academic Profile', 'Relevant Technical Projects'];
    return {
      title: titles[idx % titles.length],
      description: str.description || str
    };
  });

  const dedupedWeaknesses = safeAnalysis.weaknesses.map((weak, idx) => {
    const titles = ['Weak Project Metrics', 'Missing DevOps Experience', 'No Testing Frameworks', 'Missing Authentication Details', 'Lack of Cloud Exposure'];
    return {
      title: titles[idx % titles.length],
      description: weak.description || weak
    };
  });

  // Chronological history configuration for version tracking
  const chronologicalHistory = [...history].reverse();
  const currentIdx = chronologicalHistory.findIndex(item => item._id === id);
  const scoreImprovement = currentIdx > 0
    ? report.overallScore - chronologicalHistory[0].overallScore
    : 0;

  const versionData = chronologicalHistory.map((item, idx) => ({
    version: `V${idx + 1}`,
    score: item.overallScore,
    date: new Date(item.createdAt).toLocaleDateString(),
    name: item.resumeName,
  }));

  // Toggle step execution & database persistence
  const handleToggleStep = async (stepIdx) => {
    let updated;
    if (completedSteps.includes(stepIdx)) {
      updated = completedSteps.filter(idx => idx !== stepIdx);
    } else {
      updated = [...completedSteps, stepIdx];
    }
    
    // Check if 100% completed to trigger confetti
    if (updated.length === safeAnalysis.roadmap.length) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3000);
      toast.success('Congratulations! You completed all roadmap steps! 🚀');
    }

    setCompletedSteps(updated);

    try {
      await api.put(`/resume/${id}`, {
        analysis: {
          ...report.analysis,
          completedSteps: updated
        }
      });
    } catch (err) {
      console.error('Failed to persist roadmap progress:', err);
    }
  };

  const handleCopyToClipboard = (text, type = 'text') => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${type} to clipboard!`);
  };

  // Get Dynamic Resume Diagnostics Heatmap
  const getDynamicHeatmap = () => {
    if (safeAnalysis.heatmap && Array.isArray(safeAnalysis.heatmap.sections)) {
      return safeAnalysis.heatmap;
    }

    // Recruiter-grade fallback data for legacy records
    const fallbackSections = [
      {
        name: 'Contact & Header',
        exists: true,
        score: 85,
        contribution: 10,
        atsImpact: 'LOW',
        readability: 'High',
        technicalDepth: 'Medium',
        status: 'Strong',
        reasons: 'Optimal sizing, clean structure. Direct links to GitHub and LinkedIn are active and correctly resolved. ATS friendly spacing.',
        issues: ['No personal portfolio website link found'],
        recruiterImpact: 'Recruiter can easily find contact information and code profiles within 2 seconds.',
        oneClickFix: {
          before: 'Priyansh Sharma, Developer',
          after: 'Priyansh Sharma | MERN Stack Developer | github.com/priyansh | priyansh.dev'
        }
      },
      {
        name: 'Professional Summary',
        exists: safeAnalysis.summary ? true : false,
        score: 65,
        contribution: 15,
        atsImpact: 'MEDIUM',
        readability: 'Medium',
        technicalDepth: 'Medium',
        status: 'Average',
        reasons: 'Professional Summary contains generic buzzwords and soft skills instead of technical impact.',
        issues: ['Missing direct target role alignment', 'Contains fluff text like "passionate quick learner"'],
        recruiterImpact: 'Recruiter takes longer to gauge actual experience and target role match.',
        oneClickFix: {
          before: safeAnalysis.summary || 'Aspiring software developer...',
          after: 'Result-driven MERN Stack Developer with hands-on experience building reactive frontends and secure REST APIs. Optimized queries to boost loading speeds.'
        }
      },
      {
        name: 'Technical Skills Matrix',
        exists: true,
        score: 90,
        contribution: 25,
        atsImpact: 'HIGH',
        readability: 'High',
        technicalDepth: 'Strong',
        status: 'Strong',
        reasons: 'Core technologies are structured cleanly. Good density of keywords matching early developer roles.',
        issues: [],
        recruiterImpact: 'Provides instant validation of technical stack match within the initial 6-second scan.',
        oneClickFix: {
          before: 'Skills: React, Node, Express, MongoDB',
          after: 'Frontend: React.js, Redux Toolkit, HTML5, CSS3, Tailwind CSS\nBackend: Node.js, Express.js, JWT, REST APIs\nDatabases: MongoDB, Mongoose\nDevOps: Git, GitHub Actions, Vercel, Render'
        }
      },
      {
        name: 'Projects & Work Experience',
        exists: true,
        score: 55,
        contribution: 35,
        atsImpact: 'HIGH',
        readability: 'Medium',
        technicalDepth: 'Weak',
        status: 'Weak',
        reasons: 'Descriptions are flat. Actions are not backed by quantified business metrics or performance gains.',
        issues: [
          'No deployment URLs found for projects',
          'Missing database scaling metrics',
          'No automated test implementation details'
        ],
        recruiterImpact: 'Weak project explanations raise doubts about true engineering competence and scale handle.',
        oneClickFix: {
          before: safeAnalysis.projectFeedback?.[0]?.before || 'Built a MERN application.',
          after: safeAnalysis.projectFeedback?.[0]?.after || 'Architected a MERN application serving 1k+ users, reducing API query latencies by 35% via aggregation pipeline optimization.'
        }
      },
      {
        name: 'Certifications',
        exists: false,
        contribution: 8,
        atsImpact: 'MEDIUM',
        status: 'Missing',
        reasons: 'No professional certifications or specialized credentials found.',
        issues: ['Missing target role certificates (e.g. AWS Cloud Practitioner or developer credentials)'],
        recruiterImpact: 'Fails to showcase external validation of skill assertions.',
        oneClickFix: {
          before: 'N/A',
          after: 'AWS Certified Cloud Practitioner (2026), freeCodeCamp Back End Development and APIs Certification'
        }
      },
      {
        name: 'Deployment Experience',
        exists: false,
        contribution: 7,
        atsImpact: 'MEDIUM',
        status: 'Missing',
        reasons: 'No cloud deployment details or server hosting platforms mentioned.',
        issues: ['Lacks mentions of Render, Vercel, Netlify, or Docker containerization'],
        recruiterImpact: 'Recruiters are unsure if developer can ship production-ready build artifacts to live environments.',
        oneClickFix: {
          before: 'N/A',
          after: 'Deployed web application backends on Dockerized Render containers, implementing automated CI/CD pipelines via GitHub Actions.'
        }
      }
    ];

    return {
      confidenceMeter: 91,
      biggestBottleneck: {
        sectionName: 'Projects & Work Experience',
        improvementImpact: 'Improving this section could increase ATS score by +14 points.'
      },
      sections: fallbackSections
    };
  };

  return (
    <div className="space-y-10 pb-16 print-container relative">
      
      {/* Confetti Animation Effect */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 35 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 1.5;
            const size = Math.random() * 8 + 6;
            const colors = ['bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-green-500', 'bg-yellow-500'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className={`absolute ${color} animate-confetti rounded-sm`}
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `-20px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${Math.random() * 1.5 + 2}s`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Sticky Report Navigation Bar */}
      <div className="sticky-report-nav px-6 py-3 -mx-6 md:-mx-8 flex items-center justify-between no-print border-b border-white/5 mb-6">
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full text-xs font-bold text-gray-400">
          <a href="#overview" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Overview</a>
          <a href="#scores" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Scores</a>
          <a href="#insights" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Insights</a>
          <a href="#strengths" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Strengths</a>
          <a href="#skills" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Skills</a>
          <a href="#heatmap" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Heatmap</a>
          <a href="#projects" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Projects</a>
          <a href="#roadmap" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Roadmap</a>
          <a href="#readiness" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Readiness</a>
          <a href="#optimize" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Optimizer</a>
          <a href="#grammar" className="px-3 py-1.5 hover:text-white hover:bg-white/5 rounded-lg transition">Grammar</a>
        </div>
      </div>

      {/* Resume Header */}
      <div id="overview" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 no-print">
        <div className="space-y-1">
          <Link
            to="/dashboard/history"
            className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            Back to History
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            ATS Pro Recruiter Panel
          </h1>
          <p className="text-sm text-gray-400">
            File: <span className="text-white font-semibold">{report.resumeName}</span> &middot; Target:{' '}
            <span className="text-purple-400 font-semibold">{report.role}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <FiCalendar className="h-3.5 w-3.5" />
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => window.print()}
            className="btn-action inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 shadow-md"
          >
            <FiDownload className="h-4 w-4" />
            Download AI Report
          </button>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print-only space-y-4 border-b pb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">ATS Pro - Resume Analysis</h1>
        <p className="text-sm text-gray-600">
          Target Role: <strong className="text-purple-700">{report.role}</strong> &middot; Resume File: <strong>{report.resumeName}</strong>
        </p>
        <p className="text-xs text-gray-400">Date Generated: {new Date(report.createdAt).toLocaleDateString()}</p>
      </div>

      {/* 1. HERO SECTION: Resume Verdict Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 relative overflow-hidden border border-purple-500/10 shadow-2xl shadow-purple-500/5 group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 via-indigo-600/5 to-transparent pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid gap-8 md:grid-cols-3 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* TOP BADGE */}
              <span className="text-[10px] font-extrabold tracking-widest uppercase bg-purple-600/20 border border-purple-500/35 text-purple-300 px-3 py-1 rounded-full animate-shimmer">
                {safeAnalysis.strengthLevel}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified by AI Recruiter</span>
            </div>

            {/* MAIN VERDICT: Truncated to 3 lines (approx. 200 chars) with Read Full toggle */}
            <div className="relative">
              <motion.p 
                layout
                className="text-xs text-gray-300 leading-relaxed transition-all duration-300"
              >
                &ldquo;{verdictExpanded ? safeAnalysis.verdict : `${safeAnalysis.verdict.slice(0, 200)}...`}&rdquo;
              </motion.p>
              <button
                onClick={() => setVerdictExpanded(!verdictExpanded)}
                className="mt-2 inline-flex items-center gap-1 bg-purple-500/10 hover:bg-purple-500/25 px-2.5 py-1 rounded text-xs font-bold text-purple-300 transition cursor-pointer"
              >
                {verdictExpanded ? 'Collapse Analysis' : '[ Read Full AI Analysis ]'}
                <FiChevronDown className={`h-3.5 w-3.5 transform transition-transform duration-300 ${verdictExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* TOP 3 FIXES */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                Top Priority Improvements
              </span>
              <ul className="space-y-2 text-xs text-gray-300">
                {safeAnalysis.topPriorityFixes.slice(0, 3).map((fix, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Job Fit categorization */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 self-stretch flex flex-col justify-start">
            <h3 className="text-[10px] font-extrabold text-white tracking-widest uppercase border-b border-white/5 pb-2">
              Role Recommendation Match
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-green-400 tracking-wider block uppercase mb-1.5">
                  Interview Ready For:
                </span>
                <div className="space-y-1.5">
                  {safeAnalysis.jobFit.readyFor.slice(0, 2).map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                      <FiCheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-white/5">
                <span className="text-[10px] font-extrabold text-red-400 tracking-wider block uppercase mb-1.5">
                  Needs Improvement For:
                </span>
                <div className="space-y-1.5">
                  {safeAnalysis.jobFit.needsImprovementFor.slice(0, 1).map((r, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300">
                      <FiXCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. SCORE DASHBOARD */}
      <div id="scores" className="grid gap-6 sm:grid-cols-3">
        {/* Overall Score */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className={`glass-panel p-6 flex flex-col items-center text-center shadow-lg border transition-all duration-300 ${
            overallScore >= 80 ? 'shadow-green-500/5 border-green-500/20' :
            overallScore >= 60 ? 'shadow-amber-500/5 border-amber-500/20' :
            'shadow-red-500/5 border-red-500/20'
          }`}
        >
          <div className="relative flex items-center justify-center h-28 w-28">
            <svg className="h-full w-full transform -rotate-90">
              <circle cx="56" cy="56" r="45" fill="transparent" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" />
              <motion.circle
                cx="56"
                cy="56"
                r="45"
                fill="transparent"
                stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 - (overallScore / 100) * 2 * Math.PI * 45 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{overallScore}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
            </div>
          </div>
          <h3 className="mt-4 text-sm font-bold text-white tracking-wide">Overall Score</h3>
          <span className={`mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            overallScore >= 80 ? 'bg-green-500/10 border-green-500/20 text-green-400' :
            overallScore >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {overallScore >= 80 ? 'Excellent Resume' : overallScore >= 60 ? 'Needs Tweaks' : 'Critical Issues'}
          </span>
          <p className="text-[11px] text-purple-300 mt-3 font-medium tracking-wide">
            "Better than 85% of {report.role || 'MERN'} applicants"
          </p>
        </motion.div>

        {/* ATS Score */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className={`glass-panel p-6 flex flex-col items-center text-center shadow-lg border transition-all duration-300 ${
            atsScore >= 80 ? 'shadow-purple-500/5 border-purple-500/20' :
            atsScore >= 60 ? 'shadow-amber-500/5 border-amber-500/20' :
            'shadow-red-500/5 border-red-500/20'
          }`}
        >
          <div className="relative flex items-center justify-center h-28 w-28">
            <svg className="h-full w-full transform -rotate-90">
              <circle cx="56" cy="56" r="45" fill="transparent" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" />
              <motion.circle
                cx="56"
                cy="56"
                r="45"
                fill="transparent"
                stroke={atsScore >= 80 ? '#9333ea' : atsScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 - (atsScore / 100) * 2 * Math.PI * 45 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{atsScore}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
            </div>
          </div>
          <h3 className="mt-4 text-sm font-bold text-white tracking-wide">ATS Compatibility</h3>
          <span className={`mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            atsScore >= 80 ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
            atsScore >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {atsScore >= 80 ? 'ATS Friendly' : atsScore >= 60 ? 'Semi-Compliant' : 'Unfriendly Format'}
          </span>
          <p className="text-[11px] text-purple-300 mt-3 font-medium tracking-wide">
            "Likely to pass ATS screening"
          </p>
        </motion.div>

        {/* Skill Match */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className={`glass-panel p-6 flex flex-col items-center text-center shadow-lg border transition-all duration-300 ${
            skillMatch >= 80 ? 'shadow-indigo-500/5 border-indigo-500/20' :
            skillMatch >= 60 ? 'shadow-amber-500/5 border-amber-500/20' :
            'shadow-red-500/5 border-red-500/20'
          }`}
        >
          <div className="relative flex items-center justify-center h-28 w-28">
            <svg className="h-full w-full transform -rotate-90">
              <circle cx="56" cy="56" r="45" fill="transparent" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" />
              <motion.circle
                cx="56"
                cy="56"
                r="45"
                fill="transparent"
                stroke={skillMatch >= 80 ? '#6366f1' : skillMatch >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 - (skillMatch / 100) * 2 * Math.PI * 45 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white leading-none tracking-tight">{skillMatch}</span>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
            </div>
          </div>
          <h3 className="mt-4 text-sm font-bold text-white tracking-wide">Skill Matching</h3>
          <span className={`mt-2 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            skillMatch >= 80 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
            skillMatch >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {skillMatch >= 80 ? 'Strong Match' : skillMatch >= 60 ? 'Moderate Match' : 'Skill Gaps Found'}
          </span>
          <p className="text-[11px] text-purple-300 mt-3 font-medium tracking-wide">
            "Strong alignment for internship roles"
          </p>
        </motion.div>
      </div>

      {/* 3. QUICK EXECUTIVE INSIGHTS */}
      <div id="insights" className="glass-panel p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <FiCompass className="h-5 w-5 text-purple-400" />
          Quick Executive Insights
        </h2>

        {/* 4 Insight Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-1 hover:border-purple-500/15 transition duration-300">
            <span className="text-[9px] font-extrabold text-purple-400 uppercase tracking-widest block">
              💼 Best Fit Role
            </span>
            <p className="text-sm font-bold text-white">{report.role}</p>
            <p className="text-[10px] text-gray-500 font-medium">MERN Developer</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-1 hover:border-green-500/15 transition duration-300">
            <span className="text-[9px] font-extrabold text-green-400 uppercase tracking-widest block">
              🚀 Biggest Strength
            </span>
            <p className="text-sm font-bold text-white truncate">
              {safeAnalysis.strengths[0]?.title || 'Core Stack foundation'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Strong Technical Stack</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-1 hover:border-red-500/15 transition duration-300">
            <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest block">
              ⚠ Biggest Weakness
            </span>
            <p className="text-sm font-bold text-white truncate">
              {safeAnalysis.weaknesses[0]?.title || 'Metrics quantification'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Missing Quantified Metrics</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-between space-y-1 hover:border-indigo-500/15 transition duration-300">
            <span className="text-[9px] font-extrabold text-indigo-400 uppercase tracking-widest block">
              🎯 Recommended Focus
            </span>
            <p className="text-sm font-bold text-white">
              {safeAnalysis.roadmap[0]?.step.replace(/^STEP \d+:\s*/i, '') || 'Deployment + Testing'}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Deployment + Testing</p>
          </div>
        </div>
      </div>

      {/* 4. STRENGTHS & AREAS OF CONCERN */}
      <div id="strengths" className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <div className="glass-panel p-6 space-y-4 border-t-2 border-t-green-500">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiCheckCircle className="h-5 w-5 text-green-400" />
            Top Strengths
          </h2>
          <div className="space-y-3">
            {dedupedStrengths.length > 0 ? (
              (strengthsExpanded ? dedupedStrengths : dedupedStrengths.slice(0, 3)).map((str, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 border-l-4 border-l-green-500 rounded-lg hover:bg-white/5 transition-all"
                >
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                    ✓ {str.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {str.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No major strengths highlighted.</p>
            )}
          </div>
          {dedupedStrengths.length > 3 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStrengthsExpanded(!strengthsExpanded)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
              >
                {strengthsExpanded ? 'View Less' : '[ View More ]'}
              </button>
            </div>
          )}
        </div>

        {/* Concerns */}
        <div className="glass-panel p-6 space-y-4 border-t-2 border-t-red-500">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiAlertTriangle className="h-5 w-5 text-red-400" />
            Top Concerns
          </h2>
          <div className="space-y-3">
            {dedupedWeaknesses.length > 0 ? (
              (concernsExpanded ? dedupedWeaknesses : dedupedWeaknesses.slice(0, 3)).map((weak, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 border-l-4 border-l-red-500 rounded-lg hover:bg-white/5 transition-all"
                >
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                    ⚠ {weak.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {weak.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No major concerns highlighted.</p>
            )}
          </div>
          {dedupedWeaknesses.length > 3 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setConcernsExpanded(!concernsExpanded)}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 transition cursor-pointer"
              >
                {concernsExpanded ? 'View Less' : '[ View More ]'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. MISSING SKILLS & PRIORITY GUIDE */}
      {safeAnalysis.missingSkills.length > 0 && (
        <div id="skills" className="glass-panel p-6 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FiCode className="h-5 w-5 text-indigo-400" />
                Missing Skills & Priority Guide
              </h2>
              <p className="text-xs text-gray-400 mt-1">Click on any skill card to expand action guides, wording examples, and learning paths.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* HIGH PRIORITY */}
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 space-y-3">
              <span className="text-[9px] font-extrabold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded tracking-widest uppercase">
                HIGH PRIORITY
              </span>
              <div className="space-y-3 pt-1">
                {safeAnalysis.missingSkills.filter(s => s.priority === 'HIGH').map((skill, idx) => {
                  const skillIntelligence = getSkillIntelligence(skill);
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedSkillId(expandedSkillId === skill.name ? null : skill.name)}
                      className={`flex flex-col space-y-2 bg-[#0d1626]/80 p-3 rounded-xl border transition cursor-pointer relative hover:border-purple-500/30 ${
                        expandedSkillId === skill.name ? 'border-purple-500/40 bg-purple-950/10 shadow-lg' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{skill.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 text-[9px] text-gray-400 border-t border-white/5 pt-2">
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Impact</span>
                          <span className="font-bold text-white">{skillIntelligence.impact}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Time</span>
                          <span className="font-bold text-white">{skillIntelligence.time}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Difficulty</span>
                          <span className="font-bold text-white">{skillIntelligence.difficulty}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSkillId === skill.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden space-y-3 pt-3 border-t border-white/5 mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Why it matters</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed">{skillIntelligence.whyItMatters}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Resume wording example</span>
                              <p className="text-[10px] text-white bg-green-950/15 p-2 rounded border border-green-500/10 leading-relaxed italic">
                                &ldquo;{skillIntelligence.wordingExample}&rdquo;
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">How to learn</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed">{skillIntelligence.howToLearn}</p>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-[10px]">
                              <a
                                href={skillIntelligence.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                              >
                                {skillIntelligence.resources}
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MEDIUM PRIORITY */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 space-y-3">
              <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded tracking-widest uppercase">
                MEDIUM PRIORITY
              </span>
              <div className="space-y-3 pt-1">
                {safeAnalysis.missingSkills.filter(s => s.priority === 'MEDIUM').map((skill, idx) => {
                  const skillIntelligence = getSkillIntelligence(skill);
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedSkillId(expandedSkillId === skill.name ? null : skill.name)}
                      className={`flex flex-col space-y-2 bg-[#0d1626]/80 p-3 rounded-xl border transition cursor-pointer relative hover:border-purple-500/30 ${
                        expandedSkillId === skill.name ? 'border-purple-500/40 bg-purple-950/10 shadow-lg' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{skill.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 text-[9px] text-gray-400 border-t border-white/5 pt-2">
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Impact</span>
                          <span className="font-bold text-white">{skillIntelligence.impact}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Time</span>
                          <span className="font-bold text-white">{skillIntelligence.time}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Difficulty</span>
                          <span className="font-bold text-white">{skillIntelligence.difficulty}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSkillId === skill.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden space-y-3 pt-3 border-t border-white/5 mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Why it matters</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed">{skillIntelligence.whyItMatters}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Resume wording example</span>
                              <p className="text-[10px] text-white bg-green-950/15 p-2 rounded border border-green-500/10 leading-relaxed italic">
                                &ldquo;{skillIntelligence.wordingExample}&rdquo;
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">How to learn</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed">{skillIntelligence.howToLearn}</p>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-[10px]">
                              <a
                                href={skillIntelligence.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                              >
                                {skillIntelligence.resources}
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LOW PRIORITY */}
            <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 space-y-3">
              <span className="text-[9px] font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded tracking-widest uppercase">
                LOW PRIORITY
              </span>
              <div className="space-y-3 pt-1">
                {safeAnalysis.missingSkills.filter(s => s.priority === 'LOW').map((skill, idx) => {
                  const skillIntelligence = getSkillIntelligence(skill);
                  return (
                    <div
                      key={idx}
                      onClick={() => setExpandedSkillId(expandedSkillId === skill.name ? null : skill.name)}
                      className={`flex flex-col space-y-2 bg-[#0d1626]/80 p-3 rounded-xl border transition cursor-pointer relative hover:border-purple-500/30 ${
                        expandedSkillId === skill.name ? 'border-purple-500/40 bg-purple-950/10 shadow-lg' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">{skill.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 text-[9px] text-gray-400 border-t border-white/5 pt-2">
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Impact</span>
                          <span className="font-bold text-white">{skillIntelligence.impact}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Time</span>
                          <span className="font-bold text-white">{skillIntelligence.time}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-gray-500 uppercase">Difficulty</span>
                          <span className="font-bold text-white">{skillIntelligence.difficulty}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSkillId === skill.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden space-y-3 pt-3 border-t border-white/5 mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Why it matters</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed">{skillIntelligence.whyItMatters}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">Resume wording example</span>
                              <p className="text-[10px] text-white bg-green-950/15 p-2 rounded border border-green-500/10 leading-relaxed italic">
                                &ldquo;{skillIntelligence.wordingExample}&rdquo;
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">How to learn</span>
                              <p className="text-[10px] text-gray-300 leading-relaxed">{skillIntelligence.howToLearn}</p>
                            </div>
                            <div className="pt-1 flex items-center justify-between text-[10px]">
                              <a
                                href={skillIntelligence.resourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                              >
                                {skillIntelligence.resources}
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Merged Skills Improvements Recommendations */}
          {safeAnalysis.improvementSuggestions?.skillsImprovements?.length > 0 && (
            <div className="mt-4 bg-purple-600/5 border border-purple-500/10 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-extrabold text-purple-300 tracking-wider uppercase flex items-center gap-1.5">
                <FiAward className="h-4 w-4" />
                AI Skill Suggestions & Upgrades
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {safeAnalysis.improvementSuggestions.skillsImprovements.map((s, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-3 rounded-lg text-xs text-gray-300 flex items-start gap-2">
                    <span className="text-purple-400 font-bold shrink-0">✓</span>
                    <div>
                      <span>{s}</span>
                      <p className="text-[10px] text-gray-400 mt-1 italic">
                        Tip: Include this skill in your skills matrix and reference it in your projects.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-indigo-600/5 border border-indigo-500/25 p-3 rounded-xl flex items-center justify-between text-xs text-indigo-300">
            <span>✨ Profile Completeness Roadmap:</span>
            <span className="font-bold">
              {report.overallScore >= 80 ? 'You are ready for technical screens!' : report.overallScore >= 60 ? 'Approximately 2–3 weeks away from becoming interview-ready' : '4–6 weeks away from being interview ready'}
            </span>
          </div>
        </div>
      )}

      {/* 6. RESUME DIAGNOSTIC HEATMAP */}
      {(() => {
        const heatmapData = getDynamicHeatmap();
        const activeSectionName = hoveredHeatmapSection || (heatmapData.sections[0] ? heatmapData.sections[0].name : 'Contact & Header');
        const selectedSection = heatmapData.sections.find(s => s.name === activeSectionName) || heatmapData.sections[0] || {};
        return (
          <div id="heatmap" className="glass-panel p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiLayers className="h-5 w-5 text-purple-400" />
                  Resume Diagnostic Heatmap
                </h2>
              </div>
              <button
                onClick={() => setHeatmapExpanded(!heatmapExpanded)}
                className="btn-action inline-flex items-center gap-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 px-4 py-2 text-xs font-bold text-purple-300 transition-all cursor-pointer no-print mt-2 sm:mt-0"
              >
                {heatmapExpanded ? 'Collapse Heatmap' : 'View Resume Diagnostic Heatmap'}
                <FiChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${heatmapExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {heatmapExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden pt-4"
                >
                  <div className="grid gap-6 md:grid-cols-5 items-stretch">
                    {/* Simulated Resume Sheet Mock */}
                    <div className="md:col-span-2 bg-[#050b14]/50 border border-white/10 rounded-xl p-5 flex flex-col gap-3 min-h-[400px] relative select-none">
                      <div className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Resume Layout Order</span>
                        <span className="text-[9px] text-purple-400 font-mono">AI Confidence: {heatmapData.confidenceMeter}%</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col gap-2.5">
                        {heatmapData.sections.map((section, idx) => {
                          const isSelected = activeSectionName === section.name;
                          
                          if (!section.exists) {
                            return (
                              <div
                                key={idx}
                                onMouseEnter={() => setHoveredHeatmapSection(section.name)}
                                onClick={() => setHoveredHeatmapSection(section.name)}
                                className={`rounded-lg p-3 border-2 border-dashed transition-all duration-300 cursor-pointer relative ${
                                  isSelected
                                    ? 'border-purple-500 bg-purple-950/10 shadow-lg scale-102'
                                    : 'border-white/5 bg-transparent opacity-60 hover:opacity-100'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-gray-400">⚪ Missing: {section.name}</span>
                                  <span className="text-[9px] text-gray-600 font-mono">{section.contribution}% weight</span>
                                </div>
                              </div>
                            );
                          }

                          const colorClasses = 
                            section.status === 'Strong'
                              ? isSelected ? 'bg-green-500/20 border-green-500 text-green-300 shadow-md shadow-green-500/5 scale-102 font-bold' : 'bg-green-500/5 border-green-500/20 text-green-400/80 hover:border-green-500/50'
                              : section.status === 'Average'
                                ? isSelected ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-md shadow-yellow-500/5 scale-102 font-bold' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-400/80 hover:border-yellow-500/50'
                                : isSelected ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md shadow-red-500/5 scale-102 font-bold' : 'bg-red-500/5 border-red-500/20 text-red-400/80 hover:border-red-500/50';

                          const dotColor = 
                            section.status === 'Strong' ? 'bg-green-500' :
                            section.status === 'Average' ? 'bg-yellow-500' : 'bg-red-500';

                          return (
                            <div
                              key={idx}
                              onMouseEnter={() => setHoveredHeatmapSection(section.name)}
                              onClick={() => setHoveredHeatmapSection(section.name)}
                              className={`rounded-lg p-3 border transition-all duration-300 cursor-pointer relative ${colorClasses}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                                  <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`}></span>
                                  {section.name}
                                </span>
                                <span className="text-[9px] font-mono opacity-80">{section.contribution}% weight</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feedback side panel */}
                    <div className="md:col-span-3 bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-4">
                        {/* Bottleneck Alert */}
                        {selectedSection.name === heatmapData.biggestBottleneck?.sectionName && (
                          <div className="bg-red-950/20 border border-red-500/25 p-3 rounded-lg flex items-start gap-2 text-xs">
                            <span className="text-base">🚨</span>
                            <div>
                              <h4 className="font-extrabold text-red-400 uppercase tracking-wider text-[9px] mb-0.5">Biggest Resume Bottleneck</h4>
                              <p className="text-[11px] text-white">
                                {heatmapData.biggestBottleneck.improvementImpact}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Selected Section Header */}
                        <div className="border-b border-white/5 pb-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                              {selectedSection.name}
                            </h3>
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
                              selectedSection.status === 'Strong' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              selectedSection.status === 'Average' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                              selectedSection.status === 'Weak' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                              'bg-gray-500/10 border-white/10 text-gray-400'
                            }`}>
                              {selectedSection.status === 'Missing' ? 'Missing Recommended' : selectedSection.status}
                            </span>
                          </div>
                        </div>

                        {/* Dynamic Metrics Row */}
                        {selectedSection.exists ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#050b14]/30 p-3 rounded-lg border border-white/5 text-[10px]">
                            <div>
                              <span className="text-gray-500 block uppercase font-mono text-[8px]">Strength</span>
                              <span className="font-extrabold text-white">{selectedSection.score}/100</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block uppercase font-mono text-[8px]">ATS Impact</span>
                              <span className={`font-extrabold uppercase ${
                                selectedSection.atsImpact === 'HIGH' ? 'text-red-400' :
                                selectedSection.atsImpact === 'MEDIUM' ? 'text-amber-400' : 'text-green-400'
                              }`}>{selectedSection.atsImpact}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block uppercase font-mono text-[8px]">Readability</span>
                              <span className="font-extrabold text-white">{selectedSection.readability}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block uppercase font-mono text-[8px]">Tech Depth</span>
                              <span className="font-extrabold text-white">{selectedSection.technicalDepth || 'N/A'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-white/2 rounded-lg border border-dashed border-white/5 text-center text-xs text-gray-400 leading-relaxed">
                            ⚠️ Section missing from resume. Adding this section contributes <span className="font-bold text-white">{selectedSection.contribution}%</span> weight to the candidate evaluation score.
                          </div>
                        )}

                        {/* AI Reasons & Details */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-400 block">AI Evaluation</span>
                            <p className="text-xs text-gray-300 leading-relaxed">{selectedSection.reasons}</p>
                          </div>

                          {/* Issues list */}
                          {selectedSection.issues && selectedSection.issues.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-400 block">Issues Detected</span>
                              <ul className="space-y-1 text-xs text-gray-400 list-disc pl-4 leading-relaxed">
                                {selectedSection.issues.map((issue, i) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recruiter Impact */}
                          <div className="space-y-1 pt-1">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-400 block">Recruiter Attention Impact</span>
                            <p className="text-xs text-gray-400 leading-relaxed italic">&ldquo;{selectedSection.recruiterImpact}&rdquo;</p>
                          </div>
                        </div>

                        {/* Wording Fix Box */}
                        {selectedSection.oneClickFix && (
                          <div className="bg-[#050b14]/50 border border-white/5 rounded-lg p-3 space-y-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-400">One-Click Wording Suggestion</span>
                              <span className="text-[8px] bg-purple-600/20 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono">Suggested Refactoring</span>
                            </div>
                            
                            <div className="grid gap-2 sm:grid-cols-2 text-[10px]">
                              {selectedSection.exists && (
                                <div className="p-2 bg-red-950/10 border border-red-500/10 rounded">
                                  <span className="text-[8px] font-bold text-red-400 block uppercase mb-1">Before:</span>
                                  <span className="text-gray-400 italic font-mono leading-relaxed truncate block">&ldquo;{selectedSection.oneClickFix.before}&rdquo;</span>
                                </div>
                              )}
                              <div className={`p-2 bg-green-950/15 border border-green-500/15 rounded ${!selectedSection.exists ? 'col-span-2' : ''}`}>
                                <span className="text-[8px] font-bold text-green-400 block uppercase mb-1">After:</span>
                                <span className="text-white font-medium font-mono leading-relaxed block">&ldquo;{selectedSection.oneClickFix.after}&rdquo;</span>
                              </div>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleCopyToClipboard(selectedSection.oneClickFix.after, 'Wording suggestion')}
                                className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition cursor-pointer"
                              >
                                Copy Suggested Wording
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-gray-500 font-bold tracking-wider pt-3 border-t border-white/5 mt-4 flex items-center justify-between">
                        <span>💡 Hover or Click left sections to inspect details.</span>
                        <span className="text-purple-400">Recruiter Grade Diagnostic</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })()}

      {/* 7. PROJECT DESCRIPTION OPTIMIZATION */}
      {safeAnalysis.projectFeedback.length > 0 && (
        <div id="projects" className="glass-panel p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
            <FiTarget className="h-5 w-5 text-pink-400" />
            Project Description Optimizations
          </h2>
          <div className="space-y-6">
            {safeAnalysis.projectFeedback.slice(0, 3).map((feedback, idx) => (
              <div
                key={idx}
                className="border border-white/5 bg-[#0d1626]/40 rounded-xl p-5 flex flex-col space-y-4 hover:border-purple-500/15 transition-all duration-300"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1 bg-red-950/15 border border-red-500/10 p-4 rounded-lg">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                      Before
                    </span>
                    <p className="text-xs text-gray-400 mt-2 italic leading-relaxed">&ldquo;{feedback.before}&rdquo;</p>
                  </div>
                  <div className="space-y-1 bg-green-950/10 border border-green-500/10 p-4 rounded-lg">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                      Improved Version
                    </span>
                    <p className="text-xs text-white font-medium mt-2 leading-relaxed flex items-start gap-1">
                      <FiCornerDownRight className="h-3.5 w-3.5 mt-0.5 text-green-400 shrink-0" />
                      {feedback.after}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-lg">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Why This is Better:
                  </span>
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 text-[10px] text-gray-300">
                    <div className="flex items-center gap-1.5">
                      <FiCheck className="text-green-400 h-3.5 w-3.5" /> ✓ Stronger action verbs
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCheck className="text-green-400 h-3.5 w-3.5" /> ✓ Better ATS keywords
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCheck className="text-green-400 h-3.5 w-3.5" /> ✓ Quantified impact
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCheck className="text-green-400 h-3.5 w-3.5" /> ✓ Recruiter friendly
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end no-print text-[10px] font-bold">
                  <button
                    onClick={() => handleCopyToClipboard(feedback.after, 'optimized description')}
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-600/20 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-all cursor-pointer"
                  >
                    <FiCopy className="h-3 w-3" />
                    Copy Improved Version
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. RESUME IMPROVEMENT ROADMAP & 9. INTERVIEW READINESS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Roadmap Left Side */}
        <div id="roadmap" className="glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiActivity className="h-5 w-5 text-indigo-400" />
              Resume Improvement Roadmap
            </h2>
          </div>
          <div className="space-y-1">
            {safeAnalysis.roadmap.slice(0, 3).map((item, index) => {
              const isDone = completedSteps.includes(index);
              return (
                <div key={index} className="flex gap-4 relative">
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={() => handleToggleStep(index)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold border transition-all duration-300 cursor-pointer ${
                        isDone
                          ? 'bg-green-500 border-green-400 text-white shadow-md shadow-green-500/20'
                          : 'bg-[#0d1626] border-white/10 text-gray-400 hover:border-purple-500/40 hover:text-purple-300'
                      }`}
                    >
                      {isDone ? '✓' : index + 1}
                    </button>
                    {index < 2 && (
                      <div className={`w-[1.5px] flex-grow my-1 transition-colors duration-300 ${
                        isDone && completedSteps.includes(index + 1)
                          ? 'bg-green-500'
                          : 'bg-gradient-to-b from-purple-500/30 to-transparent'
                      }`}></div>
                    )}
                  </div>
                  <div className={`glass-card flex-grow p-4 mb-4 transition border ${
                    isDone ? 'border-green-500/20 opacity-70 bg-green-500/5' : ''
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <h4 className={`font-bold text-xs ${isDone ? 'line-through text-gray-400' : 'text-white'}`}>
                        {item.step}
                      </h4>
                      <div className="flex gap-1.5 text-[8px] font-bold">
                        <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                          ⏱ {item.duration}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded border ${
                          item.difficulty === 'Easy' ? 'bg-green-500/10 border-green-500/20 text-green-300' :
                          item.difficulty === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                          'bg-red-500/10 border-red-500/20 text-red-300'
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Merged Formatting, ATS, and Technical Improvements */}
          {((safeAnalysis.improvementSuggestions?.resumeFormatting?.length > 0) || 
            (safeAnalysis.improvementSuggestions?.atsOptimization?.length > 0) ||
            (safeAnalysis.improvementSuggestions?.technicalImprovements?.length > 0)) && (
            <div className="mt-4 bg-indigo-950/15 border border-indigo-500/10 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-extrabold text-indigo-300 tracking-wider uppercase flex items-center gap-1.5">
                <FiCompass className="h-4 w-4" />
                ATS Tuning & Formatting Guidelines
              </h3>
              <div className="space-y-2">
                {[
                  ...(safeAnalysis.improvementSuggestions?.resumeFormatting || []).slice(0, 1),
                  ...(safeAnalysis.improvementSuggestions?.atsOptimization || []).slice(0, 1),
                  ...(safeAnalysis.improvementSuggestions?.technicalImprovements || []).slice(0, 1),
                ].map((tip, idx) => (
                  <div key={idx} className="text-xs text-gray-400 flex items-start gap-2 bg-white/2 p-2 rounded border border-white/5">
                    <span className="text-indigo-400 shrink-0 font-bold">✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Readiness Meter & Growth Journey Right Side */}
        <div id="readiness" className="space-y-6">
          {/* Interview Readiness Meter */}
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <FiTarget className="h-5 w-5 text-indigo-400" />
              Interview Readiness Meter
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-extrabold text-purple-400 shrink-0">
                {safeAnalysis.interviewReadiness}%
              </div>
              <div className="flex-grow space-y-1">
                <span className="text-[10px] font-extrabold text-green-400 tracking-wider block uppercase mb-1">
                  {safeAnalysis.interviewReadiness >= 80 ? 'HIGH INTERVIEW POTENTIAL' : 'MODERATE INTERVIEW POTENTIAL'}
                </span>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${safeAnalysis.interviewReadiness}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Technical Skills</span>
                <span className="text-xs font-extrabold text-green-400">Strong</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">ATS Readiness</span>
                <span className="text-xs font-extrabold text-green-400">Excellent</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Recruiter Appeal</span>
                <span className="text-xs font-extrabold text-green-400">Moderate</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-1">Portfolio Strength</span>
                <span className="text-xs font-extrabold text-green-400">Strong</span>
              </div>
            </div>
          </div>

          {/* Resume Growth Journey */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FiTrendingUp className="h-4 w-4 text-purple-400" />
                Resume Growth Journey
              </h2>
              {scoreImprovement > 0 && (
                <span className="text-[10px] font-extrabold bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded">
                  +{scoreImprovement} Points
                </span>
              )}
            </div>
            <div className="h-[150px] w-full relative">
              {versionData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={versionData} margin={{ top: 5, right: 15, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="version" stroke="#6b7280" fontSize={10} />
                    <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d1626',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#a855f7"
                      strokeWidth={3}
                      activeDot={{ r: 5 }}
                      name="Overall Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col justify-between">
                  <div className="h-4/5 flex items-center justify-center border border-dashed border-white/10 rounded-xl relative overflow-hidden bg-white/2">
                    <svg className="w-full h-full opacity-20 absolute inset-0">
                      <path d="M 0 100 Q 150 40 300 110 T 600 50" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
                      <circle cx="150" cy="80" r="3" fill="#a855f7" />
                      <circle cx="400" cy="55" r="3" fill="#a855f7" />
                    </svg>
                    <div className="z-10 text-center px-4 space-y-1">
                      <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Growth Tracker Locked</p>
                      <p className="text-[9px] text-gray-500 max-w-[200px] leading-relaxed mx-auto">
                        Upload another resume version to track and visualize score improvements.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-500 leading-snug font-medium pt-2">
              {scoreImprovement > 0
                ? `Your resume improved by ${scoreImprovement} points since your first upload!`
                : 'Upload improved versions to visually graph and track your resume optimization journey.'}
            </p>
          </div>
        </div>
      </div>

      {/* 10. AI RESUME OPTIMIZER */}
      <div id="optimize" className="glass-panel p-6 space-y-6">
        <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1 rounded-full mb-2 inline-block">
              INTELLIGENT EDITING
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiAward className="h-5 w-5 text-purple-400" />
              AI Resume Optimizer
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4 items-stretch">
          <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-white/5 pr-0 md:pr-4">
            <button
              onClick={() => setActiveOptimizeSection('summary')}
              className={`px-3 py-2 text-left text-xs font-bold rounded-xl transition ${
                activeOptimizeSection === 'summary' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📝 Resume Summary
            </button>
            <button
              onClick={() => setActiveOptimizeSection('projects')}
              className={`px-3 py-2 text-left text-xs font-bold rounded-xl transition ${
                activeOptimizeSection === 'projects' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              💼 Project Bullet
            </button>
            <button
              onClick={() => setActiveOptimizeSection('skills')}
              className={`px-3 py-2 text-left text-xs font-bold rounded-xl transition ${
                activeOptimizeSection === 'skills' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              🛠 Skill Layout
            </button>
          </div>

          <div className="md:col-span-3 bg-[#050b14]/30 border border-white/5 rounded-xl p-5 space-y-4">
            {activeOptimizeSection === 'summary' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  AI Rewritten Summary Recommendation
                </span>
                <textarea
                  value={customOptimizedSummary}
                  onChange={(e) => setCustomOptimizedSummary(e.target.value)}
                  className="w-full h-24 bg-[#0d1626]/80 text-xs text-gray-300 p-3 rounded-lg border border-white/10 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-end gap-2 text-[10px] font-bold no-print">
                  <button
                    onClick={() => handleCopyToClipboard(customOptimizedSummary, 'summary')}
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-white bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition cursor-pointer"
                  >
                    <FiCopy className="h-3.5 w-3.5" /> Copy Optimized Wording
                  </button>
                </div>
              </div>
            )}

            {activeOptimizeSection === 'projects' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  AI Rewritten Project Descriptions
                </span>
                <div className="space-y-3">
                  {safeAnalysis.projectFeedback.map((f, i) => (
                    <div key={i} className="bg-[#0d1626]/50 border border-white/5 p-3 rounded-lg space-y-2">
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Project Bullet {i + 1}</div>
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {f.after}
                      </p>
                      <div className="flex justify-end no-print">
                        <button
                          onClick={() => handleCopyToClipboard(f.after, 'bullet')}
                          className="inline-flex items-center gap-1 text-purple-400 hover:text-white text-[9px] font-bold hover:bg-purple-500/10 px-2.5 py-1 rounded transition border border-purple-500/15"
                        >
                          <FiCopy className="h-3 w-3" /> Copy Bullet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeOptimizeSection === 'skills' && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  AI Optimized Technical Skills Section
                </span>
                <textarea
                  value={customOptimizedSkills}
                  onChange={(e) => setCustomOptimizedSkills(e.target.value)}
                  className="w-full h-28 bg-[#0d1626]/80 text-xs text-gray-300 p-3 rounded-lg border border-white/10 focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-end gap-2 text-[10px] font-bold no-print">
                  <button
                    onClick={() => handleCopyToClipboard(customOptimizedSkills, 'optimized skills')}
                    className="inline-flex items-center gap-1 text-purple-400 hover:text-white bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 transition cursor-pointer"
                  >
                    <FiCopy className="h-3.5 w-3.5" /> Copy Skills Block
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 11. LANGUAGE & GRAMMAR IMPROVEMENTS */}
      {safeAnalysis.grammarIssues.length > 0 && (
        <div id="grammar" className="glass-panel p-6 space-y-4 border-t-2 border-t-amber-500/50">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5 text-amber-400" />
              Language & Grammar ({safeAnalysis.grammarIssues.length} Issues Found)
            </h2>
            <button
              onClick={() => setGrammarExpanded(!grammarExpanded)}
              className="btn-action inline-flex items-center gap-1.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 px-3.5 py-1.5 text-xs font-bold text-purple-300 transition-all cursor-pointer no-print"
            >
              {grammarExpanded ? 'Collapse Issues' : 'View Issues'}
              <FiChevronDown className={`h-4 w-4 transform transition-transform duration-300 ${grammarExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {grammarExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pt-2"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {safeAnalysis.grammarIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="glass-card p-4 flex flex-col justify-between space-y-3 hover:border-amber-500/25 transition-all duration-300"
                    >
                      <div className="space-y-2.5">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded shrink-0 mt-0.5">
                              Problem
                            </span>
                            <span className="text-xs text-gray-300 font-semibold italic break-words">{issue.issue}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded shrink-0 mt-0.5">
                              Recommendation
                            </span>
                            <span className="text-xs text-white font-bold break-words">{issue.correction}</span>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-gray-400 mt-1 pl-0.5 leading-relaxed">
                          {issue.reason} This improves readability and ATS parsing.
                        </p>
                      </div>
                      
                      <div className="flex justify-end pt-1 no-print">
                        <button
                          onClick={() => handleCopyToClipboard(issue.cleanCorrection, 'recommendation')}
                          className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-400 hover:text-white bg-purple-500/10 hover:bg-purple-600/20 px-2.5 py-1.5 rounded-lg border border-purple-500/20 transition-all cursor-pointer"
                        >
                          <FiCopy className="h-3 w-3" />
                          Copy Correction
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
