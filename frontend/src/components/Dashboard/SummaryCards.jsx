import { motion } from "framer-motion";
import { ScanSearch, GitBranch, FileText, BrainCircuit } from "lucide-react";

const CARDS = [
  {
    key: "ats",
    label: "ATS Analysis",
    icon: ScanSearch,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.12)",
    desc: "Resume compatibility score",
  },
  {
    key: "github",
    label: "GitHub Analysis",
    icon: GitBranch,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    desc: "Portfolio & activity review",
  },
  {
    key: "improved",
    label: "Resume Improvement",
    icon: FileText,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    desc: "Tailored suggestions ready",
  },
  {
    key: "career",
    label: "Career Report",
    icon: BrainCircuit,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    desc: "Personalised roadmap generated",
  },
];

const STATUS = {
  ats:     "Analyzed",
  github:  "Analyzed",
  improved:"Generated",
  career:  "Generated",
};

export default function SummaryCards({ data }) {
  const present = {
    ats:     !!data.ats_analysis,
    github:  !!data.github_analysis,
    improved:!!data.improved_resume,
    career:  !!data.career_report,
  };

  return (
    <div className="db-summary-grid">
      {CARDS.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.key}
            className="db-stat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="db-stat-icon" style={{ background: c.bg, color: c.color }}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div>
              <div className="db-stat-label">{c.label}</div>
              <div className="db-stat-value" style={{ fontSize: "14px", marginTop: "4px", color: present[c.key] ? c.color : "var(--text-muted)" }}>
                {present[c.key] ? STATUS[c.key] : "Unavailable"}
              </div>
              <div className="db-stat-desc">{c.desc}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
