import axios from 'axios';
import userModel from '../models/userModel.js';

const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // 1️⃣ Check missing inputs
    if (!userId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or prompt"
      });
    }

    // 2️⃣ Validate user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3️⃣ Check credit balance
    if (user.creditBalance <= 0) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits",
        creditBalance: user.creditBalance
      });
    }

    // 4️⃣ Call Freepik API
    const response = await axios.post(
      'https://api.freepik.com/v1/ai/text-to-image',
      { prompt },
      {
        headers: {
          'x-freepik-api-key': process.env.FREEPIK_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    const imageSrcList = response.data.data.map(img => `data:image/png;base64,${img.base64}`);

    // 5️⃣ Deduct 1 credit
    user.creditBalance -= 1;
    await user.save();

    // 6️⃣ Return images + updated balance
    res.json({
      success: true,
      images: imageSrcList,
      remainingCredits: user.creditBalance,
      meta: response.data.meta
    });

  } catch (error) {
    console.error("Freepik API Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message
    });
  }
};

export default generateImage;
