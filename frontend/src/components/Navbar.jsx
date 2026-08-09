import "../styles/navbar.css";
import { Sparkles } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Sparkles size={16} strokeWidth={2} />
        <span>CareerPilot AI</span>
        <span className="nav-badge">Beta</span>
      </div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Features</a>
        <a href="#">About</a>
      </div>
    </nav>
  );
}

export default Navbar;
