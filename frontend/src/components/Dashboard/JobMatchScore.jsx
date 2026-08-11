import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { parseJobMatchScore } from "./parseData";

function BigRing({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const raf = useRef(null);
  const r    = 58;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const start = performance.now();
    const tick  = (now) => {
      const p = Math.min((now - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(e * score));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [score]);

  const color  = score >= 80 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#f43f5e";
  const offset = circ - (displayed / 100) * circ;
  const label  = score >= 80 ? "Strong Match" : score >= 65 ? "Good Match" : "Partial Match";

  return (
    <div className="jm-ring-wrap">
      <div className="jm-ring">
        <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="#1c1c22" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${color}55)` }}
          />
        </svg>
        <div className="jm-ring-inner">
          <span className="jm-ring-pct" style={{ color }}>{displayed}%</span>
          <span className="jm-ring-label">Match</span>
        </div>
      </div>
      <div className="jm-ring-verdict" style={{ color }}>
        <span className="jm-ring-badge" style={{ background: `${color}18`, borderColor: `${color}40` }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function JobMatchScore({ data }) {
  const score = parseJobMatchScore(data.career_report, data.job_match ?? "");

  return (
    <motion.div
      className="db-card jm-hero-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <Target size={14} strokeWidth={2} />
          Job Match Score
        </div>
        <span className="db-hero-badge" style={{ marginBottom: 0 }}>
          Job Analysis Mode
        </span>
      </div>
      <div className="db-card-body jm-hero-body">
        <BigRing score={score} />
        <div className="jm-hero-info">
          <p className="jm-hero-desc">
            Your resume was analyzed against the provided job description. The score reflects
            overall compatibility across skills, keywords, experience, and ATS formatting.
          </p>
          {data.jobDescription && (
            <div className="jm-jd-ref">
              <span className="db-col-label" style={{ marginBottom: "4px" }}>Job Description</span>
              <div className="jm-jd-text">
                {data.jobDescription.length > 160
                  ? data.jobDescription.slice(0, 160) + "…"
                  : data.jobDescription}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
