from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv

from models.resume_text_extractor import extract_text
from models.resume_parser import extract_resume_with_llama
from models.description_analyzer import analyze_text_with_llama
from models.skills_analyzer import analyze_skills_with_llama, get_market_skills
from models.google_api import GoogleSearchAPI
from models.educator_gap import analyze_and_suggest
from models.quiz_generator import generate_quiz_questions, generate_verification_questions
from models.interview_prep import get_interview_prep_data

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


# --------------------------------------------------
# EDUCATOR GAP
# --------------------------------------------------

@app.route("/educator_gap", methods=["POST"])
def educator_gap():
    description = request.json.get("description")
    return jsonify(analyze_and_suggest(description, "job_skills.json"))


# --------------------------------------------------
# HEALTH CHECK (REQUIRED FOR RENDER)
# --------------------------------------------------

@app.route("/")
def health():
    return jsonify({"status": "Backend running 🚀"})


# --------------------------------------------------
# ❌ NO app.run()
# Gunicorn will start the app on Render
# --------------------------------------------------
