import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", email);
      body.append("password", password);
      body.append("client_id", "string");
      body.append("client_secret", "string");

      const response = await fetch("https://taskapp-self.vercel.app/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("access_token", data.access_token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email Address</label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-13 transform -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-transform ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700 hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="loader border-white"></span>
                Logging in...
              </div>
            ) : (
              <>
                <LogIn size={20} />
                Log In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 font-semibold">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition-transform hover:scale-105"
        >
          <FcGoogle size={24} />
          <span className="font-semibold">Log In with Google</span>
        </button>

        {/* Link to Signup */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1"
          >
            <UserPlus size={18} />
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
