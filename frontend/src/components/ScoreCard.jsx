export default function ScoreCard({ score }) {

    return (

        <div className="score-card">

            <h3>Overall Score</h3>

            <div className="score-circle">

                {score}

            </div>

            <p>Excellent Profile</p>

        </div>

    );

}