import userModel from "../models/userModel.js";
import FormData from "form-data"; // ✅ Correct casing
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const userId = req.userId; // ✅ using your preferred style

    console.log("prompt:", prompt);
    console.log("userId (from token):", userId);

    if (!userId || !prompt) {
      return res.json({
        success: false,
        message: `Missing details: userId = ${userId}, prompt = ${prompt}`,
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(), // ✅ now this works
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(userId, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image generated",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log("❌ Error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
