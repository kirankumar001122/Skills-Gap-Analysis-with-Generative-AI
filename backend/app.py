
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
from models.resume_text_extractor import extract_text
from models.resume_parser import extract_resume_with_llama
from models.description_analyzer import analyze_text_with_llama
from models.scrapper import LinkedInJobScraper
from models.ectract_skills import process_job_descriptions
from models.skills_analyzer import analyze_skills_with_llama, get_market_skills
from models.google_api import GoogleSearchAPI
from models.educator_gap import analyze_and_suggest
from models.quiz_generator import generate_quiz_questions, generate_verification_questions
from models.interview_prep import get_interview_prep_data

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize Google Search API
GOOGLE_API_KEY = os.getenv("Google_api_key")
CSE_ID = os.getenv("CSE_ID")
google_search = GoogleSearchAPI(GOOGLE_API_KEY, CSE_ID)

@app.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        users_file = 'users.json'
        users = {}
        
        # Load existing users
        if os.path.exists(users_file):
            with open(users_file, 'r') as f:
                try:
                    users = json.load(f)
                except json.JSONDecodeError:
                    users = {}

        # Check if user exists
        if email in users:
            return jsonify({"error": "User already exists"}), 400

        # Save new user
        users[email] = {
            "password": password, # In a real production app, hash this!
            "name": name
        }

        with open(users_file, 'w') as f:
            json.dump(users, f, indent=4)

        return jsonify({"message": "Registration successful"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    """Login a user."""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        users_file = 'users.json'
        if not os.path.exists(users_file):
            return jsonify({"error": "Invalid credentials"}), 401

        with open(users_file, 'r') as f:
            try:
                users = json.load(f)
            except json.JSONDecodeError:
                users = {}

        user = users.get(email)
        if not user or user.get('password') != password:
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({"message": "Login successful", "name": user.get('name')}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/parse_resume', methods=['POST'])
def parse_resume():
    """API endpoint to parse resume and extract details."""
    try:
        if 'resume' not in request.files:
            return jsonify({"error": "No resume file uploaded"}), 400
        
        file = request.files['resume']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Extract Text from File
        try:
            text = extract_text(file)
        except Exception as e:
            return jsonify({"error": f"Failed to read file: {str(e)}"}), 400

        # Parse with AI
        try:
            parsed_data = extract_resume_with_llama(text)
            
            # Add simple extraction backup if AI fails to format
            if not parsed_data.get('skills'):
                 parsed_data['skills'] = []
            
            # Ensure return format matches frontend expectation
            return jsonify({
                "skills": parsed_data.get('skills', []),
                "experience": parsed_data.get('years_of_experience', "0 Years"),
                "certifications": parsed_data.get('certifications', []),
                "education": parsed_data.get('education', "Not Mentioned")
            })
            
        except Exception as e:
            print(f"AI Parsing Error: {e}")
            return jsonify({"error": "Failed to analyze resume content"}), 500

    except Exception as e:
        print(f"Critical Error in parse_resume: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/analyze_skills', methods=['POST'])
def analyze_skills():
    """API endpoint to analyze job skills and compare with user-provided skills."""
    try:
        data = request.json
        if not data:
             return jsonify({"error": "Invalid JSON data"}), 400
             
        role = data.get('role', '').strip()
        user_skills = data.get('user_skills', [])

        if not role:
            return jsonify({"error": "Role is required for analysis"}), 400

        # Step 1: Get Market Skills dynamically
        # This now uses the improved AI-driven function from skills_analyzer.py
        market_skills = get_market_skills(role)

        # Step 2: Compare skills (Case-Insensitive & Normalized)
        # Normalize: remove special chars, lowercase, strip
        def normalize_skill(s):
            # Preserve alnum and special chars relevant to tech (C++, C#, .js)
            return "".join(c for c in s if c.isalnum() or c in "+#.").lower()

        # Debug Logging
        print(f"DEBUG: User Skills Raw: {user_skills}")
        print(f"DEBUG: Market Skills Raw: {market_skills}")

        user_skills_set = {normalize_skill(s) for s in user_skills}
        market_skills_map = {normalize_skill(s): s for s in market_skills} 
        
        print(f"DEBUG: User Skills Normalized: {user_skills_set}")
        
        common_skills = []
        missing_skills = []
        
        for market_skill_norm, market_skill_original in market_skills_map.items():
            match_found = False
            if market_skill_norm in user_skills_set:
                match_found = True
                print(f"DEBUG: Exact match: {market_skill_original}")
            else:
                # Fuzzy Match Attempt
                for user_skill_norm in user_skills_set:
                    # Prevent short substring false positives (e.g. "c" in "css")
                    if len(market_skill_norm) > 2 and len(user_skill_norm) > 2:
                        if market_skill_norm in user_skill_norm or user_skill_norm in market_skill_norm:
                            match_found = True
                            print(f"DEBUG: Fuzzy match found: {market_skill_original} ~= {user_skill_norm}")
                            break
            
            if match_found:
                common_skills.append(market_skill_original)
            else:
                missing_skills.append(market_skill_original)
        
        print(f"DEBUG: Final Common Skills: {common_skills}")

        # Ensure we don't have empty missing skills if user matches everything (rare but possible)
        # If user has everything, maybe suggest advanced niche skills? For now, we trust the AI recommendations to handle "up-skilling".

        # Step 3: Get Recommendations
        llama_recommendations = []
        if missing_skills:
            llama_recommendations = analyze_skills_with_llama(user_skills, missing_skills)
            
            # 1. Handle explicit error from helper
            if isinstance(llama_recommendations, dict) and "error" in llama_recommendations:
                print(f"Recommendation generation error: {llama_recommendations}")
                llama_recommendations = [] # Trigger fallback below

            # 2. Handle empty list or failed AI response (Fallback)
            if not llama_recommendations or (isinstance(llama_recommendations, list) and len(llama_recommendations) == 0):
                print("AI recommendations empty, using fallback from missing skills.")
                # Fallback: Create simple recommendation objects from missing skills
                llama_recommendations = [
                    {"skill": skill, "probability": f"{0.9 - (i * 0.05):.2f}"} 
                    for i, skill in enumerate(missing_skills[:5])
                ]

        # Step 5: Generate Roadmap
        roadmap = []
        # Ensure llama_recommendations is a list before iterating
        rec_list = llama_recommendations if isinstance(llama_recommendations, list) else []
        
        for i, rec in enumerate(rec_list):
            if not isinstance(rec, dict): continue
            
            skill = rec.get('skill')
            if not skill:
                continue
                
            # Fetch Standard Resources (Coursera/Udemy/Etc)
            try:
                resources_raw = google_search.get_learning_path(skill)
            except Exception as e:
                print(f"Error fetching resources for {skill}: {e}")
                resources_raw = []

            # Fetch YouTube Resources
            try:
                youtube_videos = google_search.get_youtube_videos(skill)
            except Exception as e:
                print(f"Error fetching videos for {skill}: {e}")
                youtube_videos = []

            # Fetch Certifications (Udemy / Infosys Springboard)
            try:
                certifications = google_search.get_certifications(skill)
            except Exception as e:
                print(f"Error fetching certifications for {skill}: {e}")
                certifications = []

            formatted_resources = []

            # Add Certifications FIRST (as requested)
            if certifications:
                for cert in certifications[:2]: # Top 2 certs
                    formatted_resources.append({
                        "title": cert.get("title", f"{skill} Certification"),
                        "type": "Certification",
                        "provider": cert.get("provider", "External"), # Pass provider
                        "url": cert.get("link", "#")
                    })
            
            # Add top 2 text resources
            if isinstance(resources_raw, list) and resources_raw:
                for res in resources_raw[:2]:
                    formatted_resources.append({
                        "title": res.get("title", "Learning Resource"),
                        "type": "Course",
                        "url": res.get("link", "#")
                    })
            
            # Add top 2 YouTube videos
            if youtube_videos:
                for video in youtube_videos[:2]:
                    formatted_resources.append({
                        "title": video.get("title", f"{skill} Tutorial"),
                        "type": "Video",
                        "url": video.get("link", "#")
                    })

            # Force at least one YouTube link if missing
            if not any(r['type'] == 'Video' for r in formatted_resources):
                 formatted_resources.append({
                    "title": f"Watch {skill} Tutorials",
                    "type": "Video",
                    "url": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+tutorial"
                })

            # Fallback if nothing found
            if not formatted_resources:
                formatted_resources.append({
                    "title": f"{skill} Tutorials",
                    "type": "Search",
                    "url": f"https://www.google.com/search?q=best+free+course+learn+{skill.replace(' ', '+')}"
                })
            
            roadmap.append({
                "week": f"WEEK {i + 1:02d}",
                "title": f"Master {skill}",
                "description": f"Comprehensive resources to build proficiency in {skill}.",
                "resources": formatted_resources
            })

        response_data = {
            "common_skills": common_skills,
            "missing_skills": missing_skills,
            "llama_recommendations": llama_recommendations,
            "roadmap": roadmap
        }

        return jsonify(response_data)


    except Exception as e:
        print(f"Critical Error in analyze_skills: {e}")
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500

@app.route('/analyze_with_jd', methods=['POST'])
def analyze_with_jd():
    """API endpoint to analyze user skills against an uploaded Job Description file."""
    try:
        if 'jd_file' not in request.files:
            return jsonify({"error": "No Job Description file uploaded"}), 400
        
        file = request.files['jd_file']
        user_skills_json = request.form.get('user_skills', '[]')
        try:
            user_skills = json.loads(user_skills_json)
        except:
            user_skills = []

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Extract Text from JD File
        try:
            jd_text = extract_text(file)
        except Exception as e:
            return jsonify({"error": f"Failed to read file: {str(e)}"}), 400

        # Extract Skills from JD Text using Llama
        try:
            analysis_result = analyze_text_with_llama(jd_text)
            jd_required_skills = analysis_result.get('skills', [])
            
            # Use 'role' from analysis if available, or generic. 
            # Note: analyze_text_with_llama currently has a bug returning 'role' in certs field, 
            # but we primarily need skills. We can infer a role or just use "Custom Job Role".
            role = "Target Job Role" 
        except Exception as e:
            print(f"JD AI Parsing Error: {e}")
            return jsonify({"error": "Failed to analyze job description content"}), 500

        # Use the same comparison logic as analyze_skills
        # Normalize: remove special chars, lowercase, strip
        def normalize_skill(s):
            # Preserve alnum and special chars relevant to tech (C++, C#, .js)
            return "".join(c for c in s if c.isalnum() or c in "+#.").lower()

        user_skills_set = {normalize_skill(s) for s in user_skills}
        required_skills_map = {normalize_skill(s): s for s in jd_required_skills}
        
        common_skills = []
        missing_skills = []
        
        for req_skill_norm, req_skill_original in required_skills_map.items():
            match_found = False
            if req_skill_norm in user_skills_set:
                match_found = True
            else:
                # Fuzzy Match Attempt
                for user_skill_norm in user_skills_set:
                     if len(req_skill_norm) > 2 and len(user_skill_norm) > 2:
                        if req_skill_norm in user_skill_norm or user_skill_norm in req_skill_norm:
                            match_found = True
                            print(f"Fuzzy match with JD found: {req_skill_original} ~= {user_skill_norm}")
                            break

            if match_found:
                common_skills.append(req_skill_original)
            else:
                missing_skills.append(req_skill_original)

        # Get Recommendations
        llama_recommendations = []
        if missing_skills:
            llama_recommendations = analyze_skills_with_llama(user_skills, missing_skills)
            
            # Handle potential AI errors
            if not llama_recommendations or (isinstance(llama_recommendations, list) and len(llama_recommendations) == 0) or (isinstance(llama_recommendations, dict) and "error" in llama_recommendations):
                # Fallback
                llama_recommendations = [
                    {"skill": skill, "probability": f"{0.9 - (i * 0.05):.2f}"} 
                    for i, skill in enumerate(missing_skills[:5])
                ]

        # Generate Roadmap (Reuse logic? For now, duplicate simplified logic to avoid huge refactor)
        roadmap = []
        rec_list = llama_recommendations if isinstance(llama_recommendations, list) else []
        
        for i, rec in enumerate(rec_list):
            if not isinstance(rec, dict): continue
            
            skill = rec.get('skill')
            if not skill: continue

            step_resources = []
            step_certifications = []
            
            # 1. Fetch Certifications (Udemy / Infosys Springboard)
            try:
                certifications_found = google_search.get_certifications(skill)
            except:
                certifications_found = []

            # Always ensure we have at least generic links for requested providers
            if not certifications_found:
                step_certifications.append({
                    "title": f"Master {skill} on Udemy",
                    "link": f"https://www.udemy.com/courses/search/?q={skill.replace(' ', '+')}",
                    "provider": "Udemy",
                    "type": "Certification"
                })
                step_certifications.append({
                    "title": f"Log in & Search {skill} on Infosys Springboard",
                    "link": "https://infyspringboard.onwingspan.com/",
                    "provider": "Infosys Springboard",
                    "type": "Certification"
                })
            else:
                 for cert in certifications_found[:3]: # Top 3 specific certs
                    step_certifications.append({
                        "title": cert.get("title", f"{skill} Certification"),
                        "type": "Certification",
                        "provider": cert.get("provider", "External"),
                        "url": cert.get("link", "#")
                    })


            # 2. Fetch Video Resources (PRIORITY)
            try:
                 youtube_videos = google_search.get_youtube_videos(skill)
                 if youtube_videos:
                    for video in youtube_videos[:3]: # Top 3 Videos
                        step_resources.append({
                            "title": video.get("title", "Video"),
                            "type": "Video",
                            "url": video.get("link", "#")
                        })
            except: pass

            # 3. Text Resources (Fallback if no videos or just to add variety)
            try:
                resources_raw = google_search.get_learning_path(skill)
                if isinstance(resources_raw, list) and resources_raw:
                    for res in resources_raw[:2]:
                        step_resources.append({
                            "title": res.get("title", "Course"),
                            "type": "Course",
                            "url": res.get("link", "#")
                        })
            except: pass
            
            # Fallback
            if not step_resources:
                 step_resources.append({
                     "title": f"Search {skill} Tutorials",
                     "type": "Search",
                     "url": f"https://www.google.com/search?q=learn+{skill.replace(' ', '+')}"
                 })

            roadmap.append({
                "week": f"WEEK {i + 1:02d}",
                "title": f"Master {skill}",
                "description": f"Bridge the gap for your target role by mastering {skill}.",
                "resources": step_resources,
                "certifications": step_certifications
            })

        response_data = {
            "common_skills": common_skills,
            "missing_skills": missing_skills,
            "llama_recommendations": llama_recommendations,
            "roadmap": roadmap
        }

        return jsonify(response_data)
    except Exception as e:
        print(f"Critical Error in analyze_with_jd: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


# ------------------------------------------------------------------
# Interview Experience Vault Endpoints
# ------------------------------------------------------------------
INTERVIEW_FILE = 'interview_experiences.json'

@app.route('/interview_experiences', methods=['GET'])
def get_interviews():
    """Retrieve all shared interview experiences."""
    if not os.path.exists(INTERVIEW_FILE):
        return jsonify([])
    try:
        with open(INTERVIEW_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        print(f"Error reading interview file: {e}")
        return jsonify([])

@app.route('/interview_experiences', methods=['POST'])
def add_interview():
    """Add a new interview experience."""
    try:
        data = request.json
        if not data.get('company') or not data.get('role'):
            return jsonify({"error": "Company and Role are required"}), 400

        # Load existing
        experiences = []
        if os.path.exists(INTERVIEW_FILE):
            with open(INTERVIEW_FILE, 'r') as f:
                try:
                    experiences = json.load(f)
                except: pass
        
        # Add new
        from datetime import datetime
        new_entry = {
            "company": data.get('company'),
            "role": data.get('role'),
            "experience": data.get('experience', ''),
            "questions": data.get('questions', ''),
            "user": data.get('user', 'Anonymous'),
            "date": datetime.now().strftime("%Y-%m-%d")
        }
        experiences.insert(0, new_entry) # Prepend to show newest first

        # Save
        with open(INTERVIEW_FILE, 'w') as f:
            json.dump(experiences, f, indent=4)

        return jsonify({"message": "Experience shared successfully!", "entry": new_entry})

    except Exception as e:
        print(f"Error saving interview experience: {e}")
        return jsonify({"error": str(e)}), 500



        if not language:
            return jsonify({"error": "Language parameter is required"}), 400

        # Fetch learning resources using the Google Custom Search API
        learning_resources = google_search.get_learning_path(language)

        if isinstance(learning_resources, str):  # In case of an error message
            return jsonify({"error": learning_resources}), 500

        # Return the fetched learning resources
        return jsonify({
            "language": language,
            "resources": learning_resources
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/find_mentors', methods=['POST'])
def find_mentors():
    """API endpoint to find LinkedIn mentors."""
    try:
        data = request.json
        role = data.get('role')
        if not role:
            return jsonify({"error": "Role is required"}), 400
            
        mentors = google_search.get_linkedin_mentors(role)
        return jsonify(mentors)
    except Exception as e:
        print(f"Error searching mentors: {e}")
        return jsonify([]), 200 # Return empty list gracefully

@app.route('/generate_quiz', methods=['POST'])
def generate_quiz():
    """API endpoint to generate quiz questions based on missing skills."""
    try:
        data = request.json
        role = data.get('role', 'General')
        missing_skills = data.get('missing_skills', [])

        questions = generate_quiz_questions(role, missing_skills)
        return jsonify(questions)

    except Exception as e:
        print(f"Quiz Generation Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/verify_skills', methods=['POST'])
def verify_skills():
    """API endpoint to generate verification quiz for MATCHED skills."""
    try:
        data = request.json
        role = data.get('role', 'General')
        matched_skills = data.get('matched_skills', [])

        questions = generate_verification_questions(role, matched_skills)
        return jsonify(questions)

    except Exception as e:
        print(f"Verification Quiz Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/interview_prep', methods=['POST'])
def interview_prep():
    """API endpoint to get interview prep data."""
    try:
        data = request.json
        role = data.get('role')
        if not role:
            return jsonify({"error": "Role is required"}), 400
            
        prep_data = get_interview_prep_data(role)
        return jsonify(prep_data)
        
    except Exception as e:
        print(f"Interview Prep Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/educator_gap', methods=['POST'])
def analyze_curriculum():
    """
    API endpoint to analyze a tutor's curriculum and suggest improvements.
    """
    try:
        # Get the description from the POST request body
        data = request.get_json()
        description = data.get('description', '').strip()

        # Validate that a description was provided
        if not description:
            return jsonify({"error": "No description provided"}), 400

        # Path to the skills.json file
        skills_data_file = 'job_skills.json'

        # Analyze the curriculum and get suggestions for improvement
        result = analyze_and_suggest(description, skills_data_file)

        # Return the extracted data and suggestions
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/curriculum_plan')
def get_curriculum_plan():
    language = request.args.get('language')
    if not language:
        return jsonify({'error': 'Language parameter is required'}), 400

    try:
        # Use the instantiated google_search object to fetch the curriculum plan
        curriculum_plan = google_search.get_curriculum_plan(language)
        return jsonify(curriculum_plan)
    except Exception as e:
        return jsonify({'error': str(e)}), 500









