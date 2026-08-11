import { motion } from "framer-motion";
import { FilePen, TrendingUp } from "lucide-react";
import { parseJobResumeChanges } from "./parseData";

const DOT = {
  high:   { bg: "rgba(244,63,94,0.15)",  border: "#f43f5e", color: "#fb7185" },
  medium: { bg: "rgba(251,191,36,0.12)", border: "#f59e0b", color: "#fbbf24" },
  low:    { bg: "rgba(34,197,94,0.1)",   border: "#22c55e", color: "#4ade80" },
};

export default function JobResumeChanges({ data }) {
  const items = parseJobResumeChanges(data.improved_resume, data.career_report);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <FilePen size={14} strokeWidth={2} />
          Resume Changes for This Job
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-timeline">
          {items.map((item, i) => {
            const dc = DOT[item.priority] ?? DOT.low;
            return (
              <motion.div
                key={i}
                className="db-tl-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
              >
                <div className="db-tl-left">
                  <div className="db-tl-dot" style={{ background: dc.bg, borderColor: dc.border, color: dc.color }}>
                    <FilePen size={11} strokeWidth={2} />
                  </div>
                </div>
                <div className="db-tl-body">
                  <div className={`db-tl-priority ${item.priority}`}>{item.priority}</div>
                  <div className="db-tl-rec">{item.description}</div>
                  <div className="db-tl-benefit">
                    <TrendingUp size={11} strokeWidth={2.5} />
                    {item.benefit}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
