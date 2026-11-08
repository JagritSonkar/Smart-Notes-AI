const express = require('express');
const router = express.Router();
const { getOverview, getTopContributors } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/overview', protect, authorize('admin'), getOverview);
router.get('/top-contributors', getTopContributors);

module.exports = router;
