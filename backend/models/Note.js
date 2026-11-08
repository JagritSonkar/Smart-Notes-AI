const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: 2000,
    },
    subject: { type: String, required: true, index: true },
    branch: {
      type: String,
      required: true,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'BIO', 'OTHER'],
      index: true,
    },
    semester: { type: Number, required: true, min: 1, max: 8, index: true },
    category: {
      type: String,
      required: true,
      enum: ['Lecture Notes', 'Previous Year Papers', 'Assignments', 'Lab Manual', 'Reference', 'Other'],
      index: true,
    },
    tags: [{ type: String, lowercase: true }],
    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      format: String,
      size: Number,
      originalName: String,
    },
    thumbnail: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    aiSummary: { type: String, default: '' },
    aiQuiz: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
      },
    ],
    importantQuestions: [{ type: String }],
    isApproved: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    flagReason: String,
  },
  { timestamps: true }
);

// Text index for search
noteSchema.index({ title: 'text', description: 'text', tags: 'text', subject: 'text' });

// Calculate average rating
noteSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
  this.averageRating = (sum / this.ratings.length).toFixed(1);
};

module.exports = mongoose.model('Note', noteSchema);
