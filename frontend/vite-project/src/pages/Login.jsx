
import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Brand */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles size={19} />
            </div>
            <span className="text-lg font-bold text-slate-900">
              ATS Resume Optimizer
            </span>
          </Link>
        </div>
      </header>

      {/* Login Area */}
      <main className="flex min-h-[calc(100vh-77px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sign in to continue optimizing your resume.
            </p>
          </div>

          {/* Login Card */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            {error && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm">
              <span className="text-slate-500">
                Don't have an account?
              </span>{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Optimize your resume. Take the next step in your career.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
