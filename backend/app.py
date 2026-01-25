from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv

# ---------------- SAFE IMPORTS ----------------
try:
    from models.resume_text_extractor import extract_text
    from models.resume_parser import extract_resume_with_llama
    from models.description_analyzer import analyze_text_with_llama
    from models.skills_analyzer import analyze_skills_with_llama, get_market_skills
    from models.google_api import GoogleSearchAPI
    from models.educator_gap import analyze_and_suggest
    from models.quiz_generator import generate_quiz_questions, generate_verification_questions
    from models.interview_prep import get_interview_prep_data
except Exception as e:
    print("IMPORT ERROR:", e)

# ---------------- APP SETUP ----------------
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- ENV VARIABLES ----------------
GOOGLE_API_KEY = os.getenv("Google_api_key")
CSE_ID = os.getenv("CSE_ID")

google_search = None
if GOOGLE_API_KEY and CSE_ID:
    google_search = GoogleSearchAPI(GOOGLE_API_KEY, CSE_ID)
else:
    print("WARNING: Google API Key or CSE ID missing")

# ---------------- AUTH ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    users = {}
    if os.path.exists("users.json"):
        with open("users.json", "r") as f:
            try:
                users = json.load(f)
            except:
                pass

    if email in users:
        return jsonify({"error": "User already exists"}), 400

    users[email] = {"password": password, "name": name}
    with open("users.json", "w") as f:
        json.dump(users, f, indent=4)

    return jsonify({"message": "Registered successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not os.path.exists("users.json"):
        return jsonify({"error": "Invalid credentials"}), 401

    with open("users.json", "r") as f:
        users = json.load(f)

    user = users.get(email)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "name": user.get("name")})


# ---------------- RESUME ----------------
@app.route("/parse_resume", methods=["POST"])
def parse_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    file = request.files["resume"]
    text = extract_text(file)
    parsed = extract_resume_with_llama(text)

    return jsonify({
        "skills": parsed.get("skills", []),
        "experience": parsed.get("years_of_experience", "0"),
        "education": parsed.get("education", "Not Mentioned"),
        "certifications": parsed.get("certifications", [])
    })


# ---------------- SKILL GAP ----------------
@app.route("/analyze_skills", methods=["POST"])
def analyze_skills():
    data = request.json or {}
    role = data.get("role")
    user_skills = data.get("user_skills", [])

    if not role:
        return jsonify({"error": "Role required"}), 400

    market_skills = get_market_skills(role)

    normalize = lambda s: "".join(c for c in s.lower() if c.isalnum() or c in "+#.")
    user_set = {normalize(s) for s in user_skills}

    common, missing = [], []
    for skill in market_skills:
        if normalize(skill) in user_set:
            common.append(skill)
        else:
            missing.append(skill)

    recommendations = analyze_skills_with_llama(user_skills, missing) if missing else []

    return jsonify({
        "common_skills": common,
        "missing_skills": missing,
        "llama_recommendations": recommendations
    })


# ---------------- JD ANALYSIS ----------------
@app.route("/analyze_with_jd", methods=["POST"])
def analyze_with_jd():
    if "jd_file" not in request.files:
        return jsonify({"error": "No JD file"}), 400

    jd_text = extract_text(request.files["jd_file"])
    result = analyze_text_with_llama(jd_text)

    return jsonify(result)


# ---------------- QUIZ ----------------
@app.route("/generate_quiz", methods=["POST"])
def generate_quiz():
    data = request.json or {}
    role = data.get("role", "General")
    missing = data.get("missing_skills", [])
    return jsonify(generate_quiz_questions(role, missing))


@app.route("/verify_skills", methods=["POST"])
def verify_skills():
    data = request.json or {}
    role = data.get("role", "General")
    matched = data.get("matched_skills", [])
    return jsonify(generate_verification_questions(role, matched))


# ---------------- INTERVIEW PREP ----------------
@app.route("/interview_prep", methods=["POST"])
def interview_prep():
    role = request.json.get("role")
    if not role:
        return jsonify({"error": "Role required"}), 400
    return jsonify(get_interview_prep_data(role))


# ---------------- EDUCATOR GAP ----------------
@app.route("/educator_gap", methods=["POST"])
def educator_gap():
    description = request.json.get("description")
    if not description:
        return jsonify({"error": "Description required"}), 400
    return jsonify(analyze_and_suggest(description, "job_skills.json"))


# ---------------- CURRICULUM ----------------
@app.route("/curriculum_plan")
def curriculum_plan():
    language = request.args.get("language")
    if not language:
        return jsonify({"error": "Language required"}), 400

    if not google_search:
        return jsonify({"error": "Google API not configured"}), 500

    return jsonify(google_search.get_curriculum_plan(language))


# ---------------- HEALTH CHECK ----------------
@app.route("/")
def health():
    return jsonify({"status": "Backend running"})


# ---------------- RENDER ENTRY ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
