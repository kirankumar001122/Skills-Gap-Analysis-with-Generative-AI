from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv

# Load environment variables
print("✅ app.py loaded successfully")
load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------------------
# Health check (IMPORTANT)
# ---------------------------
@app.route("/")
def home():
    return jsonify({
        "status": "ok",
        "message": "Skills Gap Backend is running 🚀"
    })


# ---------------------------
# Environment check
# ---------------------------
@app.route("/env-check")
def env_check():
    return jsonify({
        "GOOGLE_API_KEY_SET": bool(os.getenv("Google_api_key")),
        "CSE_ID_SET": bool(os.getenv("CSE_ID"))
    })


# ---------------------------
# Auth (simple file-based)
# ---------------------------
USERS_FILE = "users.json"

@app.route("/register", methods=["POST"])
def register():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")

    if not email or not password:
        return jsonify({"error": "Email & password required"}), 400

    users = {}
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            users = json.load(f)

    if email in users:
        return jsonify({"error": "User already exists"}), 400

    users[email] = {"password": password, "name": name}

    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

    return jsonify({"message": "Registered successfully"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email")
    password = data.get("password")

    if not os.path.exists(USERS_FILE):
        return jsonify({"error": "Invalid credentials"}), 401

    with open(USERS_FILE, "r") as f:
        users = json.load(f)

    user = users.get(email)
    if not user or user["password"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful", "name": user["name"]})


# ---------------------------
# Placeholder APIs (SAFE)
# ---------------------------
@app.route("/analyze_skills", methods=["POST"])
def analyze_skills():
    data = request.json or {}
    role = data.get("role", "")
    skills = data.get("user_skills", [])

    return jsonify({
        "role": role,
        "user_skills": skills,
        "missing_skills": [],
        "roadmap": []
    })


@app.route("/interview_prep", methods=["POST"])
def interview_prep():
    data = request.json or {}
    role = data.get("role", "")

    return jsonify({
        "role": role,
        "questions": []
    })


# -------------------------------------------------
# App Entry Point (REQUIRED FOR RENDER)
# -------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

