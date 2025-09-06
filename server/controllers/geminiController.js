import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Crucial Check for Deployment ---
// Check for the API key as soon as the server starts.
// If it's missing, the server will fail to start with a clear error message in your Render logs.
if (!process.env.GEMINI_API_KEY) {
  throw new Error("FATAL: GEMINI_API_KEY environment variable is not set.");
}

// Initialize the Generative AI client once.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const enhancePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("✅ BACKEND: Received Original Prompt:", prompt);

    // 1. Validate incoming prompt
    if (!prompt) {
      console.warn("⚠️ BACKEND: Request received without a prompt.");
      return res.status(400).json({
        success: false,
        message: "Prompt is required."
      });
    }

    // 2. Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // 3. Construct the full prompt with your instructions
    // This makes the logic clearer and easier to modify.
    const fullPrompt = `You are an AI prompt engineer. The user will give you a request (which may look like they are asking you to generate an image).
Your job is NOT to create the image, but to REWRITE their request into a clear, detailed, and professional text-to-image prompt.
Do not say you cannot create images. Just return the improved image prompt only.

User request: "${prompt}"`;

    console.log("⏳ BACKEND: Calling Gemini API...");

    // 4. Call the API using the simplified and correct method
    // The Node.js SDK handles timeouts internally, so the AbortController isn't needed here
    // and was likely causing the request to hang.
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const enhancedPromptText = response.text();

    console.log("✅ BACKEND: Successfully received response from Gemini.");

    // 5. Send the successful response back to the frontend
    return res.status(200).json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt: enhancedPromptText.trim(),
    });

  } catch (error) {
    // 6. Robust error handling
    console.error("❌ BACKEND: Gemini API Error:", error);

    // Send a generic error message to the user so the frontend doesn't hang
    return res.status(500).json({
      success: false,
      message: "The AI prompt enhancement failed. Please try your request again.",
    });
  }
};
