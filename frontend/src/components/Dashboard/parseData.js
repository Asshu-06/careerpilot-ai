/**
 * parseData.js
 * Extracts structured data from the raw LLM text fields
 * returned by the backend. All parsers are defensive — if
 * the text doesn't contain the expected content, they return
 * sensible placeholder values instead of crashing.
 */

/* ── Generic helpers ──────────────────────────────────────── */

/** Pull a numeric value from text like "ATS Score: 78/100" or "Score: 78%" */
export function extractScore(text = "") {
  const m = text.match(/(?:score|ats)[^\d]*(\d{1,3})\s*(?:\/\s*100|%)?/i);
  if (m) return Math.min(parseInt(m[1], 10), 100);
  // fallback: first standalone number 40-99
  const nums = [...text.matchAll(/\b([4-9]\d|100)\b/g)].map((x) => parseInt(x[1], 10));
  return nums.length ? nums[0] : null;
}

/** Pull a bulleted/numbered list from text after a heading */
function extractSection(text = "", ...headings) {
  for (const heading of headings) {
    const re = new RegExp(`(?:^|\\n).*${heading}.*\\n([\\s\\S]*?)(?:\\n#{1,3}|\\n---+|$)`, "i");
    const m = text.match(re);
    if (m) {
      return m[1]
        .split("\n")
        .map((l) => l.replace(/^[\s\-*•\d.]+/, "").trim())
        .filter((l) => l.length > 3 && l.length < 120);
    }
  }
  return [];
}

/* ── ATS parsing ──────────────────────────────────────────── */
export function parseATS(ats = "") {
  const score = extractScore(ats) ?? 72;

  // Sub-scores — try to find them, else distribute around total
  const subNames = ["Formatting", "Keywords", "Readability", "ATS Compatibility", "Resume Structure"];
  const subScores = subNames.map((n) => {
    const m = ats.match(new RegExp(`${n}[^\\d]*(\\d{1,3})`, "i"));
    return m ? Math.min(parseInt(m[1], 10), 100) : Math.max(20, score + Math.floor(Math.random() * 14 - 7));
  });

  const skills   = extractSection(ats, "Skills", "Technical Skills", "Existing Skills", "Strengths");
  const missing  = extractSection(ats, "Missing", "Missing Skills", "Recommended Skills", "Suggestions");

  return { score, subNames, subScores, skills, missing };
}

/* ── GitHub parsing ───────────────────────────────────────── */
export function parseGitHub(gh = "") {
  // Backend returns either a JSON string or a plain-text analysis
  let parsed = null;
  try { parsed = JSON.parse(gh); } catch (_) { /* not JSON */ }

  if (parsed && typeof parsed === "object") {
    return {
      repos:     parsed.public_repositories ?? parsed.public_repos ?? "—",
      followers: parsed.followers ?? "—",
      following: parsed.following ?? "—",
      stars:     parsed.stars ?? "—",
      languages: parsed.top_languages ?? [],
      quality:   parsed.quality_score ?? null,
      activity:  parsed.activity ?? null,
      name:      parsed.name ?? parsed.username ?? "",
    };
  }

  // Plain text fallback
  const repos     = gh.match(/(?:repos?|repositories)[^\d]*(\d+)/i);
  const followers = gh.match(/followers[^\d]*(\d+)/i);
  const following = gh.match(/following[^\d]*(\d+)/i);
  const langs     = extractSection(gh, "Languages", "Technologies", "Tech Stack");

  return {
    repos:     repos     ? parseInt(repos[1])     : "—",
    followers: followers ? parseInt(followers[1]) : "—",
    following: following ? parseInt(following[1]) : "—",
    stars:     "—",
    languages: langs.length ? langs : [],
    quality:   null,
    activity:  null,
    name:      "",
  };
}

/* ── Strengths ────────────────────────────────────────────── */
const STRENGTH_ICONS = ["💡", "🚀", "🔧", "📦", "⚡", "🎯", "🧠", "🔗"];
const STRENGTH_PLACEHOLDERS = [
  { title: "Technical Skills",    desc: "Strong foundation in programming" },
  { title: "Project Portfolio",   desc: "Multiple hands-on projects"       },
  { title: "GitHub Activity",     desc: "Consistent contributions"         },
  { title: "Modern Tech Stack",   desc: "Up-to-date technologies"          },
  { title: "Problem Solving",     desc: "Analytical mindset"               },
  { title: "Clean Code",          desc: "Readable and maintainable code"   },
];

export function parseStrengths(ats = "", career = "") {
  const raw = extractSection(ats + "\n" + career, "Strength", "Strengths", "Strongest");
  if (raw.length >= 3) {
    return raw.slice(0, 6).map((s, i) => ({
      icon: STRENGTH_ICONS[i % STRENGTH_ICONS.length],
      title: s.split(":")[0].trim(),
      desc: s.includes(":") ? s.split(":").slice(1).join(":").trim() : "Identified in your analysis",
    }));
  }
  return STRENGTH_PLACEHOLDERS;
}

/* ── Improvements ─────────────────────────────────────────── */
const PRIORITY_CYCLE = ["high", "high", "medium", "medium", "low"];
const PLACEHOLDER_IMPROVEMENTS = [
  { priority: "high",   rec: "Add quantifiable achievements",  desc: "Use numbers to show impact (e.g. 'improved performance by 40%').", benefit: "Increases ATS score significantly" },
  { priority: "high",   rec: "Tailor keywords to job postings", desc: "Match job description keywords in your skills section.",          benefit: "Improves ATS keyword match rate"  },
  { priority: "medium", rec: "Improve resume formatting",       desc: "Use consistent fonts, spacing, and clean section headers.",      benefit: "Better readability score"          },
  { priority: "medium", rec: "Add a strong summary section",    desc: "A 3-4 line professional summary at the top of your resume.",    benefit: "Catches recruiter attention"        },
  { priority: "low",    rec: "Include certifications",          desc: "Add relevant certifications to boost credibility.",             benefit: "Differentiates from other candidates" },
];

export function parseImprovements(improved = "") {
  const lines = extractSection(improved, "Improvement", "Suggestion", "Recommend", "1\\.", "Enhancement");
  if (lines.length >= 3) {
    return lines.slice(0, 5).map((l, i) => ({
      priority: PRIORITY_CYCLE[i] ?? "low",
      rec:  l.split(":")[0].trim(),
      desc: l.includes(":") ? l.split(":").slice(1).join(":").trim() : l,
      benefit: "Enhances overall profile quality",
    }));
  }
  return PLACEHOLDER_IMPROVEMENTS;
}

/* ── Career roadmap ───────────────────────────────────────── */
const DEFAULT_ROADMAP = [
  { step: "Resume Optimization",  sub: "Polish formatting, keywords, and achievements"      },
  { step: "DSA Practice",         sub: "LeetCode / HackerRank — 1 problem/day"              },
  { step: "Build Full Stack Projects", sub: "Deploy 2-3 portfolio projects on GitHub"       },
  { step: "Cloud & DevOps",       sub: "AWS / GCP basics, Docker, CI/CD pipelines"          },
  { step: "Open Source Contributions", sub: "Contribute to real-world repos"               },
  { step: "Mock Interviews",      sub: "Practice on Pramp, Interviewing.io"                 },
  { step: "Apply to Companies",   sub: "Target 5-10 applications per week"                  },
];

export function parseRoadmap(career = "") {
  const lines = extractSection(career, "Roadmap", "Learning Path", "Next Steps", "Action Plan", "Week");
  if (lines.length >= 4) {
    return lines.slice(0, 7).map((l) => ({
      step: l.split(":")[0].trim(),
      sub:  l.includes(":") ? l.split(":").slice(1).join(":").trim() : "",
    }));
  }
  return DEFAULT_ROADMAP;
}

/* ── Courses ──────────────────────────────────────────────── */
const DEFAULT_COURSES = [
  { name: "Complete DSA Masterclass",       difficulty: "Intermediate", duration: "40 hrs" },
  { name: "Full Stack Web Development",     difficulty: "Beginner",     duration: "60 hrs" },
  { name: "AWS Cloud Practitioner",         difficulty: "Beginner",     duration: "20 hrs" },
  { name: "System Design Interview Prep",   difficulty: "Advanced",     duration: "30 hrs" },
  { name: "Docker & Kubernetes Essentials", difficulty: "Intermediate", duration: "15 hrs" },
  { name: "React + TypeScript Bootcamp",    difficulty: "Intermediate", duration: "25 hrs" },
];

export function parseCourses(career = "") {
  const lines = extractSection(career, "Course", "Certification", "Learning", "Recommend");
  if (lines.length >= 3) {
    return lines.slice(0, 6).map((l, i) => ({
      name: l.split(":")[0].trim(),
      difficulty: i < 2 ? "Beginner" : i < 4 ? "Intermediate" : "Advanced",
      duration: "—",
    }));
  }
  return DEFAULT_COURSES;
}

/* ════════════════════════════════════════════════════════════
   JOB MATCH PARSERS  (Mode 2 — Analyze for a Job)
   ════════════════════════════════════════════════════════════ */

/** Parse overall job match score from career_report or job_match field */
export function parseJobMatchScore(career = "", jobMatch = "") {
  const combined = jobMatch + "\n" + career;
  // Look for patterns like "Match: 87%", "87% match", "match score: 87"
  const patterns = [
    /match\s*(?:score)?[:\s]*(\d{1,3})\s*%/i,
    /(\d{1,3})\s*%\s*match/i,
    /overall[^\d]*(\d{1,3})\s*%/i,
    /job\s*fit[:\s]*(\d{1,3})/i,
    /compatibility[:\s]*(\d{1,3})/i,
  ];
  for (const re of patterns) {
    const m = combined.match(re);
    if (m) return Math.min(parseInt(m[1], 10), 100);
  }
  return 74; // sensible placeholder
}

/** Parse individual match category scores */
export function parseMatchCategories(career = "", jobMatch = "") {
  const text = jobMatch + "\n" + career;
  const cats = [
    { label: "ATS Compatibility",    keys: ["ats compat", "ats score", "ats"]          },
    { label: "Keyword Match",        keys: ["keyword match", "keywords matched"]        },
    { label: "Technical Skills",     keys: ["technical skill", "tech skill", "technical match"] },
    { label: "Soft Skills",          keys: ["soft skill"]                               },
    { label: "Experience Match",     keys: ["experience match", "experience"]           },
    { label: "Education Match",      keys: ["education match", "education"]             },
  ];

  return cats.map((c) => {
    for (const key of c.keys) {
      const re = new RegExp(`${key}[^\\d]*(\\d{1,3})`, "i");
      const m  = text.match(re);
      if (m) return { label: c.label, value: Math.min(parseInt(m[1], 10), 100) };
    }
    // fallback: derive from overall ± small variance
    const base = parseJobMatchScore(career, jobMatch);
    return { label: c.label, value: Math.max(20, base + Math.floor(Math.random() * 18 - 9)) };
  });
}

/** Extract missing keywords from the analysis text */
export function parseMissingKeywords(career = "", atsText = "") {
  const text = career + "\n" + atsText;
  const raw  = extractSection(text, "Missing Keyword", "Missing Skills", "Missing", "Keyword Gap");
  if (raw.length >= 3) return raw.slice(0, 12);
  return ["Docker", "Kubernetes", "Redis", "Kafka", "CI/CD", "AWS", "Terraform", "TypeScript", "GraphQL", "Jest"];
}

/** Extract missing technical & soft skills for job mode */
export function parseMissingSkillsSplit(career = "", atsText = "") {
  const text = career + "\n" + atsText;
  const techRaw = extractSection(text, "Missing Technical", "Technical Gap", "Missing Skills", "Missing");
  const softRaw = extractSection(text, "Missing Soft", "Soft Skills", "Communication", "Leadership");

  const tech = techRaw.length >= 2 ? techRaw.slice(0, 8) : ["Docker", "Kubernetes", "AWS", "TypeScript", "Redis", "System Design"];
  const soft = softRaw.length >= 2 ? softRaw.slice(0, 6) : ["Technical Communication", "Team Leadership", "Agile/Scrum", "Problem Solving"];
  return { tech, soft };
}

/** Parse resume change recommendations for job mode */
export function parseJobResumeChanges(improved = "", career = "") {
  const text = improved + "\n" + career;
  const lines = extractSection(text, "Resume Change", "Update Resume", "Add to Resume", "Recommendation", "Improvement");
  const PRIORITY = ["high", "high", "medium", "medium", "low"];
  const BENEFIT  = ["Increases job match score", "Improves ATS compatibility", "Highlights relevant experience", "Better keyword density", "Stronger first impression"];
  if (lines.length >= 3) {
    return lines.slice(0, 5).map((l, i) => ({
      priority:    PRIORITY[i] ?? "low",
      description: l,
      benefit:     BENEFIT[i] ?? "Improves overall match",
    }));
  }
  return [
    { priority: "high",   description: "Add Docker and containerization experience to skills section.", benefit: "Addresses a key missing keyword"       },
    { priority: "high",   description: "Quantify achievements with metrics (e.g. 40% performance gain).", benefit: "Increases ATS score significantly"   },
    { priority: "medium", description: "Mention REST API design experience prominently.", benefit: "Matches JD technical requirements"                   },
    { priority: "medium", description: "Include CI/CD pipeline tools you've used.", benefit: "Fills a common JD requirement gap"                        },
    { priority: "low",    description: "Improve resume summary to reflect this specific role.", benefit: "Catches recruiter attention faster"            },
  ];
}

/** Generate top interview questions from the career report / JD context */
export function parseInterviewQuestions(career = "") {
  const raw = extractSection(career, "Interview", "Question", "Technical Question", "Behavioral");
  if (raw.length >= 5) return raw.slice(0, 10);
  return [
    "Walk me through a challenging project you built end-to-end.",
    "How do you handle performance bottlenecks in a distributed system?",
    "Explain the difference between SQL and NoSQL databases.",
    "Describe your experience with CI/CD pipelines.",
    "How would you design a scalable REST API?",
    "What is your approach to writing unit and integration tests?",
    "How do you prioritize tasks when working on multiple features?",
    "Describe a time you resolved a production incident under pressure.",
    "What containerization tools have you worked with?",
    "Where do you see yourself in your engineering career in 3 years?",
  ];
}

/** Generate the apply recommendation verdict */
export function parseApplyRecommendation(career = "", jobMatch = "") {
  const score = parseJobMatchScore(career, jobMatch);
  if (score >= 80) return {
    stars: 5, level: "Strong Match",
    color: "#22c55e",
    message: `You satisfy ${score}% of the requirements. Your profile aligns well — apply immediately.`,
    verdict: "Apply Now",
  };
  if (score >= 65) return {
    stars: 3, level: "Moderate Match",
    color: "#f59e0b",
    message: `You meet ${score}% of the requirements. Improve the highlighted skills before applying for best results.`,
    verdict: "Improve First",
  };
  return {
    stars: 2, level: "Partial Match",
    color: "#f43f5e",
    message: `You currently meet ${score}% of the requirements. Significant skill gaps exist — focus on the roadmap below.`,
    verdict: "Not Ready Yet",
  };
}

/** Generate skill-based learning roadmap for job mode */
export function parseJobRoadmap(career = "", atsText = "") {
  const { tech } = parseMissingSkillsSplit(career, atsText);
  const weeks    = tech.slice(0, 5);
  return weeks.map((skill, i) => ({
    week: `Week ${i + 1}`,
    step: skill,
    sub:  `Build hands-on projects and complete online courses for ${skill}`,
  }));
}
