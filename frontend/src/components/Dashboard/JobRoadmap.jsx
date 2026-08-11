import { motion } from "framer-motion";
import { Route } from "lucide-react";
import { parseJobRoadmap } from "./parseData";

export default function JobRoadmap({ data }) {
  const steps = parseJobRoadmap(data.career_report, data.ats_analysis);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <Route size={14} strokeWidth={2} />
          Learning Roadmap to Get This Job
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-roadmap">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="db-rm-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
            >
              <div className="db-rm-node jm-week-node">
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.03em" }}>W{i + 1}</span>
              </div>
              <div className="db-rm-content">
                <div className="db-rm-step">{s.step}</div>
                <div className="db-rm-sub">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
