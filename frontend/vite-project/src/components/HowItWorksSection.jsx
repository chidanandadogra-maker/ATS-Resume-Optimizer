import {
      Upload,
      ClipboardList,
      Sparkles,
      Download,
      ArrowRight,
    } from "lucide-react";
    
    function HowItWorksSection() {
      const steps = [
        {
          number: "01",
          icon: Upload,
          title: "Upload Your Resume",
          description:
            "Upload your existing resume in PDF or DOCX format. Your resume will be processed and prepared for analysis.",
        },
        {
          number: "02",
          icon: ClipboardList,
          title: "Add the Job Description",
          description:
            "Paste the job description of the role you want to apply for so the system can understand the job requirements.",
        },
        {
          number: "03",
          icon: Sparkles,
          title: "AI Optimizes Your Resume",
          description:
            "Our AI analyzes the resume and job description to identify keywords, gaps, and areas that can be improved.",
        },
        {
          number: "04",
          icon: Download,
          title: "Download Your Resume",
          description:
            "Review the optimization results and download your improved resume in PDF or DOCX format.",
        },
      ];
    
      return (
        <section
          id="how-it-works"
          className="border-t border-slate-200 bg-slate-50 py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
    
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                How It Works
              </p>
    
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Optimize your resume in four simple steps
              </h2>
    
              <p className="mt-5 text-lg leading-8 text-slate-600">
                From your existing resume to a job-focused version, the entire
                workflow is designed to be simple and easy to understand.
              </p>
            </div>
    
            {/* Steps */}
            <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
    
              {steps.map((step, index) => {
                const Icon = step.icon;
    
                return (
                  <div key={step.number} className="relative">
    
                    {/* Connector */}
                    {index !== steps.length - 1 && (
                      <div className="absolute left-[calc(50%+45px)] top-10 hidden h-px w-[calc(100%-60px)] bg-slate-200 lg:block" />
                    )}
    
                    {/* Step Card */}
                    <div className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
    
                      {/* Number */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-indigo-600">
                          {step.number}
                        </span>
    
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Icon size={22} />
                        </div>
                      </div>
    
                      {/* Content */}
                      <h3 className="mt-6 text-lg font-semibold text-slate-900">
                        {step.title}
                      </h3>
    
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
    
                      {/* Arrow */}
                      {index !== steps.length - 1 && (
                        <div className="mt-6 hidden items-center gap-2 text-xs font-medium text-indigo-600 lg:flex">
                          Next step
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }
    
    export default HowItWorksSection;