import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing details",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpswd = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedpswd,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,

        // optionally: creditBalance: user.creditBalance
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,

        // optionally: creditBalance: user.creditBalance
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const userCredits = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Taken from auth middleware

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found in db",
      });
    }

    return res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const userId= req.userId
    const {  planId } = req.body;

    console.log("Received request to create Razorpay order");
    console.log("Request body:", req.body); // 👈 LOG THIS

    console.log("User ID:", userId);
    console.log("Plan ID:", planId);

    const userData = await userModel.findById(userId);
    if (!userData || !planId) {
      return res.json({
        success: false,
        message: "Missing details",
      });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        credits = 100;
        amount = 10;
        plan = "Basic";
        break;
      case "Advanced":
        credits = 500;
        amount = 50;
        plan = "Advanced";
        break;
      case "Business":
        credits = 5000;
        amount = 250;
        plan = "Business";
        break;
      default:
        return res.json({
          success: false,
          message: "Invalid plan selected",
        });
    }

    const date = Date.now();
    const transactionData = { userId, plan, amount, credits, date };

    const newTransaction = await transactionModel.create(transactionData);
    console.log("Transaction saved in DB:", newTransaction._id);

    const options = {
      amount: amount * 100, // paise
      currency: process.env.CURRENCY || "INR",
      receipt: `${newTransaction._id}`,
    };

    console.log("Razorpay Order Options:", options);
    const order = await razorpayInstance.orders.create(options);
    console.log("Razorpay Order Created:", order);

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("🔴 Razorpay Order Creation Failed:", error);
    return res.json({
      success: false,
      message: error.message || "Order creation failed",
    });
  }
};

export { registerUser, loginUser, userCredits, paymentRazorpay };
