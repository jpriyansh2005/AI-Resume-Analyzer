import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiTarget,
  FiFileText,
  FiMaximize,
  FiTrendingUp,
  FiShield,
  FiChevronDown,
  FiArrowRight,
  FiLayers,
  FiEdit,
} from 'react-icons/fi';
import { useState } from 'react';

const LandingPage = () => {
  // Set the first FAQ (Why is my ATS score low?) as active by default (0)
  const [activeFaq, setActiveFaq] = useState(0);

  const faqs = [
    {
      q: 'Why is my ATS score low?',
      a: "Honestly, ATS scanners are pretty rigid. If your resume has complex layouts like multi-column tables, text boxes, custom graphics, or icons, the parser gets confused and drops your score. Also, if you don't list exact tech terms (like React, Docker, Express) that match the job description, the scanner assumes you don't know them.",
    },
    {
      q: 'Can I use ATS Pro for internships?',
      a: "Yes, definitely. I actually built it with internship applicants in mind. You can select specific junior target roles (like MERN Intern or Junior Frontend Developer) so the feedback isn't comparing you to a senior architect with 10 years of experience.",
    },
    {
      q: 'Does this work for fresher resumes?',
      a: "Yes, that was the main goal. Freshers usually struggle with empty experience blocks. ATS Pro helps you pivot your focus to project descriptions, framing them in a way that shows recruiters you understand system design and tooling.",
    },
    {
      q: "What if I don't have work experience?",
      a: "If you don't have formal work experience, your personal or course projects are your best asset. The optimizer helps you rewrite basic lines like 'built a React app' into 'designed a state-managed React portal utilizing caching protocols', which instantly appeals to tech recruiters.",
    },
    {
      q: 'Can I compare different resume versions?',
      a: 'Yes. Every time you upload a resume, it gets stored in your history log. You can track your scores and improvements on a visual growth timeline to see how your changes are paying off.',
    },
    {
      q: 'How should I improve project descriptions?',
      a: 'Focus on active action verbs and system metrics. Instead of saying what you did, write about the outcome: did you reduce load times? Secure endpoints? Standardize CSS? Recruiters want to see that you build with intention.',
    },
    {
      q: 'Does ATS Pro support developer roles?',
      a: 'Yes, we focus entirely on developer-centric roles: Frontend, Backend, Full Stack, DevOps, Mobile, and early-career software engineering positions.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050b14] overflow-hidden text-gray-300">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8 text-center">
        {/* Glow behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-5 relative z-10"
        >
          {/* Trust Badge (Authentic & Student-Specific) */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 text-xs font-semibold text-purple-300 select-none">
            <FiShield className="h-3.5 w-3.5" />
            Built for Computer Science Students & Developers
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Your Resume Through{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
              a Recruiter's Eyes
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg leading-relaxed">
            Get ATS scoring, recruiter feedback, skill-gap detection, and project optimization tailored for students and developers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-90 hover:scale-102 transform transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                Analyze My Resume <FiArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>

            {/* Product Pill Chips (Trust / Role Targeting) */}
            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-mono text-gray-400 pt-3 select-none">
              <span className="bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">✓ React & Node Roles</span>
              <span className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20">✓ Internship Targeter</span>
              <span className="bg-pink-500/10 text-pink-300 px-3 py-1 rounded-full border border-pink-500/20">✓ ATS Feedback Scanner</span>
              <span className="bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20">✓ Project Rewrite Optimizer</span>
            </div>
          </div>
        </motion.div>

        {/* 2. HERO PRODUCT PREVIEW (Highly Realistic UI Mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto max-w-4xl pt-10 relative z-10 cursor-default"
          whileHover={{ rotateX: 1, rotateY: -1, scale: 1.005 }}
        >
          <div className="relative rounded-2xl border border-white/5 bg-[#0d1626]/40 p-4 shadow-2xl backdrop-blur-md">
            {/* Browser Header */}
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/80"></div>
              <span className="text-[9px] text-gray-500 ml-4 font-mono select-none font-semibold">ats-pro-report-preview.html</span>
            </div>
            
            {/* Simulated Recruiter Analytics Page Grid */}
            <div className="rounded-xl bg-[#050b14] p-5 text-left border border-white/5 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">ATS Pro Recruiter Panel</h3>
                  <p className="text-[9px] text-gray-400 mt-0.5">Target Focus: <span className="text-purple-400 font-semibold">Junior SDE (MERN)</span></p>
                </div>
                <span className="text-[9px] font-extrabold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded-full select-none">
                  EXCELLENT MATCH ⭐
                </span>
              </div>

              {/* Mockup Widgets Grid */}
              <div className="grid gap-3.5 sm:grid-cols-3">
                {/* Score Widget */}
                <div className="rounded-xl bg-[#0d1626]/60 border border-white/5 p-4 flex flex-col justify-between h-28">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">ATS Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-purple-400">88</span>
                    <span className="text-[9px] text-gray-500">/100</span>
                  </div>
                  <span className="text-[9px] text-green-400 font-medium">"Better than 85% of applicants"</span>
                </div>

                {/* Heatmap Preview Widget */}
                <div className="rounded-xl bg-[#0d1626]/60 border border-white/5 p-4 flex flex-col justify-between h-28">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Heatmap Zones</span>
                  <div className="space-y-1 my-0.5">
                    <div className="flex justify-between text-[8px] items-center">
                      <span className="text-gray-300">Contact Header</span>
                      <span className="h-1.5 w-6 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex justify-between text-[8px] items-center">
                      <span className="text-gray-300">Experience</span>
                      <span className="h-1.5 w-6 rounded-full bg-red-500"></span>
                    </div>
                    <div className="flex justify-between text-[8px] items-center">
                      <span className="text-gray-300">Skills Matrix</span>
                      <span className="h-1.5 w-6 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-500">Hover region diagnostics active</span>
                </div>

                {/* Project Optimization Widget */}
                <div className="rounded-xl bg-[#0d1626]/60 border border-white/5 p-4 flex flex-col justify-between h-28">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Wording Optimization</span>
                  <div className="space-y-0.5">
                    <span className="text-[8px] line-through text-red-400 block font-mono italic">"Built a backend with Node"</span>
                    <span className="text-[8px] text-white block font-medium font-mono leading-tight">"Architected REST API serving 1,000+ users..."</span>
                  </div>
                  <span className="text-[8px] text-gray-500">Copy improved wording active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. WHAT ATS PRO HELPS YOU IMPROVE (Refactored Features Grid) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl tracking-tight">
            What ATS Pro Helps You Improve
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-xs">
            We check for missing libraries, vague project metrics, and formatting issues that make resume parses fail.
          </p>
        </div>

        {/* Feature Grid with asymmetry and handcrafted uniqueness */}
        <div className="grid gap-5 md:grid-cols-3 items-stretch">
          
          {/* CARD 1: AI Resume Visual Heatmap (takes 2 columns) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 glass-panel p-6 border border-purple-500/20 bg-gradient-to-br from-[#0d1626]/80 to-[#120f26]/80 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-purple-500/5 shadow-xl min-h-[220px]"
          >
            <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />
            <div className="space-y-3 max-w-md">
              <span className="text-[8px] font-extrabold tracking-widest uppercase bg-purple-600/25 border border-purple-500/35 text-purple-300 px-2.5 py-0.5 rounded-full select-none">
                Signature Feature
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiLayers className="text-purple-400 h-5 w-5" />
                AI Resume Visual Heatmap
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We visualize how standard parser scripts read your resume layout. See which sections get parsed correctly and which get dropped or malformed.
              </p>
              <div className="flex gap-3 text-[9px] text-gray-400 font-medium">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500"></span> Strong</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500"></span> Average</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500"></span> Weak</span>
              </div>
            </div>
            {/* Visual Heatmap Miniature Preview */}
            <div className="w-full md:w-56 shrink-0 bg-[#050b14]/90 border border-slate-700/50 rounded-xl p-3.5 space-y-2 text-[8px] font-mono shadow-inner select-none relative">
              <div className="border-b border-slate-800 pb-1 mb-1 text-slate-500 flex justify-between">
                <span>resume_sde.pdf</span>
                <span className="text-[7px]">Heatmap Active</span>
              </div>
              <div className="rounded border border-green-500/30 bg-green-500/5 p-1.5">
                <div className="flex justify-between items-center text-[7px] text-green-400 font-bold mb-1">
                  <span>HEADER & CONTACT</span>
                  <span>[✓ Strong]</span>
                </div>
                <div className="h-1 bg-green-500/20 w-3/4 rounded"></div>
              </div>
              <div className="rounded border border-red-500/30 bg-red-500/5 p-1.5">
                <div className="flex justify-between items-center text-[7px] text-red-400 font-bold mb-1">
                  <span>PROJECT EXPERIENCES</span>
                  <span>[⚠ Weak Action Verbs]</span>
                </div>
                <div className="h-1 bg-red-500/20 w-full rounded mb-1"></div>
                <div className="h-1 bg-red-500/20 w-5/6 rounded"></div>
              </div>
              <div className="rounded border border-yellow-500/30 bg-yellow-500/5 p-1.5">
                <div className="flex justify-between items-center text-[7px] text-yellow-400 font-bold mb-1">
                  <span>TECHNICAL SKILLS</span>
                  <span>[Match: 82%]</span>
                </div>
                <div className="h-1 bg-yellow-500/20 w-4/5 rounded"></div>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: ATS Score Analysis Card (takes 1 column) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col justify-between min-h-[220px] relative border-t-2 border-t-purple-500/50 bg-[#0d1626]/40 border border-white/5 hover:border-purple-500/20"
          >
            <div className="space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600/10 border border-purple-500/20 text-purple-400">
                <FiZap className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">ATS Score Analysis</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Runs your resume through a Python-based open-source parser to test if candidate scanners can read your details.
              </p>
            </div>
            {/* Miniature Score widget (Handcrafted SVG Ring) */}
            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center justify-center h-20 w-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/5"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-500"
                    strokeDasharray="88, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-mono font-extrabold text-white">88%</span>
                  <span className="text-[6px] text-purple-400 font-bold uppercase tracking-wider">Pass</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: Skill Gap Detection Card (takes 1 column) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col justify-between min-h-[220px] relative border-t-2 border-t-indigo-500/50 bg-[#0d1626]/50 border border-white/5 hover:border-indigo-500/20"
          >
            <div className="space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
                <FiTarget className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skill Gap Detection</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Enter your target job description and we'll check for missing developer keywords like Redis, CI/CD, or TypeScript.
              </p>
            </div>
            {/* Skill tags preview */}
            <div className="mt-3 space-y-1.5 select-none text-[8px] font-mono">
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-1 rounded">
                <span>Docker & K8s</span>
                <span>✓ Match</span>
              </div>
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 text-green-300 px-2 py-1 rounded">
                <span>Redux Toolkit</span>
                <span>✓ Match</span>
              </div>
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded">
                <span>JWT Auth</span>
                <span>⚠ Missing</span>
              </div>
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-1 rounded">
                <span>System Design</span>
                <span>⚠ Missing</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 4: Project Optimization Card (takes 2 columns) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 glass-panel p-6 border border-pink-500/10 bg-gradient-to-br from-[#0d1626]/70 to-[#0e172e]/70 flex flex-col md:flex-row justify-between items-center gap-6 min-h-[220px] relative overflow-hidden"
          >
            <div className="space-y-3 max-w-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-600/10 border border-pink-500/20 text-pink-400">
                <FiMaximize className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold text-white">Project Optimization</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Vague lines like "built a backend with Node" don't impress recruiters. We show you how to write about scale, rendering metrics, and system design.
              </p>
            </div>
            {/* Before/After wording snippet (Git Diff style code block) */}
            <div className="w-full md:w-72 shrink-0 bg-[#050b14] border border-white/10 rounded-xl overflow-hidden font-mono text-[9px] shadow-lg select-none">
              <div className="bg-[#0d1626] px-3 py-1.5 border-b border-white/5 text-gray-500 flex justify-between items-center">
                <span>diff_resume_project.patch</span>
                <span className="text-purple-400 font-bold">git diff</span>
              </div>
              <div className="p-3 space-y-1.5 leading-relaxed">
                <div className="text-red-400 bg-red-950/20 px-2 py-1 rounded border-l-2 border-red-500">
                  - Worked on backend features for an ecommerce app using React.
                </div>
                <div className="text-white bg-green-950/20 px-2 py-1 rounded border-l-2 border-green-500">
                  + Engineered reactive checkout dashboard, cutting render latency by 35% with React memo caching.
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 5: Project Wording Refinement Card (takes 1 column) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 flex flex-col justify-between min-h-[220px] relative border-t-2 border-t-amber-500/50 bg-[#0d1626]/60 border border-white/5 border-dashed"
          >
            <div className="space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600/10 border border-amber-500/20 text-amber-400">
                <FiEdit className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Wording Refinement</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We flag passive phrases and replace them with strong engineering verbs to make your work sound active.
              </p>
            </div>
            {/* Mini rewrite preview */}
            <div className="mt-4 space-y-1.5 font-mono text-[9px] select-none">
              <div className="bg-[#0d1626] border border-white/5 p-2 rounded-lg flex items-center justify-between">
                <span className="text-red-400 line-through">led a team</span>
                <span className="text-gray-500">➔</span>
                <span className="text-green-400 font-bold bg-green-500/10 px-1 py-0.5 rounded">spearheaded</span>
              </div>
              <div className="bg-[#0d1626] border border-white/5 p-2 rounded-lg flex items-center justify-between">
                <span className="text-red-400 line-through">helped with code</span>
                <span className="text-gray-500">➔</span>
                <span className="text-green-400 font-bold bg-green-500/10 px-1 py-0.5 rounded">refactored</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 6: Resume History Tracking Card (takes 2 columns) */}
          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 glass-panel p-6 border border-emerald-500/15 bg-gradient-to-br from-[#0d1626]/80 to-[#071329]/80 flex flex-col md:flex-row justify-between items-center gap-6 min-h-[220px]"
          >
            <div className="space-y-3 max-w-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
                <FiTrendingUp className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold text-white">History Tracking</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Every resume scan is saved in your history logs, letting you track your improvements as you rewrite sections.
              </p>
            </div>
            {/* Visual History Sparkline */}
            <div className="w-full md:w-64 shrink-0 bg-[#0d1626]/80 border border-white/5 rounded-xl p-4 flex flex-col justify-between font-mono select-none">
              <div className="flex justify-between items-center text-[8px] text-gray-500 mb-2">
                <span>Score History</span>
                <span>Target: Junior Full Stack</span>
              </div>
              
              <div className="relative h-16 flex items-end">
                {/* Sparkline curve */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path d="M0,35 L35,22 L75,8 L100,8 L100,40 L0,40 Z" fill="url(#chartGlow)" />
                  {/* Curve line */}
                  <path d="M0,35 Q17,28 35,22 T75,8 L100,8" fill="none" stroke="rgb(168, 85, 247)" strokeWidth="1.5" />
                </svg>

                {/* Score nodes */}
                <div className="absolute left-[0%] bottom-[5px] flex flex-col items-center">
                  <span className="text-[7px] text-gray-500">v1 (58)</span>
                  <div className="h-2 w-2 rounded-full bg-red-500 border border-white/20 mt-1"></div>
                </div>
                <div className="absolute left-[35%] bottom-[20px] flex flex-col items-center">
                  <span className="text-[7px] text-gray-500">v2 (74)</span>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 border border-white/20 mt-1"></div>
                </div>
                <div className="absolute left-[75%] bottom-[33px] flex flex-col items-center">
                  <span className="text-[7px] text-gray-500">v3 (88)</span>
                  <div className="h-2 w-2 rounded-full bg-green-500 border border-white/20 mt-1"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[7px] text-gray-400 mt-3 pt-2 border-t border-white/5">
                <span>Improvement Rate</span>
                <span className="text-green-400 font-bold">+30 points</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-white/5 bg-[#0d1626]/20 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl tracking-tight">
            How ATS Pro Works
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-xs">
            How to go from a black box rejection to a recruiter callback.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 relative">
          {[
            { step: '01', title: 'Upload Resume', desc: 'Upload your PDF or DOCX resume. The text is parsed locally.' },
            { step: '02', title: 'Choose Target Role', desc: 'Select MERN, Frontend, Backend, SDE, or Internship role.' },
            { step: '03', title: 'AI Recruiter Analysis', desc: 'Our parser checks for missing skills, flat descriptions, and formatting issues.' },
            { step: '04', title: 'Get Suggestions', desc: 'Copy optimized project descriptions and fix weak resume sections instantly.' },
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="glass-card p-5 border-l-2 border-l-purple-500 flex flex-col justify-between hover:border-l-pink-500 transition duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <span className="text-2xl font-extrabold text-purple-500/20">{item.step}</span>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. SEE A REAL RESUME ANALYSIS SECTION (Workflow Section) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-white/5 bg-[#050b14]/40 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl tracking-tight">
            Inside a Real Resume Analysis
          </h2>
          <p className="mx-auto max-w-xl text-gray-400 text-xs">
            Here is exactly what the app shows you when you run a scan.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4 items-stretch relative">
          {/* Step 1 */}
          <div className="glass-panel p-5 space-y-3 border border-white/5 flex flex-col justify-between min-h-[220px] relative">
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold text-purple-400 font-mono">STEP 1: UPLOAD</div>
              <h3 className="text-sm font-bold text-white">Drag & Drop Resume</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Upload your PDF or DOCX file. The system extracts the raw text in under 1 second.
              </p>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-3.5 text-center bg-white/2 select-none">
              <FiFileText className="h-5 w-5 text-purple-400 mx-auto mb-1 animate-pulse" />
              <span className="text-[9px] text-gray-400 block font-medium">resume-v1.pdf</span>
              <span className="text-[8px] text-gray-500 block">PDF - 128KB</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-5 space-y-3 border border-white/5 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold text-purple-400 font-mono">STEP 2: TARGET</div>
              <h3 className="text-sm font-bold text-white">Select Role Target</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Select your developer focus (e.g., MERN Intern, Frontend Developer) to align keyword parsers.
              </p>
            </div>
            <div className="bg-[#050b14]/60 border border-white/5 rounded-xl p-3 space-y-1.5 select-none">
              <span className="text-[8px] text-gray-500 uppercase block font-bold">Selected Role</span>
              <div className="flex items-center justify-between text-[10px] text-white bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
                <span>Junior Developer</span>
                <span className="text-[8px] text-purple-400 font-bold">MERN</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-5 space-y-3 border border-white/5 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold text-purple-400 font-mono">STEP 3: RECOMMEND</div>
              <h3 className="text-sm font-bold text-white">Project Rewrite Feedback</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Gemini identifies flat sentences and rewrites them into high-value action bullets with metrics.
              </p>
            </div>
            <div className="bg-[#0d1626]/80 border border-white/5 p-3 rounded-xl space-y-1.5 select-none text-[8px] font-mono leading-normal">
              <div>
                <span className="text-red-400 line-through">"Built a chat page"</span>
                <span className="text-white block font-bold">"Architected real-time chat utilizing WebSockets for 100+ concurrent connections"</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-panel p-5 space-y-3 border border-white/5 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold text-purple-400 font-mono">STEP 4: RESULTS</div>
              <h3 className="text-sm font-bold text-white">ATS Dashboard Metrics</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Instantly inspect your circular score meters, review skill alignment gaps, and copy optimized text.
              </p>
            </div>
            <div className="bg-[#0d1626]/80 border border-white/5 p-3 rounded-xl flex items-center justify-between select-none">
              <div className="space-y-0.5">
                <span className="text-[8px] text-gray-500 block uppercase font-mono">ATS score</span>
                <span className="text-xs font-mono font-extrabold text-white">88%</span>
              </div>
              <span className="text-[8px] font-extrabold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                PASS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL PRODUCT TRANSFORMATION SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl tracking-tight">
            How a Student's Resume Changes
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-xs">
            A side-by-side comparison of a standard resume draft versus one optimized for tech recruiters.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* BEFORE CARD */}
          <div className="glass-panel p-5 border border-red-500/10 bg-red-950/5 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
              <span className="text-[9px] font-extrabold bg-red-500/15 border border-red-500/30 text-red-400 px-3 py-0.5 rounded-full uppercase select-none">
                Before Optimization
              </span>
              <div className="flex items-baseline gap-1 select-none">
                <span className="text-2xl font-extrabold text-red-400">58</span>
                <span className="text-[9px] text-gray-500">/100 Score</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-red-400 shrink-0 mt-0.5">❌</span>
                <div>
                  <span className="font-bold block text-white text-xs">Weak project descriptions</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Generic phrasing like "built web page using React" with no architectural scope.</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                <span className="text-red-400 shrink-0 mt-0.5">❌</span>
                <div>
                  <span className="font-bold block text-white text-xs">Missing ATS keywords</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Lacks reference to database configurations, authentication packages, or frameworks.</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                <span className="text-red-400 shrink-0 mt-0.5">❌</span>
                <div>
                  <span className="font-bold block text-white text-xs">No quantified metrics</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">No data on query optimization ratios, response speed gains, or user scale details.</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                <span className="text-red-400 shrink-0 mt-0.5">❌</span>
                <div>
                  <span className="font-bold block text-white text-xs">Poor recruiter readability</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Heavy paragraphs describing tasks instead of highlighted engineering skills.</span>
                </div>
              </div>
            </div>
          </div>

          {/* AFTER CARD */}
          <div className="glass-panel p-5 border border-green-500/10 bg-green-950/5 relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-3">
              <span className="text-[9px] font-extrabold bg-green-500/15 border border-green-500/30 text-green-400 px-3 py-0.5 rounded-full uppercase select-none">
                After Optimization
              </span>
              <div className="flex items-baseline gap-1 select-none">
                <span className="text-2xl font-extrabold text-green-400">88</span>
                <span className="text-[9px] text-gray-500">/100 Score</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs text-gray-300">
                <span className="text-green-400 shrink-0 mt-0.5">✅</span>
                <div>
                  <span className="font-bold block text-white text-xs">Strong ATS optimization</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Clean, standardized structural layouts easily read by common ATS parsers.</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                <span className="text-green-400 shrink-0 mt-0.5">✅</span>
                <div>
                  <span className="font-bold block text-white text-xs">Better technical wording</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Replaced verbs with high-value actions (e.g., architected, structured, indexed).</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                <span className="text-green-400 shrink-0 mt-0.5">✅</span>
                <div>
                  <span className="font-bold block text-white text-xs">Quantified project metrics</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Includes performance numbers, user scale details, and load reduction rates.</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-300 border-t border-white/5 pt-2.5">
                <span className="text-green-400 shrink-0 mt-0.5">✅</span>
                <div>
                  <span className="font-bold block text-white text-xs">Better recruiter readability</span>
                  <span className="text-[11px] text-gray-400 leading-relaxed">Clean, bulleted segments optimized for standard developer screen standards.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTHENTIC STATISTICS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="grid gap-5 md:grid-cols-3 text-center">
          <div className="glass-panel p-5 border border-white/5">
            <span className="block text-3xl font-extrabold text-purple-400 select-none">20+</span>
            <span className="mt-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider select-none">Supported Developer Roles</span>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug">We support React, Node, Python, Java, DevOps, Mobile, and early-career software engineering roles.</p>
          </div>
          <div className="glass-panel p-5 border border-white/5">
            <span className="block text-3xl font-extrabold text-indigo-400 select-none">10+</span>
            <span className="mt-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider select-none">Analysis Categories</span>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug">ATS parser metrics, project rewrites, missing skill grids, grammar issues, and layout parameters.</p>
          </div>
          <div className="glass-panel p-5 border border-white/5">
            <span className="block text-3xl font-extrabold text-pink-400 select-none">100+</span>
            <span className="mt-1 block text-xs font-semibold text-gray-300 uppercase tracking-wider select-none">Personalized Recommendations</span>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug">Actionable steps generated dynamically for your target tech stack.</p>
          </div>
        </div>
      </section>

      {/* 8. BUILDER STORY SECTION (Student-focused, Authentic, Personal Story) */}
      <section className="mx-auto max-w-4xl px-4 py-9 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <div className="glass-panel p-6 md:p-8 border border-purple-500/10 bg-[#0d1626]/30 space-y-4 relative">
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 select-none">
            <span className="text-[8px] font-extrabold uppercase bg-purple-600/20 text-purple-300 px-3 py-1 rounded border border-purple-500/20 tracking-wider">
              Student-built Product
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">Why I Built ATS Pro</h2>
            <p className="text-[9px] font-bold text-purple-400 uppercase tracking-wider">Built by a Computer Engineering Student</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar Badge */}
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 border border-purple-400/30 text-white font-extrabold text-lg shadow-lg select-none">
              RS
            </div>
            <div className="space-y-3">
              <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
                "Last year, during internship recruiting, I sent out over 150 applications. I got almost zero responses and couldn't figure out why. After talking to a friend who works as a tech recruiter, I realized my resume was getting filtered out by ATS scanners because of simple formatting quirks (like double columns) or missing exact keyword matches (like React, Docker, Express). I couldn't find a tool that gave specific, actionable feedback without charging a premium subscription, so I built ATS Pro between classes. It runs a local simulation of candidate parser scripts, highlights formatting risks, lists technical skill gaps, and suggests rewrite wording for developer projects."
              </p>
              <div className="flex gap-4 text-[10px] text-gray-500 pt-1 border-t border-white/5 font-mono select-none">
                <span>Rohan Sharma &middot; Computer Engineering Student</span>
                <span>&middot;</span>
                <span>Open source & free for students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION (With first FAQ expanded by default) */}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 border-t border-white/5 relative z-10">
        <h2 className="text-xl font-bold text-center text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card overflow-hidden cursor-pointer"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between p-4.5">
                <span className="font-semibold text-white text-xs sm:text-sm">{faq.q}</span>
                <FiChevronDown
                  className={`h-4.5 w-4.5 text-gray-400 transition-transform duration-300 ${
                    activeFaq === idx ? 'rotate-180 text-purple-400' : ''
                  }`}
                />
              </div>
              {activeFaq === idx && (
                <div className="border-t border-white/5 bg-[#050b14]/50 p-4.5 text-xs text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CTA SECTION (Believable and Practical Wording) */}
      <section className="relative mx-auto max-w-4xl px-4 py-8 text-center border-t border-white/5 my-2">
        <div className="glass-panel p-8 space-y-5 relative overflow-hidden border border-purple-500/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 pointer-events-none" />
          <h2 className="text-lg font-bold text-white">Ready to See What Recruiters See?</h2>
          <p className="max-w-md mx-auto text-xs text-gray-400 leading-relaxed">
            Stop guessing why recruiters aren't responding. Spend 30 seconds scanning your resume and secure more interviews.
          </p>
          <div className="pt-1">
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3 text-xs font-bold text-white shadow-md hover:opacity-95 inline-flex items-center gap-1.5 cursor-pointer"
            >
              Analyze My Resume <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050b14] border-t border-white/5 py-8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-3 select-none">
          <span className="text-base font-bold text-white bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            ATS Pro
          </span>
          <p className="text-[10px] text-gray-500">
            © 2026 ATS Pro. Built with React, Tailwind CSS, Node, MongoDB, and Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
