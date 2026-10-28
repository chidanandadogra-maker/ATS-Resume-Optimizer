import React, { useState } from 'react'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  if (
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password ||
    !formData.confirmPassword
  ) {
    setError("Please fill in all fields.");
    return;
  }

  if (formData.password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    await register(
      formData.name.trim(),
      formData.email.trim(),
      formData.password
    );

    navigate("/dashboard");
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Registration failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50">

    {/* Top Brand */}
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center px-6 py-5 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles size={19} />
          </div>

          <span className="text-lg font-bold text-slate-900">
            ATS Resume Optimizer
          </span>
        </Link>
      </div>
    </div>

    {/* Register Area */}
    <main className="flex min-h-[calc(100vh-77px)] items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start optimizing your resume for your next opportunity.
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Full name
              </label>

              <div className="relative mt-2">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700"
              >
                Confirm password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm">
            <span className="text-slate-500">
              Already have an account?
            </span>{" "}

            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          By creating an account, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </main>
  </div>
);
}
export default Register