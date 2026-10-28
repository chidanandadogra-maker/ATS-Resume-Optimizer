import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  History as HistoryIcon,
  FileText,
  Eye,
  Trash2,
  ArrowRight,
  CalendarDays,
  Target,
  AlertCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

function History() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  // Logged-in user-er email ba ID onujayi isolated storage key
  const userHistoryKey = `atsResumeHistory_${user?._id || user?.email || "guest"}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(userHistoryKey);
      const parsed = saved ? JSON.parse(saved) : [];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Unable to read resume history:", error);
      setHistory([]);
    }
  }, [userHistoryKey]);

  const deleteItem = (id) => {
    const updatedHistory = history.filter((item) => item.id !== id);

    try {
      localStorage.setItem(userHistoryKey, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      setMessage("Resume history deleted.");
    } catch (error) {
      console.error("Unable to delete history:", error);
      setMessage("Unable to update history. Please try again.");
    }
  };

  const clearHistory = () => {
    if (history.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all saved resume history?"
    );

    if (!confirmed) return;

    try {
      localStorage.removeItem(userHistoryKey);
      setHistory([]);
      setMessage("All resume history has been cleared.");
    } catch (error) {
      console.error("Unable to clear history:", error);
      setMessage("Unable to clear history. Please try again.");
    }
  };

  const viewResult = (item) => {
    navigate("/results", { state: item.result });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-600">
              <HistoryIcon size={20} />
              <span className="text-sm font-semibold">Your Activity</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Resume History
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              View your previously optimized resumes and their ATS scores.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/optimize")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Optimize New Resume
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Status message */}
        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600"
          >
            {message}
          </div>
        )}

        {/* History summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileText size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">Saved Resumes</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {history.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Target size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-500">Latest ATS Score</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {history.length > 0
                    ? `${history[0].result?.atsScore ?? 0}/100`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* History list */}
        {history.length > 0 ? (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">
                  Previous Optimizations
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your saved resume analysis results.
                </p>
              </div>

              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 sm:self-auto"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {history.map((item) => {
                const result = item.result || {};
                const score = Number(result.atsScore ?? 0);

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                        <FileText size={23} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="wrap-break-word font-semibold text-slate-900">
                          {result.targetRole || "Resume Optimization"}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={15} />
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : "Date unavailable"}
                          </span>

                          <span>
                            {Array.isArray(result.matchedKeywords)
                              ? result.matchedKeywords.length
                              : 0}{" "}
                            matched keywords
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <div className="mr-1">
                        <p className="text-xs text-slate-500">ATS Score</p>
                        <p
                          className={`mt-1 text-xl font-bold ${
                            score >= 80
                              ? "text-emerald-600"
                              : score >= 60
                                ? "text-amber-600"
                                : "text-rose-600"
                          }`}
                        >
                          {score}/100
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => viewResult(item)}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        aria-label="Delete this resume history item"
                        title="Delete history"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <HistoryIcon size={30} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No Resume History Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Once you optimize a resume, the result will appear here so you
              can view it again later.
            </p>

            <button
              type="button"
              onClick={() => navigate("/optimize")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Optimize Your First Resume
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          <AlertCircle size={18} className="mt-1 shrink-0" />
          <p>
            This version saves history isolated to your current user account in browser storage.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default History;