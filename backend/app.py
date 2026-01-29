from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

# --------------------------------------------------
# SAFE PLACEHOLDERS (NO HEAVY IMPORTS)
# --------------------------------------------------

def extract_text(file):
    try:
        return file.read().decode("utf-8", errors="ignore")
    except:
        return ""

def extract_resume_with_llama(*args, **kwargs):
    return {
        "skills": ["Python", "Flask", "React"],
        "years_of_experience": 2,
        "education": "BCA / MCA",
        "certifications": []
    }

def analyze_text_with_llama(*args, **kwargs):
    return {
        "skills": ["Docker", "AWS", "Git"]
    }

def analyze_skills_with_llama(*args, **kwargs):
    return ["Docker", "AWS"]

def get_market_skills(*args, **kwargs):
    return ["Docker", "AWS", "Kubernetes"]

def analyze_and_suggest(*args, **kwargs):
    return {"message": "AI disabled for deployment demo"}

def generate_quiz_questions(*args, **kwargs):
    return []

def generate_verification_questions(*args, **kwargs):
    return []

def get_interview_prep_data(*args, **kwargs):
    return {"message": "AI disabled"}

class GoogleSearchAPI:
    def __init__(self, *args, **kwargs):
        pass

    def get_curriculum_plan(self, *args, **kwargs):
        return {
            "plan": [
                {"week": 1, "topic": "Basics"},
                {"week": 2, "topic": "Advanced Concepts"}
            ]
        }

# --------------------------------------------------
# APP SETUP
# --------------------------------------------------

app = Flask(__name__)
CORS(app)

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
        "skills": data["skills"],
        "experience": data["years_of_experience"],
        "education": data["education"],
        "certifications": data["certifications"]
    })

# --------------------------------------------------
# JD ANALYSIS
# --------------------------------------------------

@app.route("/analyze_with_jd", methods=["POST"])
def analyze_with_jd():
    if 'jd_file' not in request.files:
        return jsonify({"error": "jd_file is required"}), 400

    jd_text = extract_text(request.files['jd_file'])
    jd_analysis = analyze_text_with_llama(jd_text)

    return jsonify({
        "common_skills": [],
        "missing_skills": jd_analysis.get("skills", []),
        "llama_recommendations": "AI disabled for deployment demo",
        "roadmap": [],
        "institutions": []
    })

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
    return jsonify([])

@app.route("/verify_skills", methods=["POST"])
def verify_skills():
    return jsonify([])

# --------------------------------------------------
# INTERVIEW PREP
# --------------------------------------------------

@app.route("/interview_prep", methods=["POST"])
def interview_prep():
    return jsonify({"message": "AI disabled"})

# --------------------------------------------------
# EDUCATOR GAP
# --------------------------------------------------

@app.route('/educator_gap', methods=['POST'])
def educator_gap():
    return jsonify({"message": "AI disabled"})

# --------------------------------------------------
# CURRICULUM PLAN
# --------------------------------------------------

@app.route('/curriculum_plan')
def curriculum_plan():
    language = request.args.get('language')
    return jsonify({"language": language, "plan": "Demo plan"})

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.route("/")
def home():
    return {"status": "Backend running successfully (Render safe)"}

# --------------------------------------------------
# APP RUN
# --------------------------------------------------

if __name__ == "__main__":
    app.run()
