import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { BrainCircuit } from "lucide-react";

export default function ReportSection({ careerReport }) {
  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <BrainCircuit size={14} strokeWidth={2} />
          AI Career Report
        </div>
      </div>
      <div className="db-report-body">
        {careerReport
          ? <ReactMarkdown>{careerReport}</ReactMarkdown>
          : <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Career report unavailable.</p>
        }
      </div>
    </motion.div>
  );
}
