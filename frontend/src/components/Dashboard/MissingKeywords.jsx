import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { parseMissingKeywords, parseMissingSkillsSplit } from "./parseData";

export default function MissingKeywords({ data }) {
  const keywords = parseMissingKeywords(data.career_report, data.ats_analysis);
  const { tech, soft } = parseMissingSkillsSplit(data.career_report, data.ats_analysis);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <AlertTriangle size={14} strokeWidth={2} />
          Missing Keywords &amp; Skills
        </div>
      </div>
      <div className="db-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Missing keywords */}
        <div>
          <div className="db-col-label">Missing Keywords</div>
          <div className="db-pills">
            {keywords.map((k) => (
              <span key={k} className="db-pill db-pill-rose">{k}</span>
            ))}
          </div>
        </div>

        {/* Split skills */}
        <div className="db-skillgap-grid">
          <div>
            <div className="db-col-label">Missing Technical Skills</div>
            <div className="db-pills">
              {tech.map((s) => (
                <span key={s} className="db-pill db-pill-amber">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="db-col-label">Missing Soft Skills</div>
            <div className="db-pills">
              {soft.map((s) => (
                <span key={s} className="db-pill" style={{ background: "rgba(167,139,250,0.1)", borderColor: "rgba(167,139,250,0.25)", color: "#c4b5fd" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
