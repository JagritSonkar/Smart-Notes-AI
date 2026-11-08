const express = require('express');
const router = express.Router();
const {
  generateSummary,
  generateQuiz,
  getImportantQuestions,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/summary/:noteId', protect, generateSummary);
router.post('/quiz/:noteId', protect, generateQuiz);
router.post('/important-questions/:noteId', protect, getImportantQuestions);

module.exports = router;
