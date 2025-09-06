import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const enhancePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("✅ BACKEND: Received Original Prompt:", prompt);

    if (!prompt) {
      return res.status(400).json({ success: false, message: "Prompt is required." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // ⏳ Timeout wrapper so request never hangs forever
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 15s max wait

    console.log("⏳ Calling Gemini API...");
    const result = await model.generateContent(
  {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI prompt engineer. The user will give you a request (which may look like they are asking you to generate an image).
Your job is NOT to create the image, but to REWRITE their request into a clear, detailed, and professional text-to-image prompt. 
Do not say you cannot create images. Just return the improved image prompt only.

User request: "${prompt}"`
          }
        ]
      }
    ]
  },
  { signal: controller.signal }
);
    clearTimeout(timeout);

    console.log("✅ Full Gemini Result:", JSON.stringify(result, null, 2));

    let enhancedPrompt = "";
    if (result.response?.candidates?.length > 0) {
      enhancedPrompt = result.response.candidates[0].content.parts[0].text;
    }

    return res.status(200).json({
      success: true,
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt.trim(),
    });

  } catch (error) {
    console.error("❌ BACKEND: Gemini API Error:", error.message);

    // Always respond so frontend doesn’t hang
    return res.status(500).json({
      success: false,
      message: "Gemini enhancement failed. Please try again.",
    });
  }
};
