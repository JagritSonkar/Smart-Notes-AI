const Note = require('../models/Note');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Upload note
// @route   POST /api/notes
exports.uploadNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }

  const { title, description, subject, branch, semester, category, tags } = req.body;

  const uploadedFile = await uploadToCloudinary(req.file, 'documents');

  const note = await Note.create({
    title,
    description,
    subject,
    branch,
    semester,
    category,
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    file: { ...uploadedFile, size: req.file.size, originalName: req.file.originalname },
    uploadedBy: req.user.id,
  });

  // Award points to uploader
  const user = await User.findById(req.user.id);
  user.points += 20;
  if (user.points >= 100 && !user.badges.find((b) => b.name === 'Contributor')) {
    user.badges.push({ name: 'Contributor', icon: '⭐' });
  }
  await user.save();

  res.status(201).json({ success: true, note });
});

// @desc    Get all notes with filtering, search, sort
// @route   GET /api/notes
exports.getNotes = asyncHandler(async (req, res) => {
  const { search, subject, branch, semester, category, sort, page = 1, limit = 12 } = req.query;

  const query = { isApproved: true };
  if (subject) query.subject = subject;
  if (branch) query.branch = branch;
  if (semester) query.semester = semester;
  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  let sortOption = { createdAt: -1 };
  if (sort === 'popular') sortOption = { downloads: -1 };
  if (sort === 'rating') sortOption = { averageRating: -1 };
  if (sort === 'views') sortOption = { views: -1 };

  const skip = (page - 1) * limit;
  const notes = await Note.find(query)
    .populate('uploadedBy', 'name avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Note.countDocuments(query);

  res.status(200).json({
    success: true,
    count: notes.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    notes,
  });
});

// @desc    Get single note
// @route   GET /api/notes/:id
exports.getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('uploadedBy', 'name avatar college');

  if (!note) {
    return res.status(404).json({ success: false, message: 'Note not found' });
  }

  note.views += 1;
  await note.save();

  // Add to recently viewed if user logged in
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { recentlyViewed: { note: note._id } },
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { recentlyViewed: { $each: [{ note: note._id }], $position: 0, $slice: 20 } },
    });
  }

  res.status(200).json({ success: true, note });
});

// @desc    Update note
// @route   PUT /api/notes/:id
exports.updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, note });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await deleteFromCloudinary(note.file.publicId);
  await note.deleteOne();

  res.status(200).json({ success: true, message: 'Note deleted' });
});

// @desc    Download note
// @route   GET /api/notes/:id/download
exports.downloadNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  note.downloads += 1;
  await note.save();

  await User.findByIdAndUpdate(req.user.id, {
    $push: { downloadHistory: { $each: [{ note: note._id }], $position: 0, $slice: 50 } },
  });

  res.status(200).json({ success: true, downloadUrl: note.file.url });
});

// @desc    Like / Unlike note
// @route   PUT /api/notes/:id/like
exports.likeNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const index = note.likes.indexOf(req.user.id);
  if (index === -1) {
    note.likes.push(req.user.id);
    if (note.uploadedBy.toString() !== req.user.id) {
      await Notification.create({
        recipient: note.uploadedBy,
        sender: req.user.id,
        type: 'like',
        message: `${req.user.name} liked your note "${note.title}"`,
        relatedNote: note._id,
        link: `/notes/${note._id}`,
      });
    }
  } else {
    note.likes.splice(index, 1);
  }
  await note.save();
  res.status(200).json({ success: true, likes: note.likes.length, liked: index === -1 });
});

// @desc    Bookmark / Unbookmark note
// @route   PUT /api/notes/:id/bookmark
exports.bookmarkNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const user = await User.findById(req.user.id);
  const index = user.savedNotes.indexOf(note._id);

  if (index === -1) {
    user.savedNotes.push(note._id);
    note.bookmarks.push(req.user.id);
  } else {
    user.savedNotes.splice(index, 1);
    note.bookmarks = note.bookmarks.filter((b) => b.toString() !== req.user.id);
  }
  await user.save();
  await note.save();

  res.status(200).json({ success: true, bookmarked: index === -1 });
});

// @desc    Rate note
// @route   POST /api/notes/:id/rate
exports.rateNote = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const existingRating = note.ratings.find((r) => r.user.toString() === req.user.id);
  if (existingRating) {
    existingRating.rating = rating;
  } else {
    note.ratings.push({ user: req.user.id, rating });
  }

  note.calculateAverageRating();
  await note.save();

  res.status(200).json({ success: true, averageRating: note.averageRating });
});

// @desc    Get related notes
// @route   GET /api/notes/:id/related
exports.getRelatedNotes = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const related = await Note.find({
    _id: { $ne: note._id },
    $or: [{ subject: note.subject }, { branch: note.branch }, { category: note.category }],
    isApproved: true,
  })
    .limit(6)
    .populate('uploadedBy', 'name avatar')
    .sort({ averageRating: -1 });

  res.status(200).json({ success: true, notes: related });
});

// @desc    Get my notes
// @route   GET /api/notes/user/my-notes
exports.getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: notes.length, notes });
});
