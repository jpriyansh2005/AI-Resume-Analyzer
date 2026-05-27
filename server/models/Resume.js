import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeName: {
    type: String,
    required: true,
  },
  resumePath: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  skillMatch: {
    type: Number,
    required: true,
  },
  analysis: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Resume', resumeSchema);
