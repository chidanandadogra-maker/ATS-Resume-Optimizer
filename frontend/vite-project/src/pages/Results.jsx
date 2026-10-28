import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LoaderCircle,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  Award,
  Lightbulb,
  Target,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import ResumePreview from "../components/ResumePreview";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state;
  const resume = result?.optimizedResume;

  const [downloading, setDownloading] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const atsScore = Number(result?.atsScore ?? 0);
  const matchedKeywords = Array.isArray(result?.matchedKeywords)
    ? result.matchedKeywords
    : [];
  const missingKeywords = Array.isArray(result?.missingKeywords)
    ? result.missingKeywords
    : [];
  const suggestions = Array.isArray(result?.suggestions)
    ? result.suggestions
    : [];

  const formatItem = (item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      return (
        item.name ||
        item.title ||
        item.skill ||
        item.description ||
        JSON.stringify(item)
      );
    }
    return String(item ?? "");
  };

  const downloadResume = async (format) => {
    if (!resume || downloading) return;

    try {
      setDownloading(format);
      setDownloadError("");

      const response = await api.post(
        `/api/download/${format}`,
        { optimizedResume: resume },
        { responseType: "blob" }
      );

      const mimeType =
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      const blob = new Blob([response.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `optimized-resume.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Resume download failed:", error);
      setDownloadError(
        `Unable to download ${format.toUpperCase()}. Check that your backend is running and the download route is configured correctly.`
      );
    } finally {
      setDownloading("");
    }
  };

  if (!resume) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />

            <h1 className="text-2xl font-bold text-slate-900">
              No Resume Results Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Please optimize your resume first. Your results may be unavailable
              if you opened this page directly or refreshed it.
            </p>

            <button
              type="button"
              onClick={() => navigate("/optimize")}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to Resume Optimizer
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const scoreColor =
    atsScore >= 80
      ? "text-emerald-600"
      : atsScore >= 60
        ? "text-amber-600"
        : "text-rose-600";

  const scoreMessage =
    atsScore >= 80
      ? "Strong keyword alignment"
      : atsScore >= 60
        ? "Some improvements recommended"
        : "More tailoring may be needed";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/optimize")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Back to Optimizer
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles size={14} />
                AI Resume Analysis
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Your Resume Results
              </h1>

              <p className="mt-2 text-sm text-slate-600">
                Review your resume, check keyword alignment, and download your
                optimized version.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => downloadResume("pdf")}
                disabled={Boolean(downloading)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloading === "pdf" ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Download size={17} />
                )}
                {downloading === "pdf" ? "Generating PDF..." : "Download PDF"}
              </button>

              <button
                type="button"
                onClick={() => downloadResume("docx")}
                disabled={Boolean(downloading)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloading === "docx" ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <FileText size={17} />
                )}
                {downloading === "docx" ? "Generating DOCX..." : "Download DOCX"}
              </button>
            </div>
          </div>

          {downloadError && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{downloadError}</p>
            </div>
          )}
        </div>

        {/* ATS score and role */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-1">
            <p className="text-sm font-medium text-slate-500">
              Estimated ATS Score
            </p>

            <div className="mt-4 flex items-end gap-2">
              <span className={`text-5xl font-bold ${scoreColor}`}>
                {atsScore}
              </span>
              <span className="mb-1 text-lg text-slate-400">/ 100</span>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  atsScore >= 80
                    ? "bg-emerald-500"
                    : atsScore >= 60
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, atsScore))}%` }}
              />
            </div>

            <p className={`mt-3 text-sm font-medium ${scoreColor}`}>
              {scoreMessage}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              This is an AI-generated estimate, not a guaranteed score from an
              actual applicant tracking system.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <Target size={24} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  Target Job Role
                </p>

                <h2 className="mt-2 wrap-break-word text-2xl font-bold text-slate-900">
                  {result?.targetRole || "Target role not specified"}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Your resume has been processed against the job description.
                  Review the matched and missing keywords below before applying.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">Matched Keywords</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-emerald-700">
                  {matchedKeywords.length}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">Missing Keywords</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-amber-700">
                  {missingKeywords.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Keyword analysis */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={22} />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Matched Keywords
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Skills or terms identified in your resume.
                </p>
              </div>
            </div>

            {matchedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((item, index) => (
                  <span
                    key={`${formatItem(item)}-${index}`}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                  >
                    {formatItem(item)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No matched keywords were returned.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <AlertCircle className="text-amber-600" size={22} />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Missing Keywords
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review these against your real skills and experience.
                </p>
              </div>
            </div>

            {missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {missingKeywords.map((item, index) => (
                  <span
                    key={`${formatItem(item)}-${index}`}
                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800"
                  >
                    {formatItem(item)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                No missing keywords were returned.
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Do not add a keyword to your resume unless it accurately
              represents your skills or experience.
            </p>
          </section>
        </div>

        {/* Optimized resume preview */}
        {/* Optimized resume preview */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Optimized Resume
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Preview of the resume that will be exported.
            </p>
          </div>

          <ResumePreview resume={resume} />
        </section>

        {/* Improvement suggestions */}
        <section className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-white p-2.5 text-indigo-600 shadow-sm">
              <Lightbulb size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Improvement Suggestions
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Recommendations from your resume analysis.
              </p>
            </div>
          </div>

          {suggestions.length > 0 ? (
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-white p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />
                  <span className="text-sm leading-6 text-slate-700">
                    {formatItem(suggestion)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-6 text-slate-600">
              No additional suggestions were returned. Review the job
              description and make sure every claim in your resume is accurate.
            </p>
          )}
        </section>

        {/* Bottom actions */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-900">
              Ready to use your resume?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Check the details carefully before sending it to an employer.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/optimize")}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Optimize Another Resume
            </button>

            {/* Separate PDF and DOCX download buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => downloadResume("pdf")}
                      disabled={Boolean(downloading)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {downloading === "pdf" ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <Download size={17} />
                      )}
                      {downloading === "pdf" ? "Generating PDF..." : "Download PDF"}
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadResume("docx")}
                      disabled={Boolean(downloading)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {downloading === "docx" ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <FileText size={17} />
                      )}
                      {downloading === "docx" ? "Generating DOCX..." : "Download DOCX"}
                    </button>
                  </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Results;