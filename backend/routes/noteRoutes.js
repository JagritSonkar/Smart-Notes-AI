const express = require('express');
const router = express.Router();
const {
  uploadNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  downloadNote,
  likeNote,
  bookmarkNote,
  rateNote,
  getRelatedNotes,
  getMyNotes,
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/').get(getNotes).post(protect, upload.single('file'), uploadNote);
router.get('/user/my-notes', protect, getMyNotes);
router.get('/:id/related', getRelatedNotes);
router.get('/:id/download', protect, downloadNote);
router.put('/:id/like', protect, likeNote);
router.put('/:id/bookmark', protect, bookmarkNote);
router.post('/:id/rate', protect, rateNote);
router.route('/:id').get(getNote).put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;
