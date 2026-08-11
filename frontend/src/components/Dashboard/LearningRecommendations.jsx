import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { parseCourses } from "./parseData";

const DIFF_COLOR = {
  Beginner:     { color: "#4ade80", bg: "rgba(34,197,94,0.08)",    border: "rgba(34,197,94,0.25)"    },
  Intermediate: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.25)"   },
  Advanced:     { color: "#fb7185", bg: "rgba(244,63,94,0.08)",    border: "rgba(244,63,94,0.25)"    },
};

export default function LearningRecommendations({ careerText }) {
  const courses = parseCourses(careerText);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <BookOpen size={14} strokeWidth={2} />
          Learning Recommendations
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-courses-grid">
          {courses.map((c, i) => {
            const dc = DIFF_COLOR[c.difficulty] ?? DIFF_COLOR.Intermediate;
            return (
              <motion.div
                key={i}
                className="db-course-card"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
              >
                <div className="db-course-name">{c.name}</div>
                <div className="db-course-meta">
                  <span
                    className="db-course-tag"
                    style={{ color: dc.color, background: dc.bg, borderColor: dc.border }}
                  >
                    {c.difficulty}
                  </span>
                  {c.duration !== "—" && (
                    <span className="db-course-tag">{c.duration}</span>
                  )}
                </div>
                <button className="db-course-btn">
                  <ExternalLink size={12} strokeWidth={2} />
                  View Course
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
