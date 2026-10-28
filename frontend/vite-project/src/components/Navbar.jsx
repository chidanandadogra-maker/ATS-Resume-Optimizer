import { Link } from "react-router-dom";
import { Sparkles, Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={22} />

          <span className="text-xl font-bold text-slate-900">
            ATS Resume Optimizer
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            How It Works
          </a>

          <a
            href="#footer"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            About
          </a>
        </div>

        {/* Authentication Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="text-slate-700 md:hidden"
          aria-label="Open menu"
        >
          <Menu size={25} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;