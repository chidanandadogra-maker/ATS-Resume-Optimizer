
const Resume = require("../models/Resume");

async function getResumeHistory(req, res) {
  try {
    const resumes = await Resume.find({
      userId: req.user._id,
    })
      .select("-jobDescription")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get resume history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not load resume history.",
    });
  }
}

async function createResumeHistory(req, res) {
  try {
    const {
      resumeName,
      jobDescription,
      optimizedResume,
      atsScore,
      matchedKeywords,
      missingKeywords,
      suggestions,
    } = req.body;

    if (
      typeof resumeName !== "string" ||
      !resumeName.trim() ||
      typeof jobDescription !== "string" ||
      !jobDescription.trim() ||
      typeof optimizedResume !== "string" ||
      !optimizedResume.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Resume name, job description and optimized resume are required.",
      });
    }

    if (
      atsScore !== undefined &&
      (typeof atsScore !== "number" ||
        !Number.isFinite(atsScore) ||
        atsScore < 0 ||
        atsScore > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "ATS score must be between 0 and 100.",
      });
    }

    const resume = await Resume.create({
      userId: req.user._id,
      resumeName: resumeName.trim(),
      jobDescription,
      optimizedResume,
      atsScore: atsScore ?? 0,
      matchedKeywords: Array.isArray(matchedKeywords)
        ? matchedKeywords
        : [],
      missingKeywords: Array.isArray(missingKeywords)
        ? missingKeywords
        : [],
      suggestions: Array.isArray(suggestions)
        ? suggestions
        : [],
    });

    return res.status(201).json({
      success: true,
      message: "Resume history saved successfully.",
      resume,
    });
  } catch (error) {
    console.error("Save resume history error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not save resume history.",
    });
  }
}

module.exports = {
  getResumeHistory,
  createResumeHistory,
};
