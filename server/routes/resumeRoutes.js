import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadAndAnalyze,
  getHistory,
  getAnalysisDetail,
  deleteAnalysis,
  updateAnalysis,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protected routes
router.post('/upload', protect, upload.single('resume'), uploadAndAnalyze);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getAnalysisDetail);
router.put('/:id', protect, updateAnalysis);
router.delete('/:id', protect, deleteAnalysis);

export default router;
