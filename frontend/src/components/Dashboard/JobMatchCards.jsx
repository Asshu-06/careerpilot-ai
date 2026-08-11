import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { parseMatchCategories } from "./parseData";

function AnimatedBar({ value, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 300); return () => clearTimeout(t); }, [value]);
  return (
    <div className="db-bar-track" style={{ height: "6px" }}>
      <div
        className="db-bar-fill"
        style={{
          width: `${w}%`,
          background: color,
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}

export default function JobMatchCards({ data }) {
  const cats = parseMatchCategories(data.career_report, data.job_match ?? "");

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <BarChart3 size={14} strokeWidth={2} />
          Match Breakdown
        </div>
      </div>
      <div className="db-card-body">
        <div className="jm-cats-grid">
          {cats.map((c, i) => {
            const color = c.value >= 80 ? "#22c55e" : c.value >= 60 ? "#f59e0b" : "#f43f5e";
            return (
              <motion.div
                key={c.label}
                className="jm-cat-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <div className="jm-cat-header">
                  <span className="jm-cat-label">{c.label}</span>
                  <span className="jm-cat-pct" style={{ color }}>{c.value}%</span>
                </div>
                <AnimatedBar value={c.value} color={color} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
