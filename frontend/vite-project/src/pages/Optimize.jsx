
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  X,
  Sparkles,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

function Optimize() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
  
    if (file) {
      processResumeFile(file);
    }
  
    // Allows selecting the same file again
    if (e.target) {
      e.target.value = "";
    }
  };
  
  const processResumeFile = (file) => {
    setError("");
    setSuccessMessage("");
  
    const extension = file.name.split(".").pop().toLowerCase();
  
    if (!["pdf", "docx"].includes(extension)) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume size must be less than 5MB.");
      return;
    }
  
    setResume(file);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!loading) setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
  
    if (loading) return;
  
    const file = e.dataTransfer.files?.[0];
  
    if (file) {
      processResumeFile(file);
    }
  };

  const removeResume = () => {
    setResume(null);
    setError("");
    setSuccessMessage("");
  };

  const handleOptimize = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccessMessage("");

    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      console.log("Sending data to backend...");

      const response = await api.post(
        "/api/optimize",
        formData
      );

      console.log("Backend response:", response.data);

      if (
        !response.data?.success ||
        !response.data?.optimizedResume
      ) {
        throw new Error(
          response.data?.message ||
            "The server returned an incomplete result."
        );
      }

      setSuccessMessage("Resume optimized successfully!");
        
      const historyKey = `atsResumeHistory_${user?._id || user?.email || "guest"}`;

      const savedHistory = JSON.parse(
        localStorage.getItem(historyKey) || "[]"
      );
      
      const historyItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        result: response.data,
      };
      
      localStorage.setItem(
        historyKey,
        JSON.stringify([historyItem, ...savedHistory].slice(0, 20))
      );
      
      // Send the AI result to the Results page.
      navigate("/results", {
        state: response.data,
      });
    } catch (err) {
      console.error(
        "Optimization failed:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Resume optimization failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Optimize Resume
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Optimize your resume
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Upload your resume and provide the job description.
            Our AI will tailor your resume for the target role.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div
            role="status"
            className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <CheckCircle2 size={20} />
            <p>{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleOptimize}
          className="mt-8 max-w-4xl space-y-6"
        >
          {/* Resume Upload */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Upload your resume
                </h2>

                <p className="text-sm text-slate-500">
                  PDF or DOCX files are supported
                </p>
              </div>
            </div>

       {!resume ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
              isDragging
                ? "border-indigo-500 bg-indigo-50"
                : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30"
            } ${loading ? "pointer-events-none opacity-60" : ""}`}
          >
            <Upload
              size={32}
              className={isDragging ? "text-indigo-600" : "text-slate-400"}
            />

            <p className="mt-3 text-sm font-semibold text-slate-800">
              {isDragging
                ? "Drop your resume here"
                : "Drag and drop your resume here"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              or click below to browse files
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              Browse Files
            </button>

            <p className="mt-3 text-xs text-slate-500">
              PDF or DOCX · Maximum 5 MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeChange}
              className="hidden"
              disabled={loading}
            />
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                <FileText size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {resume.name}
                </p>

                <p className="text-xs text-slate-500">
                  {(resume.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="ml-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Replace
              </button>

              <button
                type="button"
                onClick={removeResume}
                disabled={loading}
                aria-label="Remove resume"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeChange}
              className="hidden"
              disabled={loading}
            />
          </div>
      )}
          </div>

          {/* Job Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Job Description
                </h2>

                <p className="text-sm text-slate-500">
                  Paste the job description for the role
                </p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
              placeholder="Paste the job description here..."
              rows={10}
              disabled={loading}
              className="mt-5 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />

            <div className="mt-2 flex justify-end">
              <span className="text-xs text-slate-400">
                {jobDescription.length} characters
              </span>
            </div>
          </div>

          {/* Optimize Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                !resume ||
                !jobDescription.trim() ||
                loading
              }
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Optimize Resume
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default Optimize;
