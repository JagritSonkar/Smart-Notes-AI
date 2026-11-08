const User = require('../models/User');
const Note = require('../models/Note');
const Comment = require('../models/Comment');
const { deleteFromCloudinary } = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
    : {};

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pages: Math.ceil(total / limit),
    users,
  });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
exports.toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isActive = !user.isActive;
  await user.save();

  res.status(200).json({ success: true, user });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  // Delete user notes
  const notes = await Note.find({ uploadedBy: user._id });
  for (const note of notes) {
    if (note.file.publicId) await deleteFromCloudinary(note.file.publicId);
  }
  await Note.deleteMany({ uploadedBy: user._id });
  await Comment.deleteMany({ user: user._id });
  await user.deleteOne();

  res.status(200).json({ success: true, message: 'User deleted' });
});

// @desc    Get all notes (admin)
// @route   GET /api/admin/notes
exports.getAllNotes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, flagged } = req.query;
  const query = flagged === 'true' ? { isFlagged: true } : {};

  const notes = await Note.find(query)
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await Note.countDocuments(query);

  res.status(200).json({ success: true, count: notes.length, total, notes });
});

// @desc    Delete any note (admin)
// @route   DELETE /api/admin/notes/:id
exports.adminDeleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  if (note.file.publicId) await deleteFromCloudinary(note.file.publicId);
  await Comment.deleteMany({ note: note._id });
  await note.deleteOne();

  res.status(200).json({ success: true, message: 'Note removed' });
});

// @desc    Flag/unflag note
// @route   PUT /api/admin/notes/:id/flag
exports.flagNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  note.isFlagged = !note.isFlagged;
  note.flagReason = req.body.reason || '';
  await note.save();

  res.status(200).json({ success: true, note });
});
