import express from "express";
import { enhancePrompt } from "../controllers/geminiController.js";
import userAuth from "../middlewares/authMiddleware.js";

const geminiRouter=express.Router();
geminiRouter.post("/enhance-prompt", userAuth, enhancePrompt);

export default geminiRouter;
