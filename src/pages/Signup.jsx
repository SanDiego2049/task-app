import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loadingToastId = toast.loading("Creating account...");

    try {
      const response = await fetch("https://taskapp-self.vercel.app/users/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", email);
      body.append("password", password);
      body.append("client_id", "string");
      body.append("client_secret", "string");

      const loginResponse = await fetch(
        "https://taskapp-self.vercel.app/token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Login after registration failed");
      }

      const loginData = await loginResponse.json();
      localStorage.setItem("access_token", loginData.access_token);

      toast.success("Account created! Redirecting...", { id: loadingToastId });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");

      toast.error("Signup failed. Please try again.", { id: loadingToastId });

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create an Account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          {/* <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div> */}

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
              tabIndex={-1} // important: don't let button steal tab focus
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
                Signing up...
              </div>
            ) : (
              <>
                <UserPlus size={20} />
                Sign Up
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

        {/* Google Signup Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition-transform hover:scale-105"
        >
          <FcGoogle size={24} />
          <span className="font-semibold">Sign Up with Google</span>
        </button>

        {/* Link to Login */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-1"
          >
            <LogIn size={18} />
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
