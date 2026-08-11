export default function RoadmapCard({ roadmap }) {

    return (

        <div className="roadmap-card">

            <h3>Career Roadmap</h3>

            {roadmap.map((step, index) => (

                <div className="roadmap-item" key={index}>

                    <span>{index + 1}</span>

                    <p>{step}</p>

                </div>

            ))}

        </div>

    );

}