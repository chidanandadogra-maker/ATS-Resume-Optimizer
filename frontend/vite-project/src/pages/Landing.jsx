import { ArrowRight, CheckCircle2, Sparkles, Upload, FileText, LogIn } from "lucide-react";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CTASection from "../components/CTASection";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        
        {/* Background decoration */}
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* Left Content */}
          <div>
            {/* Small Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              <Sparkles size={16} />

              AI-Powered Resume Optimization
            </div>

            {/* Main Heading */}
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Make your resume
              <span className="text-indigo-600"> match your next opportunity.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Upload your resume, paste a job description, and let AI
              identify relevant keywords, improve your content, and
              generate a job-focused resume.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Optimize My Resume
                <ArrowRight size={18} />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                See How It Works
              </a>
            </div>

            {/* Trust Points */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                AI-powered analysis
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                PDF & DOCX export
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                Keyword insights
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            
            {/* Main Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">

              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Resume Analysis
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Full Stack Developer
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <FileText className="text-indigo-600" size={22} />
                </div>
              </div>

              {/* Score */}
              <div className="mt-8 rounded-xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Estimated ATS Match
                    </p>

                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      87%
                    </p>
                  </div>

                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-indigo-500">
                    <span className="text-sm font-bold text-slate-900">
                      87
                    </span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Keyword Analysis
                  </h3>

                  <span className="text-xs font-medium text-slate-500">
                    12 matched
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-green-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        React.js
                      </span>
                    </div>

                    <span className="text-xs font-medium text-green-600">
                      Matched
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-green-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Node.js
                      </span>
                    </div>

                    <span className="text-xs font-medium text-green-600">
                      Matched
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center gap-3">
                      <Upload
                        size={18}
                        className="text-amber-600"
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Docker
                      </span>
                    </div>

                    <span className="text-xs font-medium text-amber-600">
                      Missing
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
                <div>
                  <p className="text-xs text-slate-500">
                    Optimization status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-green-600">
                    Analysis complete
                  </p>
                </div>

                <div className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
                  View Results
                </div>
              </div>
            </div>

            {/* Small Floating Card */}
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                  <CheckCircle2
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Keywords found
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    12 matched
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <FeaturesSection /> 

      <HowItWorksSection /> 
      
      <CTASection />
      {/* Simple bottom section */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left lg:px-8">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Built for smarter job applications
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Analyze your resume against the requirements of each role.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-500">
            Resume → AI Analysis → Optimization
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;