const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get platform analytics (admin)
// @route   GET /api/analytics/overview
exports.getOverview = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalNotes = await Note.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });

  const downloadStats = await Note.aggregate([
    { $group: { _id: null, totalDownloads: { $sum: '$downloads' }, totalViews: { $sum: '$views' } } },
  ]);

  // Top subjects
  const topSubjects = await Note.aggregate([
    { $group: { _id: '$subject', count: { $sum: 1 }, downloads: { $sum: '$downloads' } } },
    { $sort: { downloads: -1 } },
    { $limit: 10 },
  ]);

  // Notes by branch
  const notesByBranch = await Note.aggregate([
    { $group: { _id: '$branch', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Notes by category
  const notesByCategory = await Note.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Uploads over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const uploadsOverTime = await Note.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // New users over time
  const usersOverTime = await User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    overview: {
      totalUsers,
      totalNotes,
      activeUsers,
      totalDownloads: downloadStats[0]?.totalDownloads || 0,
      totalViews: downloadStats[0]?.totalViews || 0,
    },
    topSubjects,
    notesByBranch,
    notesByCategory,
    uploadsOverTime,
    usersOverTime,
  });
});

// @desc    Get top contributors
// @route   GET /api/analytics/top-contributors
exports.getTopContributors = asyncHandler(async (req, res) => {
  const contributors = await Note.aggregate([
    { $group: { _id: '$uploadedBy', uploadCount: { $sum: 1 }, totalDownloads: { $sum: '$downloads' } } },
    { $sort: { totalDownloads: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        uploadCount: 1,
        totalDownloads: 1,
        'user.name': 1,
        'user.avatar': 1,
        'user.points': 1,
        'user.college': 1,
      },
    },
  ]);

  res.status(200).json({ success: true, contributors });
});
