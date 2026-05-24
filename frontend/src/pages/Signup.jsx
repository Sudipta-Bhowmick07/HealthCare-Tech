import { useState } from "react";
import axios from "axios";
import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  FaHeartbeat,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      await axios.post(
        "https://medassist-ai-backend-xyz6.onrender.com/auth/signup",
        formData
      );

      alert(
        "Signup successful"
      );

      navigate("/");
    } catch (error) {
      alert("Signup failed");
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
          Join MedAssist
        </h1>

        <p
          className="
          text-center
          text-gray-500
          mt-2
          mb-8
          "
        >
          Create your healthcare account
        </p>

        {/* Full Name */}

        <div className="relative mb-5">
          <FaUser
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
            type="text"
            name="full_name"
            placeholder="Full Name"
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

        {/* Signup Button */}

        <button
          onClick={handleSignup}
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
          Create Account
        </button>

        {/* Footer */}

        <p
          className="
          text-center
          text-gray-600
          mt-8
          "
        >
          Already have an account?

          <Link
            to="/"
            className="
            ml-2
            font-semibold
            text-blue-600
            hover:text-cyan-500
            transition
            "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;