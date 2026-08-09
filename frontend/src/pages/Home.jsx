import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  ScanSearch,
  GitBranch,
  BrainCircuit,
  ClipboardCopy,
  Check,
  FileBarChart2,
} from "lucide-react";

/* GitHub Octocat mark as a standalone component */
function GithubIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
import "./Home.css";
import Navbar from "../components/Navbar";

/* ── Animated percentage counter ─────────────────────────── */
function useCountUp(target, running, duration = 3000) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!running) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, target, duration]);

  return value;
}

/* ── Step definitions ─────────────────────────────────────── */
const STEPS = [
  { icon: FileText,    label: "Parsing resume"           },
  { icon: ScanSearch,  label: "Running ATS analysis"     },
  { icon: GitBranch,   label: "Fetching GitHub profile"  },
  { icon: BrainCircuit,label: "Generating career report" },
];

function StatusCard({ loading }) {
  const [activeStep, setActiveStep] = useState(0);
  const pct = useCountUp(92, loading, 5000);

  useEffect(() => {
    if (!loading) { setActiveStep(0); return; }
    const timings = [0, 1200, 2500, 4000];
    const timers = timings.map((delay, i) =>
      setTimeout(() => setActiveStep(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  return (
    <div className="status-card">
      <div className="status-header">
        <div className="status-indicator">
          <div className="pulse-dot" />
          <span className="status-label">Analyzing…</span>
        </div>
        <span className="status-pct">{pct}%</span>
      </div>

      <div className="status-steps">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isDone   = i < activeStep;
          const isActive = i === activeStep;
          return (
            <div
              key={i}
              className={`status-step${isDone ? " done" : isActive ? " active" : ""}`}
            >
              <div className="step-icon">
                {isDone
                  ? <CheckCircle2 size={12} strokeWidth={2.5} />
                  : <Icon size={12} strokeWidth={2} />
                }
              </div>
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────── */
function Home() {
  const [file, setFile]       = useState(null);
  const [github, setGithub]   = useState("asshu-06");
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);

  const analyzeResume = async () => {
    if (!file || !github.trim()) {
      // Non-intrusive: just highlight via shake — for now alert is acceptable
      alert("Please upload your resume and enter a GitHub username.");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("github_username", github.trim());

    try {
      const response = await API.post("/resume", formData);
      const data = response.data;
      let report = "";

      if (data.analysis) {
        const a = data.analysis;
        report = typeof a === "string"
          ? a
          : a.career_report ?? JSON.stringify(a, null, 2);
      } else if (data.career_report) {
        report = data.career_report;
      } else {
        report = JSON.stringify(data, null, 2);
      }

      setResult(report);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="home">
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <Sparkles size={11} strokeWidth={2.5} />
          AI Career Intelligence
        </div>
        <h1>
          Land your dream
          <br />
          <span>tech job faster</span>
        </h1>
        <p>
          Upload your resume and link your GitHub. CareerPilot runs ATS
          scoring, profile analysis, and generates a personalized career
          roadmap — in under a minute.
        </p>
      </section>

      {/* ── Upload card ── */}
      <div className="card">

        {/* Resume upload */}
        <div className="field">
          <label className="field-label" htmlFor="resume-upload">
            Resume
          </label>
          <label
            id="resume-upload"
            className={`upload-zone${file ? " has-file" : ""}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
          >
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0] ?? null)}
            />
            <div className="upload-icon-wrap">
              {file
                ? <FileText size={16} strokeWidth={2} />
                : <Upload size={16} strokeWidth={2} />
              }
            </div>
            <div className="upload-text">
              <strong>
                {file ? file.name : "Click to upload resume"}
              </strong>
              <span>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, DOC, DOCX"}
              </span>
            </div>
          </label>
        </div>

        {/* GitHub username */}
        <div className="field">
          <label className="field-label" htmlFor="github-username">
            GitHub Username
          </label>
          <div className="input-wrap">
            <GithubIcon size={15} />
            <input
              id="github-username"
              className="github-input"
              type="text"
              placeholder="username"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="card-divider" />

        {/* CTA */}
        <button
          className="analyze-btn"
          disabled={loading}
          onClick={analyzeResume}
        >
          {loading ? (
            <>
              <Sparkles size={15} strokeWidth={2} />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles size={15} strokeWidth={2} />
              Analyze with AI
            </>
          )}
        </button>
      </div>

      {/* ── Status ── */}
      {loading && <StatusCard loading={loading} />}

      {/* ── Report ── */}
      {!loading && result && (
        <div className="report-card">
          <div className="report-header">
            <div className="report-title">
              <FileBarChart2 size={15} strokeWidth={2} />
              Career Report
            </div>
            <div className="report-actions">
              <button
                className={`btn-ghost${copied ? " copied" : ""}`}
                onClick={handleCopy}
              >
                {copied
                  ? <><Check size={13} strokeWidth={2.5} /> Copied</>
                  : <><ClipboardCopy size={13} strokeWidth={2} /> Copy</>
                }
              </button>
            </div>
          </div>

          <div className="markdown-body">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
