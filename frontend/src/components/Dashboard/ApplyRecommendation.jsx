import { motion } from "framer-motion";
import { Star, Rocket, ArrowRight } from "lucide-react";
import { parseApplyRecommendation } from "./parseData";

export default function ApplyRecommendation({ data }) {
  const rec = parseApplyRecommendation(data.career_report, data.job_match ?? "");
  const filledStars = rec.stars;

  return (
    <motion.div
      className="db-card apply-rec-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: `linear-gradient(135deg, ${rec.color}0d 0%, var(--surface) 60%)`,
        borderColor: `${rec.color}30`,
      }}
    >
      <div className="db-card-header" style={{ borderColor: `${rec.color}20` }}>
        <div className="db-card-title">
          <Rocket size={14} strokeWidth={2} />
          Apply Recommendation
        </div>
      </div>
      <div className="db-card-body apply-rec-body">
        <div className="apply-rec-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={20}
              strokeWidth={1.5}
              fill={i < filledStars ? rec.color : "transparent"}
              color={i < filledStars ? rec.color : "var(--border-hi)"}
            />
          ))}
          <span className="apply-rec-level" style={{ color: rec.color }}>{rec.level}</span>
        </div>
        <p className="apply-rec-msg">{rec.message}</p>
        <div className="apply-rec-verdict" style={{ background: `${rec.color}15`, borderColor: `${rec.color}30`, color: rec.color }}>
          <ArrowRight size={14} strokeWidth={2.5} />
          {rec.verdict}
        </div>
      </div>
    </motion.div>
  );
}
