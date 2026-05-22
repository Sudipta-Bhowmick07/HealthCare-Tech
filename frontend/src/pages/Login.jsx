import { useState, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response =
        await axios.post(
          "http://127.0.0.1:8000/auth/login",
          formData
        );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-100
      via-blue-100
      to-cyan-100
      px-4
      "
    >
      <div
        className="
        w-full
        max-w-md
        p-10
        rounded-[32px]
        bg-white/70
        backdrop-blur-2xl
        border
        border-white/40
        shadow-[0_20px_80px_rgba(0,0,0,0.12)]
        "
      >
        {/* Logo */}

        <div className="flex justify-center mb-6">
          <div
            className="
            w-20
            h-20
            rounded-3xl
            bg-gradient-to-r
            from-blue-600
            via-indigo-600
            to-cyan-500
            flex
            items-center
            justify-center
            shadow-xl
            "
          >
            <FaHeartbeat
              className="
              text-white
              text-4xl
              "
            />
          </div>
        </div>

        {/* Title */}

        <h1
          className="
          text-5xl
          font-extrabold
          text-center
          bg-gradient-to-r
          from-blue-600
          to-cyan-500
          bg-clip-text
          text-transparent
          "
        >
          MedAssist AI
        </h1>

        <p
          className="
          text-center
          text-gray-500
          mt-2
          mb-8
          "
        >
          Smart Healthcare Assistant
        </p>

        {/* Email */}

        <div className="relative mb-5">
          <FaEnvelope
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            z-10
            "
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="
            w-full
            pl-12
            pr-4
            py-4
            rounded-2xl
            bg-white/60
            backdrop-blur-md
            border
            border-white/50
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
            transition-all
            "
          />
        </div>

        {/* Password */}

        <div className="relative mb-6">
          <FaLock
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            z-10
            "
          />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="
            w-full
            pl-12
            pr-12
            py-4
            rounded-2xl
            bg-white/60
            backdrop-blur-md
            border
            border-white/50
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-500
            transition-all
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-blue-600
            transition
            "
          >
            {showPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>

        {/* Login Button */}

        <button
          onClick={handleLogin}
          className="
          w-full
          py-4
          rounded-2xl
          text-white
          font-semibold
          text-lg
          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-cyan-500
          shadow-lg
          hover:shadow-cyan-400/40
          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all
          duration-300
          "
        >
          Login
        </button>

        {/* Footer */}

        <p
          className="
          text-center
          text-gray-600
          mt-8
          "
        >
          Don't have an account?

          <Link
            to="/signup"
            className="
            ml-2
            font-semibold
            text-blue-600
            hover:text-cyan-500
            transition
            "
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;