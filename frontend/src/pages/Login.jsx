import { useState, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  Link
} from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-6"
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Login
        </button>

        <p className="mt-5 text-center">
          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-600 ml-2"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;