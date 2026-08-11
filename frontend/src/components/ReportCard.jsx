import ReactMarkdown from "react-markdown";

export default function ReportCard({ report }) {

    return (

        <div className="report-card">

            <h2>Detailed AI Report</h2>

            <ReactMarkdown>

                {report}

            </ReactMarkdown>

        </div>

    );

}