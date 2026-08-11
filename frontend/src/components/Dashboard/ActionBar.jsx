import { useState } from "react";
import { Download, ClipboardCopy, Check, RefreshCw, Share2 } from "lucide-react";
import jsPDF from "jspdf";

export default function ActionBar({ data, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.career_report || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const lineH  = 16;
    const maxW   = doc.internal.pageSize.getWidth() - margin * 2;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CareerPilot AI — Career Report", margin, y);
    y += 28;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${data.analyzedAt}  |  GitHub: ${data.githubUsername}  |  File: ${data.fileName}`, margin, y);
    y += 24;

    doc.setTextColor(30);
    doc.setFontSize(11);

    const text  = data.career_report || "No career report available.";
    const lines = doc.splitTextToSize(text.replace(/#+\s/g, "").replace(/\*\*/g, ""), maxW);

    for (const line of lines) {
      if (y + lineH > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineH;
    }

    doc.save(`CareerPilot_Report_${data.githubUsername}.pdf`);
  };

  const handleShare = () => {
    const text = `CareerPilot AI Career Report\nAnalyzed: ${data.analyzedAt}\nFile: ${data.fileName}`;
    if (navigator.share) {
      navigator.share({ title: "CareerPilot AI Report", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="db-action-bar">
      <button className="db-action-primary" onClick={handleDownload}>
        <Download size={14} strokeWidth={2} />
        Download PDF
      </button>

      <button
        className={`db-action-secondary${copied ? " success" : ""}`}
        onClick={handleCopy}
      >
        {copied
          ? <><Check size={13} strokeWidth={2.5} /> Copied!</>
          : <><ClipboardCopy size={13} strokeWidth={2} /> Copy Report</>
        }
      </button>

      <button className="db-action-secondary" onClick={handleShare}>
        <Share2 size={13} strokeWidth={2} />
        Share
      </button>

      <button className="db-action-secondary" onClick={onReset}>
        <RefreshCw size={13} strokeWidth={2} />
        Analyze Another
      </button>
    </div>
  );
}
