from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv

from models.resume_text_extractor import extract_text

# ---------------- SAFE AI IMPORTS ----------------

try:
    from models.resume_parser import extract_resume_with_llama
except ImportError:
    def extract_resume_with_llama(*args, **kwargs):
        return {
            "skills": [],
            "years_of_experience": "0",
            "education": "NA",
            "certifications": []
        }

try:
    from models.description_analyzer import analyze_text_with_llama
except ImportError:
    def analyze_text_with_llama(*args, **kwargs):
        return {}

try:
    from models.skills_analyzer import analyze_skills_with_llama, get_market_skills
except ImportError:
    def analyze_skills_with_llama(*args, **kwargs): return []
    def get_market_skills(*args, **kwargs): return []

try:
    from models.google_api import GoogleSearchAPI
except ImportError:
    class GoogleSearchAPI:
        def __init__(self, *args): pass
        def get_curriculum_plan(self, *args): return {}

try:
    from models.educator_gap import analyze_and_suggest
except ImportError:
    def analyze_and_suggest(*args, **kwargs):
        return {"error": "AI disabled"}

try:
    from models.quiz_generator import generate_quiz_questions, generate_verification_questions
except ImportError:
    def generate_quiz_questions(*args, **kwargs): return []
    def generate_verification_questions(*args, **kwargs): return []

try:
    from models.interview_prep import get_interview_prep_data
except ImportError:
    def get_interview_prep_data(*args, **kwargs):
        return {"error": "AI disabled"}

# --------------------------------------------------
# APP SETUP
# --------------------------------------------------

load_dotenv()

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# ENV VARIABLES
# --------------------------------------------------

GOOGLE_API_KEY = os.getenv("Google_api_key")
CSE_ID = os.getenv("CSE_ID")

google_search = GoogleSearchAPI(GOOGLE_API_KEY, CSE_ID)

# --------------------------------------------------
# AUTH
# --------------------------------------------------

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password:
        return jsonify({"error": "Email & password required"}), 400

    users = {}
    if os.path.exists("users.json"):
        with open("users.json") as f:
            users = json.load(f)

    if email in users:
        return jsonify({"error": "User exists"}), 400

    users[email] = {"password": password, "name": name}

    with open("users.json", "w") as f:
        json.dump(users, f, indent=2)

    return jsonify({"message": "Registered"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not os.path.exists("users.json"):
        return jsonify({"error": "Invalid credentials"}), 401

    with open("users.json") as f:
        users = json.load(f)

    if email not in users or users[email]["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login success", "name": users[email]["name"]})

# --------------------------------------------------
# RESUME
# --------------------------------------------------

@app.route("/parse_resume", methods=["POST"])
def parse_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file"}), 400

    text = extract_text(request.files["resume"])
    data = extract_resume_with_llama(text)

    return jsonify({
        "skills": data.get("skills", []),
        "experience": data.get("years_of_experience", "0"),
        "education": data.get("education", "NA"),
        "certifications": data.get("certifications", [])
    })

# --------------------------------------------------
# 🔥 JD + RESUME ANALYSIS (FIXED ROUTE)
# --------------------------------------------------

@app.route("/analyze_with_jd", methods=["POST"])
def analyze_with_jd():
    try:
        # Handle FormData (File Upload)
        if 'jd_file' not in request.files:
            return jsonify({"error": "jd_file is required"}), 400
        
        jd_file = request.files['jd_file']
        user_skills_str = request.form.get('user_skills', '[]')
        
        try:
            user_skills = json.loads(user_skills_str)
        except:
            user_skills = []

        # Extract text from the uploaded JD file
        job_description = extract_text(jd_file)

        if not job_description:
             return jsonify({"error": "Empty or unreadable Job Description file"}), 400

        # Analyze usage of AI to extract skills from JD
        jd_analysis = analyze_text_with_llama(job_description)
        jd_skills = jd_analysis.get("skills", [])
        
        # Calculate Gap
        # Simple case-insensitive match
        user_skills_lower = {s.lower() for s in user_skills}
        jd_skills_lower = {s.lower() for s in jd_skills}
        
        common_lower = user_skills_lower.intersection(jd_skills_lower)
        missing_lower = jd_skills_lower - user_skills_lower
        
        # Restore original casing for display (best effort)
        common_skills = [s for s in user_skills if s.lower() in common_lower]
        missing_skills = [s for s in jd_skills if s.lower() in missing_lower]
        
        # If no overlap found?
        if not common_skills and not missing_skills:
             # Fallback if extraction failed
             missing_skills = jd_skills

        analysis = {
            "common_skills": common_skills,
            "missing_skills": missing_skills, 
            "llama_recommendations": f"Based on the JD, you are missing: {', '.join(missing_skills[:5])}. Focus on these areas.",
            "roadmap": [],
            "institutions": []
        }

        return jsonify(analysis), 200

    except Exception as e:
        print(f"Analyze JD Error: {e}")
        return jsonify({"error": str(e)}), 500

# --------------------------------------------------
# SKILLS
# --------------------------------------------------

@app.route("/analyze_skills", methods=["POST"])
def analyze_skills():
    data = request.json
    role = data.get("role")
    user_skills = data.get("user_skills", [])

    market_skills = get_market_skills(role)
    recommendations = analyze_skills_with_llama(user_skills, market_skills)

    return jsonify({
        "market_skills": market_skills,
        "recommendations": recommendations
    })

# --------------------------------------------------
# QUIZ
# --------------------------------------------------

@app.route("/generate_quiz", methods=["POST"])
def generate_quiz():
    data = request.json
    return jsonify(generate_quiz_questions(
        data.get("role"), data.get("missing_skills", [])
    ))


@app.route("/verify_skills", methods=["POST"])
def verify_skills():
    data = request.json
    return jsonify(generate_verification_questions(
        data.get("role"), data.get("matched_skills", [])
    ))

# --------------------------------------------------
# INTERVIEW PREP
# --------------------------------------------------

@app.route("/interview_prep", methods=["POST"])
def interview_prep():
    role = request.json.get("role")
    return jsonify(get_interview_prep_data(role))

@app.route("/interview_experiences", methods=["GET", "POST"])
def interview_experiences():
    if request.method == "GET":
        try:
            if os.path.exists("interview_experiences.json"):
                with open("interview_experiences.json", "r") as f:
                    return jsonify(json.load(f))
            return jsonify([])
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    if request.method == "POST":
        try:
            new_exp = request.json
            experiences = []
            if os.path.exists("interview_experiences.json"):
                with open("interview_experiences.json", "r") as f:
                    experiences = json.load(f)
            
            experiences.append(new_exp)
            
            with open("interview_experiences.json", "w") as f:
                json.dump(experiences, f, indent=4)
                
            return jsonify({"message": "Experience added"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/find_mentors", methods=["POST"])
def find_mentors():
    try:
        data = request.json
        role = data.get("role", "General")
        
        # Mock Response for stability (Selenium scraper is risky in prod)
        mentors = [
            {
                "name": f"Expert {role} Mentor",
                "title": f"Senior {role} Engineer",
                "company": "Tech Giants Inc.",
                "topics": [role, "System Design", "Career Growth"],
                "rating": 4.9,
                "status": "Available",
                "cost": "$50/session",
                "profile_url": "#"
            },
            {
                "name": "Sarah Connor",
                "title": "Tech Lead",
                "company": "Skynet Systems",
                "topics": ["Leadership", "Management", role],
                "rating": 4.8,
                "status": "Busy",
                "cost": "$80/session",
                "profile_url": "#"
            }
        ]
        return jsonify(mentors)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------------------------------
# EDUCATOR GAP
# --------------------------------------------------

@app.route('/educator_gap', methods=['POST'])
def analyze_curriculum():
    try:
        data = request.get_json()
        description = data.get('description', '').strip()

        if not description:
            return jsonify({"error": "No description provided"}), 400

        skills_data_file = 'job_skills.json'
        result = analyze_and_suggest(description, skills_data_file)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------------------------------
# CURRICULUM PLAN
# --------------------------------------------------

@app.route('/curriculum_plan')
def get_curriculum_plan():
    language = request.args.get('language')
    if not language:
        return jsonify({'error': 'Language parameter is required'}), 400

    try:
        curriculum_plan = google_search.get_curriculum_plan(language)
        return jsonify(curriculum_plan)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "Backend running 🚀"})

# --------------------------------------------------
# APP RUN
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
