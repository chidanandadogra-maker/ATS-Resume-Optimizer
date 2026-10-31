require("dotenv").config();
const connectDB = require("./config/db");
const generateResumePdf = require("./services/generateResumePdf");
const generateResumeDocx = require("./services/generateResumeDocx");
const protect = require("./middleware/authMiddleware");

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const parseResume = require("./utils/parseResume");
const optimizeResume = require("./services/geminiService");



const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOCX files are allowed"));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));


const Resume = require("./models/Resume");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
      res.json({ message: "ATS Resume Optimizer Backend is running" });
});




app.post(
  "/api/optimize",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log("========== OPTIMIZE DEBUG ==========");
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("File received:", !!req.file);
      console.log("File name:", req.file?.originalname);
      console.log("File MIME:", req.file?.mimetype);
      console.log("Body fields:", Object.keys(req.body || {}));
      console.log("====================================");

      if (!req.file) {
        console.error("UPLOAD ERROR: req.file is undefined");

        return res.status(400).json({
          success: false,
          message: "Resume file is required",
        });
      }

      if (!req.body.jobDescription?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Job description is required",
        });
      }

      const resumeText = await parseResume(req.file);

      if (!resumeText?.trim()) {
        return res.status(400).json({
          success: false,
          message: "No readable text found in resume",
        });
      }

      const aiResult = await optimizeResume(
        resumeText,
        req.body.jobDescription
      );

      return res.json({
        success: true,
        message: "Resume optimized successfully",
        ...aiResult,
      });

    } catch (error) {
      console.error("Resume optimization error:", error);

      return res.status(500).json({
        success: false,
        message: "Resume optimization failed",
      });
    }
  }
);



// app.post(
//   "/api/optimize",
//   protect,
//   upload.single("resume"),
//   async (req, res) => {
//     // Keep your existing optimization logic here
//   }
// );

function validateResumePayload(req, res, next) {
  const resume = req.body?.optimizedResume;

  if (
    !resume ||
    typeof resume !== "object" ||
    Array.isArray(resume)
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid optimized resume data is required.",
    });
  }

  req.resumeData = resume;
  next();
}

app.post(
  "/api/download/pdf",
  validateResumePayload,
  async (req, res) => {
    try {
      const pdfBuffer = await generateResumePdf(req.resumeData);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="optimized-resume.pdf"'
      );

      res.send(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to generate PDF.",
      });
    }
  }
);

app.post(
  "/api/download/docx",
  validateResumePayload,
  async (req, res) => {
    try {
      const docxBuffer = await generateResumeDocx(req.resumeData);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="optimized-resume.docx"'
      );

      res.send(docxBuffer);
    } catch (error) {
      console.error("DOCX generation error:", error);

      res.status(500).json({
        success: false,
        message: "Unable to generate DOCX.",
      });
    }
  }
);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
