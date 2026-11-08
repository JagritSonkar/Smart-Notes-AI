const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');

// Mock AI functions - replace with actual AI service (OpenAI, Gemini, etc.)
const generateSummaryFromText = (text) => {
  // Placeholder logic — in production, call an AI API
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
  return sentences.slice(0, 5).join('. ') + '.';
};

const generateQuizFromText = (text, count = 5) => {
  // Placeholder logic — should call an AI API
  const sample = [];
  for (let i = 0; i < count; i++) {
    sample.push({
      question: `Sample question ${i + 1} based on the note content?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
    });
  }
  return sample;
};

const extractImportantQuestions = (text) => {
  return [
    'Explain the main concept covered in this note.',
    'List the key principles discussed.',
    'Compare and contrast the major topics.',
    'Provide examples for the theory presented.',
    'Discuss real-world applications.',
  ];
};

// @desc    Generate AI summary for a note
// @route   POST /api/ai/summary/:noteId
exports.generateSummary = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  // In production: download the file from Cloudinary, parse using pdf-parse,
  // then send the extracted text to an AI service like OpenAI/Gemini.
  const mockText = note.description + ' ' + (note.tags || []).join(' ');
  const summary = generateSummaryFromText(mockText) ||
    `This document covers ${note.subject} for semester ${note.semester} students. ` +
    `It includes ${note.category.toLowerCase()} with detailed explanations and examples.`;

  note.aiSummary = summary;
  await note.save();

  res.status(200).json({ success: true, summary });
});

// @desc    Generate quiz from note
// @route   POST /api/ai/quiz/:noteId
exports.generateQuiz = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const quiz = generateQuizFromText(note.description, 5);
  note.aiQuiz = quiz;
  await note.save();

  res.status(200).json({ success: true, quiz });
});

// @desc    Extract important questions
// @route   POST /api/ai/important-questions/:noteId
exports.getImportantQuestions = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const questions = extractImportantQuestions(note.description);
  note.importantQuestions = questions;
  await note.save();

  res.status(200).json({ success: true, questions });
});
