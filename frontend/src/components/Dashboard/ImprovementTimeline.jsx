import { motion } from "framer-motion";
import { Pencil, CheckCircle2 } from "lucide-react";
import { parseImprovements } from "./parseData";

const DOT_COLORS = {
  high:   { bg: "rgba(244,63,94,0.15)",  border: "#f43f5e", color: "#fb7185" },
  medium: { bg: "rgba(251,191,36,0.12)", border: "#f59e0b", color: "#fbbf24" },
  low:    { bg: "rgba(34,197,94,0.1)",   border: "#22c55e", color: "#4ade80" },
};

export default function ImprovementTimeline({ improvedText }) {
  const items = parseImprovements(improvedText);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <Pencil size={14} strokeWidth={2} />
          Resume Improvements
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-timeline">
          {items.map((item, i) => {
            const dc = DOT_COLORS[item.priority] ?? DOT_COLORS.low;
            return (
              <motion.div
                key={i}
                className="db-tl-item"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
              >
                <div className="db-tl-left">
                  <div
                    className="db-tl-dot"
                    style={{ background: dc.bg, borderColor: dc.border, color: dc.color }}
                  >
                    <Pencil size={12} strokeWidth={2} />
                  </div>
                </div>
                <div className="db-tl-body">
                  <div className={`db-tl-priority ${item.priority}`}>{item.priority}</div>
                  <div className="db-tl-rec">{item.rec}</div>
                  <div className="db-tl-desc">{item.desc}</div>
                  <div className="db-tl-benefit">
                    <CheckCircle2 size={12} strokeWidth={2.5} />
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
