import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { parseRoadmap } from "./parseData";

export default function CareerRoadmap({ careerText }) {
  const steps = parseRoadmap(careerText);

  return (
    <motion.div
      className="db-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="db-card-header">
        <div className="db-card-title">
          <Map size={14} strokeWidth={2} />
          AI Career Roadmap
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
              transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
            >
              <div className="db-rm-node">{i + 1}</div>
              <div className="db-rm-content">
                <div className="db-rm-step">{s.step}</div>
                {s.sub && <div className="db-rm-sub">{s.sub}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
