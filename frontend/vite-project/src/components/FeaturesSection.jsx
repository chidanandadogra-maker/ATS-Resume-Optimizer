import {
  Brain,
  BarChart3,
  KeyRound,
  FileDown,
  FileText,
  ShieldCheck,
} from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Optimization",
      description:
        "Analyze your resume with AI and improve your content according to the requirements of your target job.",
    },
    {
      icon: BarChart3,
      title: "ATS Score Analysis",
      description:
        "Get an estimated ATS compatibility score and understand how closely your resume matches the job description.",
    },
    {
      icon: KeyRound,
      title: "Keyword Matching",
      description:
        "Identify important keywords from the job description and discover which ones are missing from your resume.",
    },
    {
      icon: FileText,
      title: "Resume Improvement",
      description:
        "Get AI-generated suggestions to improve your professional summary, skills, experience, and other sections.",
    },
    {
      icon: FileDown,
      title: "PDF & DOCX Export",
      description:
        "Download your optimized resume in professional PDF or DOCX format when your resume is ready.",
    },
    {
      icon: ShieldCheck,
      title: "Job-Focused Optimization",
      description:
        "Optimize your resume for a specific job description instead of using the same generic resume everywhere.",
    },
  ];

  return (
    <section id="features" className="border-t border-slate-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Powerful Features
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to build a stronger resume
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
           ATS Resume Optimizer combines AI analysis, ATS insights, and job-specific
            optimization to help you create a more relevant resume.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={24} />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;