const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserActive,
  deleteUser,
  getAllNotes,
  adminDeleteNote,
  flagNote,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.delete('/users/:id', deleteUser);
router.get('/notes', getAllNotes);
router.delete('/notes/:id', adminDeleteNote);
router.put('/notes/:id/flag', flagNote);

module.exports = router;
