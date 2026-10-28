const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    jobDescription: {
      type: String,
      required: true,
      maxlength: 20000,
    },

    optimizedResume: {
      type: String,
      required: true,
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
