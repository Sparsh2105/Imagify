import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error("Please enter a valid email address.");
          return;
        }
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message;

      toast.error(message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium ">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>
        {state !== "Login" && (
          <div className=" border px-6 py-2 flex items-center gap-2 rounded-full mt-4 ">
            <img src={assets.profile_icon} alt="" className="w-6 h-6" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className=" outline-none text-sm"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className=" border px-6 py-2 flex items-center gap-2 rounded-full mt-4 ">
          <img src={assets.email_icon} alt="" className="w-6 h-6" />
          <input
            className=" outline-none text-sm"
            type="email"
            placeholder="Email Id"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className=" border px-6 py-2 flex items-center gap-2 rounded-full mt-4 ">
          <img src={assets.lock_icon} alt="" className="w-6 h-6" />
          <input
            className=" outline-none text-sm"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot Password?
        </p>

        <button className="bg-blue-600 w-full text-white py-2 rounded-full">
          {state === "Login" ? "Login" : "create account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Sign Up")}
            >
              Sign up
            </span>{" "}
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-600 cursor-pointer"
            >
              Login
            </span>{" "}
          </p>
        )}

        <img
          src={assets.cross_icon}
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 cursor-pointer"
          alt=""
        />
      </motion.form>
    </div>
  );
};

export default Login;
