import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EMPLOYEE_API_ENDPOINT } from "../../utils/constant";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(`${EMPLOYEE_API_ENDPOINT}/forgotpassword`, { email });

      if (response.status === 200) {
        setMessage("Password sent to your email");
        setEmail("");

        // Redirect after showing success message
        setTimeout(() => navigate("/LoginasEmployee"), 3000);
      }
    } catch (error) {
      console.error("Failed to send reset link:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || "Failed to send reset link.");
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-[50vh] max-h-[80vh] p-5 m-[8%] border-2 border-teal-600 shadow-lg rounded-3xl bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://img.stablecog.com/insecure/1920w/aHR0cHM6Ly9iLnN0YWJsZWNvZy5jb20vMTI0YmMzOTUtN2UyMC00YWVmLTkyNTMtNTFiNTQ5YzU2M2NjLmpwZWc.webp')" }}
    >
      <form onSubmit={handleSubmit} className="w-[70%] flex flex-col justify-center bg-white/0 p-5 rounded-2xl">
        <button 
          type="button" 
          onClick={() => navigate("/")} 
          className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Home
        </button>

        <label className="mb-2 font-bold text-white">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          className="w-full p-4 mb-4 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <button 
          type="submit" 
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Reset Password
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;