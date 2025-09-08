import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  // State for the upload feature
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const { generateImage, token, user, setShowLogin } = useContext(AppContext);

  const handleEnhancePrompt = async () => {
    if (!input) {
      toast.info("Please enter a prompt to enhance.");
      return;
    }
    if (!user || !token) {
      toast.error("Please login to use the enhancer.");
      setShowLogin(true);
      return;
    }

    setIsEnhancing(true);
    try {
      const apiUrl = 'https://imagify-i23x.onrender.com/api/gemini/enhance-prompt';
      
      const response = await axios.post(apiUrl,
        { prompt: input },
        {
          headers: {
            'token': token
          }
        }
      );
      
      setInput(response.data.enhancedPrompt || input);
      toast.success("Prompt enhanced!");

    } catch (error) {
      console.error("❌ FRONTEND: Enhancer Error:", error);
      toast.error(error.response?.data?.message || "Failed to enhance prompt.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Please login to generate images");
      setShowLogin(true);
      return;
    }

    if (!input) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);

    const imageResult = await generateImage(input);
    if (imageResult) {
      setIsImageLoaded(true);
      setImage(imageResult);
    }

    setLoading(false);
  };

  // Google Drive Upload Logic
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsUploading(true);
      setUploadStatus("Saving to Drive...");
      try {
        const apiUrl = 'http://localhost:4000/api/drive/upload';
        const response = await axios.post(apiUrl, {
          code: codeResponse.code,
          imageData: image,
          imageName: `${input.slice(0, 30)}.png`
        });
        if (response.data.success) {
          setUploadStatus("✅ Saved successfully!");
          toast.success("Image saved to your Google Drive!");
        } else {
          setUploadStatus(`❌ Error: ${response.data.message}`);
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("❌ FRONTEND: Drive Upload Error:", error);
        setUploadStatus("❌ Network error.");
        toast.error(error.response?.data?.message || "Failed to upload to Drive.");
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadStatus(''), 4000);
      }
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/drive.file',
  });

  return (
    <motion.form
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onSubmit={onSubmitHandler}
      className="p-4 flex flex-col items-center justify-center min-h-screen"
    >
      {/* Image */}
      <div className="w-full max-w-md mb-0">
        <img
          className="rounded-xl w-full object-cover shadow-md"
          src={image}
          alt="Generated"
        />
      </div>

      {/* Blue line just stuck under image */}
      <div
        className={`${
          loading ? "w-full transition-all duration-[10s]" : "w-0"
        } max-w-md h-1 bg-blue-500`}
      />

      {/* Loading text below line */}
      {loading && (
        <p className="text-sm mt-2 text-gray-600 text-center mb-6">
          Generating... Please wait.
        </p>
      )}

      {/* Input bar with Enhance button */}
      {!isImageLoaded && (
        <div className="flex w-full max-w-xl bg-gray-200 text-sm p-1 mt-4 rounded-full items-center">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Describe what you want to generate"
            className="flex-1 bg-transparent outline-none px-4 py-2 placeholder:text-gray-500 text-gray-800"
          />
          
          <button
            type="button"
            onClick={handleEnhancePrompt}
            disabled={isEnhancing || loading}
            className="bg-purple-600 text-white px-5 sm:px-6 py-2 rounded-full hover:bg-purple-700 transition mx-1 disabled:bg-gray-400"
          >
            {isEnhancing ? "..." : "✨ Enhance"}
          </button>

          <button
            type="submit"
            disabled={isEnhancing || loading}
            className="bg-zinc-900 text-white px-10 sm:px-12 py-2 rounded-full hover:bg-zinc-800 transition disabled:bg-gray-400"
          >
            Generate
          </button>
        </div>
      )}

      {isImageLoaded && (
        <div className="flex flex-col items-center w-full">
            <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
                <p
                    onClick={() => {
                    setIsImageLoaded(false);
                    setInput(""); // Clear input when starting a new generation
                    }}
                    className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
                >
                    Generate Another
                </p>
                <a
                    href={image}
                    download
                    className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
                >
                    Download
                </a>
                {/* Save to Drive Button Added Here */}
                <button
                    type="button"
                    onClick={() => login()}
                    disabled={isUploading}
                    className="bg-blue-600 px-10 py-3 rounded-full cursor-pointer hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    {isUploading ? "Saving..." : "Save to Drive"}
                </button>
            </div>
            {uploadStatus && <p className="mt-4 text-sm text-gray-700">{uploadStatus}</p>}
        </div>
      )}
    </motion.form>
  );
};

export default Result;
