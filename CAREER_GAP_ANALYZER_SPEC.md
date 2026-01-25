# Career Gap Analyzer & Learning Roadmap - Technical Specification (V2.0)

## 1. Product Summary
The **Career Gap Analyzer & Learning Roadmap** is an AI-powered platform that bridges the gap between a candidate's current skills and their target job requirements. By parsing resumes and job descriptions using advanced NLP and Generative AI (LLMs), it creates a personalized, semantic skill gap analysis. Unlike simple keyword matchers, it understands context (e.g., "React" implies "JavaScript"). The platform outputs a dynamic 3D visualization of the skill landscape, a prioritized 8-12 week learning roadmap, and curated resources (YouTube, Infosys Springboard, Local Centers), empowering users to upskill efficiently for their dream roles.

---

## 2. User Flow & Dashboard Layout

### 2.1. Registration / Login Flow
*   **Fields:** Email, Password (hashed), Target Role (optional but recommended), Current Location.
*   **Security:** OAuth2 (Google/GitHub) + JWT Session. Enforce MFA for profile updates.
*   **Validation:** Real-time email format check, password strength meter.

### 2.2. Main Dashboard (Wireframe)
**Layout:** Fixed Left Sidebar (Navigation), Top Bar (User Profile/Credits), Main Content Area (Dynamic).

*   **Panel A: "Mission Control" (Input)**
    *   *Interaction:* Drag & Drop Resume (PDF/DOCX), Paste Job Description Text / URL.
    *   *Action:* "Analyze Alignment" (Triggers 3D Animation).
*   **Panel B: "The Skill Galaxy" (Visualization)**
    *   *Content:* Interactive 3D Scatter Plot (Three.js/R3F) where User Skills = Blue Nodes, JD Skills = Gold Nodes, Gaps = Red Pulsing Nodes.
    *   *Labels:* Hover tooltips showing skill confidence & category.
*   **Panel C: "Gap Analysis Report" (Results)**
    *   *Components:* Match Score Gauge (0-100%), "Critical Missing Skills" List, "Transferable Skills" List.
*   **Panel D: "Personalized Roadmap" (Timeline)**
    *   *Layout:* Vertical Timeline (Week 1-12). Each week expands to show Daily Tasks + Resource Links.

---

## 3. Data & API Design

### 3.1. Database Schema (PostgreSQL/SQLAlchemy)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR,
    location_lat FLOAT,
    location_lon FLOAT,
    preferences JSONB
);

CREATE TABLE resumes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    parsed_text TEXT,
    skills_extracted JSONB, 
    vector_embedding VECTOR(1536) -- For semantic search
);

CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    raw_text TEXT,
    skills_required JSONB,
    vectors VECTOR(1536)
);

CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    resume_id UUID,
    jd_id UUID,
    match_score FLOAT,
    gap_skills JSONB,
    roadmap JSONB,
    created_at TIMESTAMP
);
```

### 3.2. API Endpoints (REST)
*   `POST /api/v1/parse/resume` - Accepts file, returns structured JSON.
*   `POST /api/v1/analyze/gap` - payload: `{ resume_id, job_description_text }`. Returns: Analysis Result object.
*   `GET /api/v1/resources/recommend?skill=React` - Returns filtered YouTube/Course links.
*   `GET /api/v1/centers/nearby?lat=...&lon=...&skill=...` - Returns Geo-located training centers.

---

## 4. Processing Pipeline

1.  **Ingestion:** `pdfplumber` / `python-docx` extracts raw text.
2.  **Normalization (LLM + Spacy):**
    *   Detects sections (Experience vs Education).
    *   Maps equivalents: `JS` -> `JavaScript`, `EC2` -> `AWS`.
3.  **Vector Store:** Store skill embeddings in **Pinecone** or **PGVector**.
4.  **Matching Algorithm:**
    *   *Step 1 (Hard Match):* Exact string matching.
    *   *Step 2 (Semantic Match):* Cosine similarity of embeddings. If `similarity > 0.85`, treat as verified.
    *   *Step 3 (Gap Calculation):* `Gap_Score = 1 - (Matched_Weights / Total_JD_Weights)`.

---

## 5. Analysis Results & Visualizations (Panels)

| Panel Name | Component Type | Data Source | Sample Microcopy |
| :--- | :--- | :--- | :--- |
| **Skill Radar** | Radar Chart (Recharts) | Categories (Frontend, Backend, Design) | "You are strong in *Design* but the role requires more *Backend* depth." |
| **Comparison Table** | Data Table (TanStack) | Extracted Skills List | "Required: **Docker** | Your Evidence: *None* | Severity: **High**" |
| **Learning Cards** | Card Grid | YouTube API / Infosys | "Recommended: **Docker for Beginners** (2h 15m) • Free • 4.8★" |

---

## 6. Learning Path & Roadmap Generator

**Algorithm Rules:**
1.  **Dependency Graph:** `HTML` > `CSS` > `JS` > `React`. Sort missing skills topologically.
2.  **Volume Estimation:** 1 "Skill Unit" = ~10 hours study.
3.  **Scheduling:** User Input `Hours/Week` (e.g., 10h). If Gap = 50 hours, Timeline = 5 Weeks.

**Sample Roadmap (8 weeks):**
*   **Weeks 1-2 (Foundations):** "Python Basics" (Scripting, Types). *Resource: FreeCodeCamp Video.*
*   **Weeks 3-5 (Core Tech):** "Django Framework" (MVC, ORM). *Resource: Official Docs + Coursera Project.*
*   **Week 6 (Tools):** "Git & CI/CD". *Resource: GitLab CI Tutorial.*
*   **Weeks 7-8 (Capstone):** "Build a Blog Portfolio". *Output: GitHub Repo link.*

---

## 7. Resource Curation Rules
*   **YouTube:** Filter by `viewCount > 10k`, `publishDate > 2023`, duration `20m - 2h` (avoid shorts).
*   **Infosys Springboard:** Match keywords against indexed catalog. Prefer "Certification" courses.
*   **Local Centers:** Query Google Places API for `"Training Institute" + {Skill} + "near me"`. Filter `rating > 4.0`.

---

## 8. Personalization Inputs
*   **Primary Goal:** "Upskill for promotion" vs "Career Pivot".
*   **Budget:** Free only vs Paid ($$).
*   **Learning Style:** Video-first vs Text/Docs-first.
*   **Timeline:** Urgency multiplier (compress roadmap if urgent).

---

## 9. Privacy & Security
*   **PII Handling:** Regex scrub `phone`, `email`, `address` before sending text to external LLMs.
*   **Data Retention:** Option to "Process & Forget" (RAM only) or "Save Profile" (Encrypted DB).

---

## 10. Implementation Tech Stack
*   **Frontend:** Next.js (React), Tailwind CSS, Three.js (R3F), Zustand.
*   **Backend:** Python Flask/FastAPI.
*   **AI Models:**
    *   *Parsing:* Spacy / Llama 3.1 8B (Local via Ollama).
    *   *Embeddings:* `sentence-transformers/all-MiniLM-L6-v2`.
*   **Infrastructure:** Docker Compose, PostgreSQL (pgvector).

---

## 11. Example Analysis Output (JSON)
```json
{
  "match_percentage": 65.4,
  "top_missing_skills": ["Kubernetes", "GraphQL", "System Design"],
  "roadmap": [
    {
      "week": 1,
      "focus": "Container Orchestration",
      "tasks": ["Install Minikube", "Deploy first pod"],
      "resources": [
        {"type": "youtube", "title": "K8s in 100 seconds", "url": "..."}
      ]
    }
  ],
  "local_centers": [
    {"name": "TechEd Institute", "distance": "3.5km", "rating": 4.5}
  ]
}
```

## 12. Developer Hints
*   **Edge Cases:** PDF parsing often mangles multi-column layouts. Use specialized OCR or `LayoutLM` if simple extraction fails.
*   **Ambiguity:** "Go" (Language) vs "Go" (Action). Use context-aware extraction (NER) trained on IT resumes.
*   **Performance:** Generate the Roadmap *asynchronously* (Celery task) while showing the 3D visualization to keep the UI snappy.
