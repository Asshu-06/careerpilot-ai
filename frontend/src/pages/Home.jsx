import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import API from "../services/api";
import Dashboard from "../components/Dashboard/Dashboard";
import {
  Sparkles, FileText, Upload, CheckCircle2,
  ScanSearch, GitBranch, BrainCircuit, User, Briefcase,
  AlertCircle, FileUp,
} from "lucide-react";
import "./Home.css";
import Navbar from "../components/Navbar";

/* ── GitHub SVG ──────────────────────────────────────────────── */
function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/* ── Count-up hook ───────────────────────────────────────────── */
function useCountUp(target, running, duration = 3000) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!running) { setValue(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, target, duration]);
  return value;
}

/* ── Loading steps ───────────────────────────────────────────── */
const STEPS_PROFILE = [
  { icon: FileText,     label: "Parsing resume"           },
  { icon: ScanSearch,   label: "Running ATS analysis"     },
  { icon: GitBranch,    label: "Fetching GitHub profile"  },
  { icon: BrainCircuit, label: "Generating career report" },
];
const STEPS_JOB = [
  { icon: FileText,     label: "Parsing resume"             },
  { icon: Briefcase,    label: "Reading job description"    },
  { icon: ScanSearch,   label: "Matching skills & keywords" },
  { icon: BrainCircuit, label: "Generating job fit report"  },
];

function StatusCard({ loading, mode }) {
  const [activeStep, setActiveStep] = useState(0);
  const pct = useCountUp(92, loading, 5000);
  const STEPS = mode === "job" ? STEPS_JOB : STEPS_PROFILE;

  useEffect(() => {
    if (!loading) { setActiveStep(0); return; }
    const timers = [0, 1200, 2500, 4000].map((d, i) => setTimeout(() => setActiveStep(i), d));
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
          const isDone = i < activeStep, isActive = i === activeStep;
          return (
            <div key={i} className={`status-step${isDone ? " done" : isActive ? " active" : ""}`}>
              <div className="step-icon">
                {isDone ? <CheckCircle2 size={12} strokeWidth={2.5} /> : <Icon size={12} strokeWidth={2} />}
              </div>
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Mode toggle cards ───────────────────────────────────────── */
function ModeToggle({ mode, onChange }) {
  return (
    <div className="mode-toggle">
      <div className="mode-toggle-label">Choose Analysis Type</div>
      <div className="mode-toggle-grid">
        {[
          {
            id: "profile",
            icon: User,
            title: "Analyze My Profile",
            sub: "Resume + GitHub",
          },
          {
            id: "job",
            icon: Briefcase,
            title: "Analyze for a Job",
            sub: "Resume + GitHub + Job Description",
          },
        ].map((opt) => {
          const Icon = opt.icon;
          const selected = mode === opt.id;
          return (
            <button
              key={opt.id}
              className={`mode-option${selected ? " selected" : ""}`}
              onClick={() => onChange(opt.id)}
              type="button"
            >
              <div className="mode-option-left">
                <div className={`mode-radio${selected ? " checked" : ""}`}>
                  {selected && <div className="mode-radio-dot" />}
                </div>
                <div className="mode-option-icon">
                  <Icon size={15} strokeWidth={2} />
                </div>
                <div>
                  <div className="mode-option-title">{opt.title}</div>
                  <div className="mode-option-sub">{opt.sub}</div>
                </div>
              </div>
              {selected && (
                <CheckCircle2 size={15} strokeWidth={2.5} className="mode-check" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Inline error message ────────────────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div className="field-error">
      <AlertCircle size={12} strokeWidth={2} />
      {msg}
    </div>
  );
}

/* ── Home ────────────────────────────────────────────────────── */
export default function Home() {
  const [mode, setMode]             = useState("profile"); // "profile" | "job"
  const [file, setFile]             = useState(null);
  const [github, setGithub]         = useState("asshu-06");
  const [jdText, setJdText]         = useState("");
  const [jdFile, setJdFile]         = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  /* Reset JD fields when switching modes */
  const handleModeChange = (m) => {
    setMode(m);
    setErrors({});
  };

  /* Inline validation */
  const validate = () => {
    const e = {};
    if (!file)            e.file   = "Please upload your resume.";
    if (!github.trim())   e.github = "GitHub username is required.";
    if (mode === "job" && !jdFile && !jdText.trim())
      e.jd = "Paste a job description or upload a JD file.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const analyzeResume = async () => {
    if (!validate()) return;
    setLoading(true);
    setAnalysisData(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("github_username", github.trim());

    if (mode === "job") {
      if (jdFile) {
        formData.append("job_description_file", jdFile);
      } else {
        formData.append("job_description", jdText.trim());
      }
    }

    try {
      const response = await API.post("/resume", formData);
      const data     = response.data;
      const analysis = data.analysis ?? data;
      setAnalysisData({
        mode,
        parsed_resume:   analysis.parsed_resume   ?? "",
        ats_analysis:    analysis.ats_analysis    ?? "",
        github_analysis: analysis.github_analysis ?? "",
        improved_resume: analysis.improved_resume ?? "",
        career_report:   analysis.career_report   ?? "",
        job_match:       analysis.job_match        ?? "",   // future backend field
        fileName:        file.name,
        githubUsername:  github.trim(),
        jobDescription:  jdFile ? jdFile.name : jdText.trim(),
        analyzedAt:      new Date().toLocaleString(),
      });
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Analysis failed. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  if (analysisData) {
    return <Dashboard data={analysisData} onReset={() => setAnalysisData(null)} />;
  }

  return (
    <div className="home">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">
          <Sparkles size={11} strokeWidth={2.5} />
          AI Career Intelligence
        </div>
        <h1>
          Land your dream<br />
          <span>tech job faster</span>
        </h1>
        <p>
          Upload your resume and link your GitHub. CareerPilot runs ATS
          scoring, profile analysis, and generates a personalized career
          roadmap — in under a minute.
        </p>
      </section>

      {/* Upload card */}
      <div className="card">

        {/* Mode toggle */}
        <ModeToggle mode={mode} onChange={handleModeChange} />

        <div className="card-divider" />

        {/* Resume upload */}
        <div className="field">
          <label className="field-label" htmlFor="resume-upload">Resume</label>
          <label
            id="resume-upload"
            className={`upload-zone${file ? " has-file" : ""}${errors.file ? " has-error" : ""}`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
          >
            <input
              type="file" accept=".doc,.docx,.pdf" hidden
              onChange={(e) => { setFile(e.target.files[0] ?? null); setErrors(p => ({ ...p, file: "" })); }}
            />
            <div className="upload-icon-wrap">
              {file ? <FileText size={16} strokeWidth={2} /> : <Upload size={16} strokeWidth={2} />}
            </div>
            <div className="upload-text">
              <strong>{file ? file.name : "Click to upload resume"}</strong>
              <span>{file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, DOC, DOCX"}</span>
            </div>
          </label>
          <FieldError msg={errors.file} />
        </div>

        {/* GitHub username */}
        <div className="field">
          <label className="field-label" htmlFor="github-username">GitHub Username</label>
          <div className={`input-wrap${errors.github ? " has-error" : ""}`}>
            <GithubIcon size={15} />
            <input
              id="github-username" className="github-input"
              type="text" placeholder="username"
              value={github}
              onChange={(e) => { setGithub(e.target.value); setErrors(p => ({ ...p, github: "" })); }}
              spellCheck={false} autoComplete="off"
            />
          </div>
          <FieldError msg={errors.github} />
        </div>

        {/* Job description fields — animated slide */}
        <AnimatePresence>
          {mode === "job" && (
            <motion.div
              key="jd-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              {/* JD textarea */}
              <div className="field" style={{ marginTop: "4px" }}>
                <label className="field-label">Job Description</label>
                <textarea
                  className={`jd-textarea${errors.jd ? " has-error" : ""}`}
                  placeholder="Paste the full job description here…"
                  value={jdText}
                  onChange={(e) => { setJdText(e.target.value); setErrors(p => ({ ...p, jd: "" })); }}
                  rows={5}
                  disabled={!!jdFile}
                />
              </div>

              {/* OR divider */}
              <div className="or-divider">
                <span>or upload JD file</span>
              </div>

              {/* JD file upload */}
              <div className="field">
                <label
                  className={`upload-zone${jdFile ? " has-file" : ""}${errors.jd ? " has-error" : ""}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.click()}
                >
                  <input
                    type="file" accept=".pdf,.docx,.doc" hidden
                    onChange={(e) => {
                      setJdFile(e.target.files[0] ?? null);
                      setErrors(p => ({ ...p, jd: "" }));
                    }}
                  />
                  <div className="upload-icon-wrap">
                    {jdFile ? <FileText size={16} strokeWidth={2} /> : <FileUp size={16} strokeWidth={2} />}
                  </div>
                  <div className="upload-text">
                    <strong>{jdFile ? jdFile.name : "Upload JD (PDF / DOCX)"}</strong>
                    <span>{jdFile ? `${(jdFile.size / 1024).toFixed(1)} KB — overrides text above` : "Optional — overrides text above"}</span>
                  </div>
                  {jdFile && (
                    <button
                      className="upload-clear"
                      type="button"
                      onClick={(e) => { e.preventDefault(); setJdFile(null); }}
                      title="Remove file"
                    >×</button>
                  )}
                </label>
                <FieldError msg={errors.jd} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card-divider" />

        {/* Submit error */}
        {errors.submit && (
          <div className="field-error" style={{ marginBottom: "12px", justifyContent: "center" }}>
            <AlertCircle size={12} strokeWidth={2} />
            {errors.submit}
          </div>
        )}

        <button className="analyze-btn" disabled={loading} onClick={analyzeResume}>
          <Sparkles size={15} strokeWidth={2} />
          {loading ? "Analyzing…" : mode === "job" ? "Analyze Job Match" : "Analyze with AI"}
        </button>
      </div>

      {loading && <StatusCard loading={loading} mode={mode} />}
    </div>
  );
}
