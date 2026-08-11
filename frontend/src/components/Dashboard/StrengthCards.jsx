import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { parseStrengths } from "./parseData";

export default function StrengthCards({ atsText, careerText }) {
  const strengths = parseStrengths(atsText, careerText);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <Zap size={14} strokeWidth={2} />
          Resume Strengths
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-strength-grid">
          {strengths.map((s, i) => (
            <motion.div
              key={i}
              className="db-strength-item"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
            >
              <div className="db-strength-icon">
                <span style={{ fontSize: "14px" }}>{s.icon}</span>
              </div>
              <div className="db-strength-text">
                <strong>{s.title}</strong>
                <span>{s.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
