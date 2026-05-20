import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/signup",
        formData
      );

      alert("Signup successful");

      navigate("/");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl w-[400px]">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Signup
        </h1>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
        />

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
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Signup
        </button>

        <p className="mt-5 text-center">
          Already have an account?
          <Link
            to="/"
            className="text-blue-600 ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;