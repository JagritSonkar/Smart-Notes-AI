const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  getSavedNotes,
  getRecentlyViewed,
  getDownloadHistory,
  getLeaderboard,
  getDashboardStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/leaderboard', getLeaderboard);
router.get('/dashboard-stats', protect, getDashboardStats);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/saved', protect, getSavedNotes);
router.get('/recent', protect, getRecentlyViewed);
router.get('/downloads', protect, getDownloadHistory);
router.get('/:id', getUserProfile);

module.exports = router;
