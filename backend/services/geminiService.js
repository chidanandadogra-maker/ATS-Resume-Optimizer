
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

// Wait helper
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Retry Gemini request for temporary errors
async function generateWithRetry(
  model,
  prompt,
  maxAttempts = 3
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `Gemini API request: attempt ${attempt}/${maxAttempts}`
      );

      return await model.generateContent(prompt);
    } catch (error) {
      const retryableStatuses = [
        429, 500, 502, 503, 504,
      ];

      const shouldRetry = retryableStatuses.includes(
        error.status
      );

      if (!shouldRetry || attempt === maxAttempts) {
        throw error;
      }

      // Wait 1 second, then 2 seconds
      const delay = 1000 * 2 ** (attempt - 1);

      console.log(
        `Gemini returned ${error.status}. ` +
        `Retrying in ${delay / 1000} second(s)...`
      );

      await sleep(delay);
    }
  }

  throw new Error("Gemini request failed after retries");
}

// Main resume optimization function
async function optimizeResume(resumeText, jobDescription) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing from the backend .env file"
    );
  }

  if (!resumeText || !resumeText.trim()) {
    throw new Error("Resume text is empty");
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new Error("Job description is empty");
  }

  const model = genAI.getGenerativeModel({
    model:
      process.env.GEMINI_MODEL || "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const prompt = `
You are a senior resume consultant, ATS specialist,
technical recruiter, and software engineering career mentor.

Your task is to optimize the candidate's resume for the
provided target job description.

TARGET JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME:
${resumeText}


IMPORTANT RULES:
1. Treat the original resume as the source of truth for candidate facts.
2. Never invent skills, employers, education, certifications,
   dates, responsibilities, achievements, or metrics.
3. Analyze the job description before drafting the resume.
4. Classify JD keywords as essential, supporting, or preferred.
5. Match keywords against the original resume semantically,
   not only through exact word matching.
6. Include a keyword in the optimized resume only when the
   original resume provides evidence that supports it.
7. If a skill is relevant but unsupported by the resume,
   report it as a genuine gap. Do not falsely claim proficiency.
8. Rephrase existing experience and project bullets to emphasize
   relevant work without changing the underlying facts.
9. Prioritize the most relevant real skills and projects.
10. Preserve original contact details, institutions, dates,
    and qualifications.
11. Use concise action-oriented bullets when supported by facts.
12. Return valid JSON only. Do not return Markdown code fences.
13. Estimate ATS alignment honestly. Keywords alone must not
    produce an artificially high score.
14. Keep the resume single-column and ATS-readable.
15. Use one page when the content remains readable; otherwise,
    allow a second page instead of shrinking text excessively.
16. Do not add unsupported claims simply to increase the score.
17. Include clarificationQuestions for important missing facts
    that the candidate should confirm.


Return JSON matching this exact structure:
{
  "targetRole": "",
  "jdAnalysis": {
    "essentialKeywords": [],
    "supportingKeywords": [],
    "preferredKeywords": [],
    "responsibilities": [],
    "educationRequirements": [],
    "experienceRequirements": []
  },
  "candidateMatch": {
    "matchedSkills": [],
    "relevantExperience": [],
    "relevantProjects": [],
    "genuineGaps": [],
    "eligibilityConcerns": []
  },
  "atsScore": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": [],
  "optimizedResume": {
    "fullName": "",
    "contactLine": "",
    "professionalSummary": "",
    "technicalSkills": [
      {
        "category": "",
        "skills": []
      }
    ],
    "experience": [
      {
        "position": "",
        "organization": "",
        "dates": "",
        "bullets": []
      }
    ],
    "projects": [
      {
        "name": "",
        "technologies": [],
        "bullets": []
      }
    ],
    "education": [
      {
        "degree": "",
        "institution": "",
        "dates": "",
        "grade": ""
      }
    ],
    "certifications": [],
    "achievements": []
  },
  "formattingRecommendations": {
    "layout": "Single-column",
    "font": "Readable professional serif font",
    "fontSize": "Readable body text with clear headings",
    "margins": "Balanced professional margins",
    "sectionStyle": "Bold headings and thin horizontal rules",
    "pageLength": "One page if legible; otherwise two pages"
  },
  "qualityAudit": {
    "keywordAlignment": "",
    "atsReadability": "",
    "technicalAccuracy": "",
    "grammarAndConsistency": "",
    "recruiterReadability": "",
    "unsupportedClaims": [],
    "interviewTopics": []
  },
  "clarificationQuestions": []
}

ATS SCORE:
Estimate alignment using the job requirements, relevant
skills, experience, and projects actually supported by the
resume. Do not give a perfect score merely because keywords
are present. Explain important limitations in suggestions.

KEYWORD ANALYSIS:
- matchedKeywords: skills or terms genuinely supported by
  the resume and relevant to the job.
- missingKeywords: relevant requirements not evidenced by
  the resume. Do not imply that the candidate has them.

RESUME FORMATTING:
- Keep the resume professional and ATS-readable.
- Use concise bullet points beginning with strong action verbs
  when supported by the original information.
- Put relevant projects and technical skills prominently
  for entry-level software development roles.
- Preserve real contact details and dates when provided.
- Do not add a photo, icons, tables, or multiple columns.

Return a single valid JSON object with the requested fields.
`;

  // Call Gemini with retry
  const result = await generateWithRetry(model, prompt);

  const responseText = result.response.text();

  if (!responseText || !responseText.trim()) {
    throw new Error("Gemini returned an empty response");
  }

  // Remove optional Markdown fences, if present
  const cleanedText = responseText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  // Parse JSON safely
  let data;

  try {
    data = JSON.parse(cleanedText);
  } catch (error) {
    console.error(
      "Gemini returned invalid JSON:",
      responseText
    );

    throw new Error(
      "Gemini returned an invalid JSON response"
    );
  }

  // Basic response validation
  if (
    !data ||
    typeof data !== "object" ||
    !data.optimizedResume ||
    typeof data.optimizedResume !== "object"
  ) {
    throw new Error(
      "Gemini response is missing optimizedResume data"
    );
  }

  // Normalize score
  const score = Number(data.atsScore);

  data.atsScore = Number.isFinite(score)
    ? Math.max(0, Math.min(100, score))
    : 0;

  // Ensure important array fields have safe defaults
  data.matchedKeywords = Array.isArray(data.matchedKeywords)
    ? data.matchedKeywords
    : [];

  data.missingKeywords = Array.isArray(data.missingKeywords)
    ? data.missingKeywords
    : [];

  data.suggestions = Array.isArray(data.suggestions)
    ? data.suggestions
    : [];

  console.log("Resume optimization completed successfully");

  return data;
}

module.exports = optimizeResume;
