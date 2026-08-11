export default function StrengthCard({ strengths }) {

    return (

        <div className="strength-card">

            <h3>Strengths</h3>

            <ul>

                {strengths.map((item, index) => (

                    <li key={index}>✅ {item}</li>

                ))}

            </ul>

        </div>

    );

}