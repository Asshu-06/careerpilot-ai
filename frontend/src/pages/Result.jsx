import ScoreCard from "../components/ScoreCard";
import StrengthCard from "../components/StrengthCard";
import RoadmapCard from "../components/RoadmapCard";
import ReportCard from "../components/ReportCard";

export default function Result({ result }) {

  return (
    <div className="result-page">

      <div className="cards-grid">

        <ScoreCard score={86} />

        <StrengthCard
          strengths={[
            "Java",
            "Spring Boot",
            "SQL",
            "Problem Solving"
          ]}
        />

      </div>

      <RoadmapCard
        roadmap={[
          "Learn Docker",
          "Deploy Backend",
          "Build Projects",
          "Practice Interviews"
        ]}
      />

      <ReportCard report={result} />

    </div>
  );

}