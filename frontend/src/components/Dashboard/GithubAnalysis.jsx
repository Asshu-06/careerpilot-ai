import { motion } from "framer-motion";
import { GitBranch, Users, Star, Activity } from "lucide-react";
import { parseGitHub } from "./parseData";

export default function GithubAnalysis({ ghText }) {
  const { repos, followers, following, stars, languages } = parseGitHub(ghText);

  const stats = [
    { label: "Repos",     value: repos,     icon: GitBranch },
    { label: "Followers", value: followers, icon: Users     },
    { label: "Following", value: following, icon: Users     },
    { label: "Stars",     value: stars,     icon: Star      },
  ];

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <GitBranch size={14} strokeWidth={2} />
          GitHub Analysis
        </div>
      </div>
      <div className="db-card-body">
        <div className="db-gh-stats">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="db-gh-chip">
                <div className="db-gh-chip-num">{s.value}</div>
                <div className="db-gh-chip-label">{s.label}</div>
              </div>
            );
          })}
        </div>

        {languages.length > 0 && (
          <>
            <div className="db-col-label" style={{ marginTop: "16px" }}>Languages</div>
            <div className="db-pills">
              {languages.slice(0, 10).map((l) => (
                <span key={l} className="db-pill db-pill-indigo">{l}</span>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: "16px" }}>
          <div className="db-col-label" style={{ marginBottom: "8px" }}>Activity</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={14} color="var(--indigo-hi)" />
            <span style={{ fontSize: "13px", color: "var(--text)" }}>
              {ghText ? "Profile analyzed successfully" : "GitHub data unavailable — showing placeholders"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
