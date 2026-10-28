import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    resumesOptimized: 0,
    averageAtsScore: "--",
    keywordsImproved: 0,
  });

  useEffect(() => {
    // Current logged-in user onujayi storage key
    const userHistoryKey = `atsResumeHistory_${user?._id || user?.email || "guest"}`;

    try {
      const saved = localStorage.getItem(userHistoryKey);
      const history = saved ? JSON.parse(saved) : [];

      if (Array.isArray(history) && history.length > 0) {
        const count = history.length;

        // Calculate Average ATS score
        const totalScore = history.reduce((acc, item) => {
          return acc + Number(item.result?.atsScore ?? 0);
        }, 0);
        const avgScore = Math.round(totalScore / count);

        // Calculate Keywords Improved / Matched
        const totalKeywords = history.reduce((acc, item) => {
          const matched = item.result?.matchedKeywords;
          return acc + (Array.isArray(matched) ? matched.length : 0);
        }, 0);

        setStats({
          resumesOptimized: count,
          averageAtsScore: `${avgScore}/100`,
          keywordsImproved: totalKeywords,
        });
      } else {
        setStats({
          resumesOptimized: 0,
          averageAtsScore: "--",
          keywordsImproved: 0,
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      setStats({
        resumesOptimized: 0,
        averageAtsScore: "--",
        keywordsImproved: 0,
      });
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p className="mt-2 text-slate-600">
            Optimize your resume and improve your chances of getting noticed.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">

          {/* Card 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Resumes Optimized
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.resumesOptimized}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileText size={21} />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Average ATS Score
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.averageAtsScore}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <TrendingUp size={21} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Keywords Improved
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats.keywordsImproved}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles size={21} />
              </div>
            </div>
          </div>

        </div>

        {/* Main CTA */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles size={23} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Optimize your resume with AI
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Upload your current resume and provide a job description.
              Our AI will analyze your resume, identify missing keywords,
              and suggest improvements tailored to the role.
            </p>

            <Link
              to="/optimize"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Start Optimizing
            </Link>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;