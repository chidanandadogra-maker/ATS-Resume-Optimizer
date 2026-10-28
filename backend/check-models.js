// backend/check-models.js
require("dotenv").config();

async function listSupportedModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY পাওয়া যায়নি .env ফাইলে!");
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      return;
    }

    console.log("=== আপনার API Key-তে উপলব্ধ মডেলসমূহ ===");
    const available = data.models
      ?.filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m) => m.name.replace("models/", ""));

    console.log(available);
  } catch (err) {
    console.error("Fetch Error:", err.message);
  }
}

listSupportedModels();