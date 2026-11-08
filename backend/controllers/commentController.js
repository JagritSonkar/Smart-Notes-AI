const Comment = require('../models/Comment');
const Note = require('../models/Note');
const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get comments for a note
// @route   GET /api/comments/note/:noteId
exports.getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ note: req.params.noteId })
    .populate('user', 'name avatar')
    .populate('replies.user', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: comments.length, comments });
});

// @desc    Add comment
// @route   POST /api/comments/note/:noteId
exports.addComment = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  const comment = await Comment.create({
    note: req.params.noteId,
    user: req.user.id,
    text: req.body.text,
  });

  await comment.populate('user', 'name avatar');

  if (note.uploadedBy.toString() !== req.user.id) {
    await Notification.create({
      recipient: note.uploadedBy,
      sender: req.user.id,
      type: 'comment',
      message: `${req.user.name} commented on your note "${note.title}"`,
      relatedNote: note._id,
      link: `/notes/${note._id}`,
    });
  }

  res.status(201).json({ success: true, comment });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await comment.deleteOne();
  res.status(200).json({ success: true, message: 'Comment deleted' });
});

// @desc    Reply to a comment
// @route   POST /api/comments/:id/reply
exports.replyComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  comment.replies.push({ user: req.user.id, text: req.body.text });
  await comment.save();
  await comment.populate('replies.user', 'name avatar');

  res.status(201).json({ success: true, comment });
});

// @desc    Like a comment
// @route   PUT /api/comments/:id/like
exports.likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  const index = comment.likes.indexOf(req.user.id);
  if (index === -1) comment.likes.push(req.user.id);
  else comment.likes.splice(index, 1);

  await comment.save();
  res.status(200).json({ success: true, likes: comment.likes.length });
});
