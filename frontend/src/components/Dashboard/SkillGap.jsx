import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { parseATS } from "./parseData";

const PILL_COLORS_EXISTING = "db-pill db-pill-green";
const PILL_COLORS_MISSING  = "db-pill db-pill-amber";

const FALLBACK_EXISTING = ["JavaScript", "React", "Node.js", "Python", "Git", "HTML/CSS", "REST APIs"];
const FALLBACK_MISSING  = ["TypeScript", "Docker", "AWS", "System Design", "GraphQL", "Redis", "Kubernetes"];

export default function SkillGap({ atsText }) {
  const { skills, missing } = parseATS(atsText);

  const existing = skills.length  >= 3 ? skills  : FALLBACK_EXISTING;
  const gaps     = missing.length >= 3 ? missing : FALLBACK_MISSING;

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <TrendingUp size={14} strokeWidth={2} />
          Skill Gap Analysis
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-skillgap-grid">
          <div>
            <div className="db-col-label">✅ Existing Skills</div>
            <div className="db-pills">
              {existing.map((s) => (
                <span key={s} className={PILL_COLORS_EXISTING}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="db-col-label">⚡ Recommended to Learn</div>
            <div className="db-pills">
              {gaps.map((s) => (
                <span key={s} className={PILL_COLORS_MISSING}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
