import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
import Resume from '../models/Resume.js';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// Initialize Gemini
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_goes_here') {
    throw new Error('Gemini API Key is missing or not configured.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Text Extraction Helper
const extractText = async (filePath, originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);
    const parser = new pdf.PDFParse(uint8Array);
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    throw new Error('Unsupported file extension. Please upload a PDF or DOCX file.');
  }
};

// Clean extracted text
const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/[\r\n]+/g, ' ') // Remove newlines
    .trim();
};

// @desc    Upload & analyze resume
// @route   POST /api/resume/upload
// @access  Private
export const uploadAndAnalyze = async (req, res) => {
  try {
    const { role } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload your resume.' });
    }

    if (!role) {
      // Clean up uploaded file if role is missing
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'Please select a target role.' });
    }

    // 1. Extract text
    let rawText = '';
    try {
      rawText = await extractText(file.path, file.originalname);
    } catch (parseErr) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ message: `Parsing error: ${parseErr.message}` });
    }

    const cleanedText = cleanText(rawText);
    if (!cleanedText || cleanedText.length < 50) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ message: 'The uploaded file does not contain enough readable text. Make sure it is not scanned or empty.' });
    }

    // 2. Call Gemini API
    let geminiResponseText = '';
    try {
      const genAI = getGenAI();
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are an expert ATS (Applicant Tracking System) resume reviewer and professional technical recruiter.
Analyze the following resume text for the target role: "${role}".

Resume Text:
"""
${cleanedText}
"""

Evaluate the resume and return ONLY a valid JSON object matching the following schema:
{
  "overallScore": 85, // integer from 0 to 100
  "atsScore": 78, // integer from 0 to 100
  "skillMatch": 82, // integer from 0 to 100
  "strengthLevel": "GOOD MATCH ⭐", // Choose from: EXCELLENT MATCH 🏆, STRONG MATCH ✨, GOOD MATCH ⭐, NEEDS WORK ⚠️
  "verdict": "You have a solid base in MERN stack technologies, but need to improve database query metrics and mention specific DevOps/deployment toolchains.", // Short concise AI verdict, max 2 sentences.
  "interviewReadiness": 83, // integer percentage representing likelihood of passing technical screen for "${role}"
  "jobFit": {
    "readyFor": ["MERN Stack Internship", "Frontend Developer", "Junior Web Developer"], // array of 2-4 matching roles
    "needsImprovementFor": ["Senior Full Stack Developer", "Backend DevOps Engineer"] // array of 1-3 roles
  },
  "topPriorityFixes": [
    "Quantify your project achievements using metrics (e.g., latency, user count)",
    "Add deployment details (Vercel, AWS, Docker or Netlify)",
    "Include more technical keywords related to testing (Jest, Cypress)"
  ], // exactly 3 top priority fixes
  "strengths": [
    {
      "title": "Strong React Architecture",
      "description": "Demonstrates clear routing, state management, and modern component layout in projects."
    }
  ], // array of objects (minimum 3)
  "weaknesses": [
    {
      "title": "Missing Deployment Exposure",
      "description": "No hosting platforms (Vercel, Heroku, AWS) or CI/CD integrations are referenced in work or project descriptions."
    }
  ], // array of objects (minimum 3)
  "missingSkills": [
    {
      "name": "JWT Authentication",
      "priority": "HIGH" // Choose from: HIGH, MEDIUM, LOW
    },
    {
      "name": "Docker",
      "priority": "MEDIUM"
    }
  ], // array of objects
  "projectFeedback": [
    {
      "before": "Built a backend server using Express.",
      "after": "Architected a scalable Node/Express REST API serving 1,000+ daily active users, optimizing database indexing to reduce API latency by 35%."
    }
  ], // array of objects
  "improvementSuggestions": {
    "projectImprovements": [
      "Add quantifiable metrics to your ecommerce project",
      "Integrate Redis caching to showcase performance optimization"
    ],
    "skillsImprovements": [
      "Learn and document Docker basics",
      "Add automated testing skills (Jest/Supertest) to your stack"
    ],
    "resumeFormatting": [
      "Improve section spacing and use consistent date alignment",
      "Remove double spacing inside contact information"
    ],
    "atsOptimization": [
      "Replace graphical bars representing skill levels with text lists",
      "Avoid multi-column tables in the work experience section"
    ],
    "technicalImprovements": [
      "Incorporate Git workflow details",
      "List API security measures implemented like CORS and helmet"
    ]
  },
  "roadmap": [
    {
      "step": "STEP 1: Add Quantified Metrics",
      "description": "Update project description lines to reflect scale, performance gains, and database improvements.",
      "duration": "1-2 days",
      "difficulty": "Easy" // Choose from: Easy, Medium, Hard
    },
    {
      "step": "STEP 2: Deploy Projects & Add Links",
      "description": "Deploy frontends to Vercel/Netlify and backends to Render/Docker, then include active URLs.",
      "duration": "2-3 days",
      "difficulty": "Medium"
    },
    {
      "step": "STEP 3: Add Testing Frameworks",
      "description": "Write basic integration tests for APIs using Jest and list them under technical skills.",
      "duration": "3-5 days",
      "difficulty": "Hard"
    }
  ], // array of 3-5 steps mapping a chronological improvement path
  "grammarIssues": [
    {
      "issue": "Numpy,Pandas",
      "correction": "Numpy, Pandas",
      "reason": "Missing space after comma in skills list."
    }
  ], // array of objects
  "heatmap": {
    "confidenceMeter": 91, // AI Confidence percentage (integer 0 to 100)
    "biggestBottleneck": {
      "sectionName": "Work Experience", // name of the section representing the biggest bottleneck
      "improvementImpact": "Improving this section could increase ATS score by +14 points." // potential point improvement text
    },
    "sections": [
      {
        "name": "Contact & Header", // Choose from: Contact & Header, Professional Summary, Education, Skills, Work Experience, Projects, Certifications, Achievements, Publications, Internships, Leadership, Extracurriculars, Languages, Awards
        "exists": true, // boolean (true if section actually exists in the resume, false if it is missing but recommended for the target role "${role}")
        "score": 85, // section strength score from 0 to 100 (null if exists is false)
        "contribution": 15, // Influence percentage of this section (integer from 1 to 100)
        "atsImpact": "MEDIUM", // Choose from: HIGH, MEDIUM, LOW
        "readability": "Medium", // Choose from: High, Medium, Low
        "technicalDepth": "Medium", // Choose from: Strong, Medium, Weak (null if exists is false)
        "status": "Strong", // Choose from: Strong, Average, Weak, Missing
        "reasons": "Optimal sizing, clean structure. Direct links to GitHub and LinkedIn are active.", // brief explanation of score/status reasoning
        "issues": [
          "No personal portfolio website link found"
        ], // array of strings (empty if none or missing)
        "recruiterImpact": "Recruiter can easily find contact information and code profiles within 2 seconds.", // recruiter impact statement
        "oneClickFix": {
          "before": "Priyansh Sharma, Developer", // snippet of actual resume text showing the problem (empty/N/A if missing)
          "after": "Priyansh Sharma | MERN Stack Developer | github.com/priyansh | priyansh.dev" // suggested improvement
        }
      }
    ] // array of all sections in their exact order of appearance in the resume, plus any missing but recommended sections for the target role "${role}".
  },
  "summary": "This resume demonstrates a capable developer with core MERN stack skills, though adding automated testing and deployment details will significantly elevate your marketability for mid-level roles." // maximum 3 lines
}

Do not write any markdown code blocks, intro, or outro text. Return only the raw JSON.
`;

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      geminiResponseText = response.response.text();
    } catch (apiErr) {
      console.error('Gemini API Error:', apiErr.message);
      // Clean up upload file
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(500).json({ message: `Gemini API Error: ${apiErr.message}` });
    }

    // 3. Parse Gemini JSON response
    let parsedAnalysis = {};
    try {
      parsedAnalysis = JSON.parse(geminiResponseText);
    } catch (jsonErr) {
      console.error('JSON Parse Error of Gemini Response:', jsonErr.message, geminiResponseText);
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(500).json({ message: 'Failed to parse AI analysis response. Please try again.' });
    }

    // 4. Save to Database
    const resumeAnalysis = await Resume.create({
      userId: req.user._id,
      resumeName: file.originalname,
      resumePath: file.path,
      role,
      overallScore: parsedAnalysis.overallScore || 0,
      atsScore: parsedAnalysis.atsScore || 0,
      skillMatch: parsedAnalysis.skillMatch || 0,
      analysis: parsedAnalysis,
    });

    res.status(201).json(resumeAnalysis);
  } catch (error) {
    console.error('Upload & Analyze error:', error.message);
    res.status(500).json({ message: 'Internal server error during resume processing.' });
  }
};

// @desc    Get user's resume history
// @route   GET /api/resume/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const history = await Resume.find({ userId: req.user._id })
      .select('resumeName role overallScore atsScore skillMatch createdAt')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error('Fetch history error:', error.message);
    res.status(500).json({ message: 'Failed to fetch resume analysis history.' });
  }
};

// @desc    Get single analysis detail
// @route   GET /api/resume/:id
// @access  Private
export const getAnalysisDetail = async (req, res) => {
  try {
    const analysis = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis report not found' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Fetch detail error:', error.message);
    res.status(500).json({ message: 'Failed to fetch report detail.' });
  }
};

// @desc    Delete single analysis report
// @route   DELETE /api/resume/:id
// @access  Private
export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis report not found' });
    }

    // Delete local file if it exists
    if (fs.existsSync(analysis.resumePath)) {
      fs.unlinkSync(analysis.resumePath);
    }

    await analysis.deleteOne();

    res.json({ message: 'Analysis report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error.message);
    res.status(500).json({ message: 'Failed to delete report.' });
  }
};

// @desc    Update single analysis report (e.g., roadmap steps completion)
// @route   PUT /api/resume/:id
// @access  Private
export const updateAnalysis = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Analysis report not found' });
    }

    if (req.body.analysis) {
      resume.analysis = { ...resume.analysis, ...req.body.analysis };
      resume.markModified('analysis');
    }

    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Update report error:', error.message);
    res.status(500).json({ message: 'Failed to update report.' });
  }
};
