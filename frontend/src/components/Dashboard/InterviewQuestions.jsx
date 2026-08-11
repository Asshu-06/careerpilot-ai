import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { parseInterviewQuestions } from "./parseData";

export default function InterviewQuestions({ data }) {
  const questions = parseInterviewQuestions(data.career_report);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <MessageSquare size={14} strokeWidth={2} />
          Top Interview Questions
        </div>
        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          Based on this job description
        </span>
      </div>
      <div className="db-card-body">
        <div className="iq-list">
          {questions.map((q, i) => (
            <motion.div
              key={i}
              className="iq-item"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
            >
              <div className="iq-num">{i + 1}</div>
              <div className="iq-text">{q}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
