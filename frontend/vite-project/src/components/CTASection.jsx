import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="relative overflow-hidden border-y border-indigo-100 bg-indigo-50 py-20">
      {/* Background Decorations */}

      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
          <Sparkles size={26} />
        </div>

        {/* Heading */}
        <h2 className="mt-7 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Ready to optimize your resume?
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Upload your resume, add a job description, and let AI help you
          create a more relevant and job-focused resume.
        </p>

        {/* CTA Button */}
        <div className="mt-9">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Optimize My Resume
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={17}  className="text-green-600"/>
            PDF & DOCX support
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-green-600"/>
            AI-powered analysis
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={17} className="text-green-600"/>
            ATS insights
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;