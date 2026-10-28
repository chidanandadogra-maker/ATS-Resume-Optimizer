function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                ✦
              </div>

              <span className="text-lg font-bold text-white">
                ATS Resume Optimizer
              </span>
            </div>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              An AI-powered resume optimization platform that helps you
              tailor your resume to specific job descriptions and
              understand your ATS compatibility.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="#features"
                  className="transition hover:text-white"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="transition hover:text-white"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="transition hover:text-white"
                >
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Account
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href="/login"
                  className="transition hover:text-white"
                >
                  Login
                </a>
              </li>

              <li>
                <a
                  href="/register"
                  className="transition hover:text-white"
                >
                  Get Started
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-7 text-sm sm:flex-row sm:items-center sm:justify-between">

          <p className="text-slate-200">
            © 2026 ATS Resume Optimizer. All rights reserved.
          </p>

          <div className="flex gap-6 text-slate-300">
            <a
              href="#"
              className="transition hover:text-white"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;