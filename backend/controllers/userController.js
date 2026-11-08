const User = require('../models/User');
const Note = require('../models/Note');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user profile
// @route   GET /api/users/:id
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-savedNotes -downloadHistory -recentlyViewed');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const uploadCount = await Note.countDocuments({ uploadedBy: user._id });
  const totalDownloads = await Note.aggregate([
    { $match: { uploadedBy: user._id } },
    { $group: { _id: null, total: { $sum: '$downloads' } } },
  ]);

  res.status(200).json({
    success: true,
    user,
    stats: {
      uploadCount,
      totalDownloads: totalDownloads[0]?.total || 0,
    },
  });
});

// @desc    Update profile
// @route   PUT /api/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, college, branch, semester } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, bio, college, branch, semester },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, user });
});

// @desc    Upload avatar
// @route   PUT /api/users/avatar
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image' });
  }

  const user = await User.findById(req.user.id);
  if (user.avatar.publicId) {
    await deleteFromCloudinary(user.avatar.publicId);
  }

  const uploaded = await uploadToCloudinary(req.file, 'avatars');

  user.avatar = { url: uploaded.url, publicId: uploaded.publicId };
  await user.save();

  res.status(200).json({ success: true, avatar: user.avatar });
});

// @desc    Get saved notes
// @route   GET /api/users/saved
exports.getSavedNotes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'savedNotes',
    populate: { path: 'uploadedBy', select: 'name avatar' },
  });
  res.status(200).json({ success: true, notes: user.savedNotes });
});

// @desc    Get recently viewed
// @route   GET /api/users/recent
exports.getRecentlyViewed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'recentlyViewed.note',
    populate: { path: 'uploadedBy', select: 'name avatar' },
  });
  res.status(200).json({ success: true, notes: user.recentlyViewed });
});

// @desc    Get download history
// @route   GET /api/users/downloads
exports.getDownloadHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'downloadHistory.note',
    populate: { path: 'uploadedBy', select: 'name avatar' },
  });
  res.status(200).json({ success: true, history: user.downloadHistory });
});

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const topUsers = await User.find({ isActive: true })
    .select('name avatar points badges college')
    .sort({ points: -1 })
    .limit(20);

  res.status(200).json({ success: true, users: topUsers });
});

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard-stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const uploadCount = await Note.countDocuments({ uploadedBy: userId });
  const downloadStats = await Note.aggregate([
    { $match: { uploadedBy: require('mongoose').Types.ObjectId.createFromHexString(userId) } },
    { $group: { _id: null, totalDownloads: { $sum: '$downloads' }, totalViews: { $sum: '$views' } } },
  ]);

  const user = await User.findById(userId);

  res.status(200).json({
    success: true,
    stats: {
      uploads: uploadCount,
      totalDownloads: downloadStats[0]?.totalDownloads || 0,
      totalViews: downloadStats[0]?.totalViews || 0,
      points: user.points,
      badges: user.badges.length,
      savedNotes: user.savedNotes.length,
    },
  });
});
