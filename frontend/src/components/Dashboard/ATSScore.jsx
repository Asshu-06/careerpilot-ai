import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import { parseATS } from "./parseData";

/* Animated SVG ring */
function ScoreRing({ score, size = 110 }) {
  const [displayed, setDisplayed] = useState(0);
  const raf = useRef(null);
  const radius = 44;
  const circ   = 2 * Math.PI * radius;

  useEffect(() => {
    const start = performance.now();
    const dur   = 1200;
    const tick  = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(e * score));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [score]);

  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#f43f5e";
  const offset = circ - (displayed / 100) * circ;

  return (
    <div className="db-score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#1c1c22" strokeWidth="8" />
        <motion.circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="db-score-ring-label">
        <span className="db-score-ring-num" style={{ color }}>{displayed}</span>
        <span className="db-score-ring-unit">/ 100</span>
      </div>
    </div>
  );
}

/* Animated progress bar */
function Bar({ label, value }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="db-bar-row">
      <div className="db-bar-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="db-bar-track">
        <div className="db-bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function ATSScore({ atsText }) {
  const { score, subNames, subScores } = parseATS(atsText);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <ScanSearch size={14} strokeWidth={2} />
          ATS Score
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-ats-score-wrap">
          <ScoreRing score={score} />
          <div className="db-ats-bars">
            {subNames.map((n, i) => (
              <Bar key={n} label={n} value={subScores[i]} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
