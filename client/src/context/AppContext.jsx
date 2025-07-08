import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const [credit, setCredit] = useState(5);
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/credits", {
        headers: {
          token,
        },
      });
      if (data.success) {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const generateImage = async (prompt) => {
    // ✅ FIXED: added prompt parameter
    try {
      const { data } = await axios.post(
        backendUrl + "/api/image/generate-image",
        { prompt },
        { headers: { token } }
      );
      if (data.success) {
        setCredit(data.creditBalance); // ✅ directly set updated credit
        return data.resultImage;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      loadCreditsData();
      if (error?.response?.data?.creditBalance === 0) {
        // ✅ FIXED: use error.response instead of undefined data
        navigate("/buy");
      }
    }
  };

  const value = {
    user,
    setUser,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
