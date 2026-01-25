# import requests
# from collections import Counter

# # API URL for LLaMA 3.1 model
# OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"

# # Define the prompt template for LLaMA API recommendation
# LLAMA_RECOMMENDATION_PROMPT = """
# You are an AI designed to help job seekers improve their chances of getting a job by recommending skills they should learn. 
# Given the following data, compare the user's current skills with the skills in demand in the job market, 
# and recommend the top skills the user should learn. Assign each skill a probability score indicating 
# how important it is for the user to learn that skill to improve their job prospects.

# User's current skills:
# {user_skills}

# Skills in demand from job market:
# {market_skills}

# For each missing skill, recommend whether the user should learn it and assign a probability (between 0 and 1) 
# indicating the likelihood that learning this skill will improve their chances of getting a job. 
# Respond in this format:

# Skill: <skill_name>, Probability: <probability>
# """

# def analyze_skills_with_llama(user_skills, missing_skills):
#     """Send skills data to LLaMA API and get skill recommendations with probabilities."""
#     # Format the LLaMA prompt with user and job market skills
#     prompt = LLAMA_RECOMMENDATION_PROMPT.format(
#         user_skills=", ".join(user_skills),
#         market_skills=", ".join(missing_skills)
#     )

#     # Send the request to LLaMA API
#     response = requests.post(OLLAMA_API_URL, json={"prompt": prompt, "model": "llama3.1"}, timeout=60)
    
#     if response.status_code == 200:
#         try:
#             # Get the response content as a string
#             response_text = response.text
            
#             # Print the raw response for debugging
#             print("LLaMA API raw response:", response_text)

#             # Now parse it as needed (assuming the response is well-formed)
#             response_data = response_text.strip().split("\n")

#             # Initialize a list to hold skill recommendations
#             skill_recommendations = []

#             # Process the response into structured fields
#             for line in response_data:
#                 if "Skill:" in line and "Probability:" in line:
#                     parts = line.split(",")
#                     skill_name = parts[0].split("Skill:")[1].strip()
#                     probability = parts[1].split("Probability:")[1].strip()
#                     skill_recommendations.append({
#                         "skill": skill_name,
#                         "probability": probability
#                     })

#             return skill_recommendations

#         except Exception as e:
#             print(f"Error parsing the LLaMA response: {e}")
#             return {"error": "Failed to parse LLaMA API response.", "response": response_text}
#     else:
#         raise ValueError(f"LLaMA API error: {response.status_code}, {response.text}")

# def aggregate_skills(user_skills, job_skills_data):
#     """
#     Aggregates all skills from the job descriptions and compares them with the user's skills.
#     Returns the common skills and missing skills.
#     """
#     # Step 1: Aggregate all skills from the job descriptions
#     all_skills = []
#     for job, details in job_skills_data.items():
#         all_skills.extend(details.get('skills', []))

#     # Count frequency of each skill
#     skill_counts = Counter(all_skills)

#     # Step 2: Compare user skills with job market skills to find missing skills
#     user_skills_set = set(user_skills)
#     required_skills = set(skill_counts.keys())
#     missing_skills = list(required_skills - user_skills_set)

#     return skill_counts, missing_skills
# import requests
# import re
# from collections import Counter

# # API URL for LLaMA 3.1 model
# OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"

# # List of valid technical skills
# VALID_TECHNICAL_SKILLS = [
#     "Python", "Java", "C++", "C#", "Golang", "SQL", "NoSQL", "REST", "Microservices", 
#     "Docker", "Kubernetes", "Terraform", "Jenkins", "AWS", "Azure", "GCP", "Git", 
#     "GitLab", "OAuth", "SAML", "CI/CD", "DevOps", "TensorFlow", "PyTorch", "NLP"
#     # Add more as necessary...
# ]

# # Define the prompt template for LLaMA API recommendation
# LLAMA_RECOMMENDATION_PROMPT = """
# You are an AI designed to help job seekers improve their chances of getting a job by recommending the top 5 skills they should learn. 
# Given the following data, compare the user's current skills with the skills in demand in the job market, 
# and recommend the most important missing skills the user should focus on learning. Assign each skill a probability score indicating 
# how important it is for the user to learn that skill to improve their job prospects.

# User's current skills:
# {user_skills}

# Skills in demand from job market:
# {market_skills}

# Evaluate the user's experience and current skills. Dynamically adjust the recommendations based on available data, 
# ensuring that at least 5 skills are recommended, even if data is sparse. Assign a probability (between 0 and 1) 
# indicating the likelihood that learning this skill will improve the user's chances of getting a job.

# Respond with the top 5 skills in this format:

# Skill: <skill_name>, Probability: <probability>
# """

# def is_valid_technical_skill(skill):
#     """
#     Check if the skill is a valid technical skill by comparing it against a whitelist of valid technical skills.
#     """
#     skill_clean = skill.lower().strip()
#     # Matching valid skills
#     for valid_skill in VALID_TECHNICAL_SKILLS:
#         if valid_skill.lower() in skill_clean:
#             return True
#     return False

# def filter_recommendations(recommendations):
#     """
#     Filter out irrelevant skills or soft skills from LLaMA's recommendations.
#     """
#     filtered = []
#     for rec in recommendations:
#         skill = rec.get("skill", "")
#         # Only keep the recommendations for valid technical skills
#         if is_valid_technical_skill(skill):
#             filtered.append(rec)
#     return filtered

# def analyze_skills_with_llama(user_skills, missing_skills):
#     """Send skills data to LLaMA API and get skill recommendations with probabilities."""
#     # Format the LLaMA prompt with user and job market skills
#     prompt = LLAMA_RECOMMENDATION_PROMPT.format(
#         user_skills=", ".join(user_skills),
#         market_skills=", ".join(missing_skills)
#     )

#     # Send the request to LLaMA API
#     response = requests.post(OLLAMA_API_URL, json={"prompt": prompt, "model": "llama3.1"}, timeout=60)
    
#     if response.status_code == 200:
#         try:
#             # Get the response content as a string
#             response_text = response.text
            
#             # Print the raw response for debugging
#             print("LLaMA API raw response:", response_text)

#             # Now parse it as needed (assuming the response is well-formed)
#             response_data = response_text.strip().split("\n")

#             # Initialize a list to hold skill recommendations
#             skill_recommendations = []

#             # Process the response into structured fields
#             for line in response_data:
#                 if "Skill:" in line and "Probability:" in line:
#                     parts = re.split(r',\s*', line)
#                     skill_name = parts[0].split("Skill:")[1].strip()
#                     probability = parts[1].split("Probability:")[1].strip()
#                     skill_recommendations.append({
#                         "skill": skill_name,
#                         "probability": probability
#                     })

#             # Filter irrelevant skills or soft skills
#             filtered_recommendations = filter_recommendations(skill_recommendations)

#             return filtered_recommendations

#         except Exception as e:
#             print(f"Error parsing the LLaMA response: {e}")
#             return {"error": "Failed to parse LLaMA API response.", "response": response_text}
#     else:
#         raise ValueError(f"LLaMA API error: {response.status_code}, {response.text}")
# def aggregate_skills(user_skills, job_skills_data):
#     """
#     Aggregates all skills from the job descriptions and compares them with the user's skills.
#     Returns the common skills and missing skills.
#     """
#     # Step 1: Aggregate all skills from the job descriptions
#     all_skills = []
#     for job, details in job_skills_data.items():
#         all_skills.extend(details.get('skills', []))

#     # Count frequency of each skill
#     skill_counts = Counter(all_skills)

#     # Step 2: Compare user skills with job market skills to find missing skills
#     user_skills_set = set(user_skills)
#     required_skills = set(skill_counts.keys())
#     missing_skills = list(required_skills - user_skills_set)

#     return skill_counts, missing_skills
import os
import re
from collections import Counter
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("Google_api_key")
genai.configure(api_key=GOOGLE_API_KEY)

# List of valid technical skills
VALID_TECHNICAL_SKILLS = [
    "Python", "Java", "C++", "C#", "Golang", "SQL", "NoSQL", "REST", "Microservices", 
    "Docker", "Kubernetes", "Terraform", "Jenkins", "AWS", "Azure", "GCP", "Git", 
    "GitLab", "OAuth", "SAML", "CI/CD", "DevOps", "TensorFlow", "PyTorch", "NLP"
    # Add more as necessary...
]

# Define the prompt template for LLaMA API recommendation
LLAMA_RECOMMENDATION_PROMPT = """
You are an AI designed to help job seekers improve their chances of getting a job by recommending 
the most important skills they should learn. 
Given the following data, compare the user's current skills with the skills in demand in the job market, 
and recommend strictly 5 skills the user should focus on learning. Assign each skill a probability score indicating 
how important it is for the user to learn that skill to improve their job prospects based on the job skills json file and based on the role type and expereince.
Ignore all the soft skills if the role is a tech role and The skills and recommendations hould be less than 5 strictly okay?
User's current skills:
{user_skills}

Skills in demand from the job market:
{market_skills}

Please ensure that your response is limited to a maximum of 5 skills. If there are fewer than 5 important missing skills, recommend only the skills you find most important. Do not recommend any more than 5 skills. Assign a probability (between 0 and 1) indicating the likelihood that learning this skill will improve the user's chances of getting a job.

Respond with strictly less 5 skills in this format:

Skill: <skill_name>, Probability: <probability>
"""

def analyze_skills_with_llama(user_skills, missing_skills):
    """Send skills data to Google Gemini and get skill recommendations with probabilities."""
    
    # Improved Dynamic Prompt
    prompt = f"""
    You are an expert career coach AI. 
    User Skills: {", ".join(user_skills)}
    Missing Market Skills: {", ".join(missing_skills)}

    Task: Recommend exactly 3 to 5 critical technical skills the user MUST learn to bridge the gap for this specific role.
    - Ignore generic soft skills (e.g. Communication, Leadership).
    - Focus on high-impact technical skills (e.g. React, Docker, pytorch, AWS).
    - Assign a probability (0.0 to 1.0) representing the impact of learning this skill on employability.

    Output Format (Strictly one per line):
    Skill: <Skill Name>, Probability: <0.XX>
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        response_text = response.text
        print("Gemini Recommendation Response:", response_text)

        response_data = response_text.strip().split("\n")
        skill_recommendations = []

        for line in response_data:
            if "Skill:" in line and "Probability:" in line:
                # Robust parsing for "Skill: Python, Probability: 0.9"
                try:
                    parts = line.split(",")
                    name_part = parts[0].split("Skill:")[1].strip()
                    prob_part = parts[1].split("Probability:")[1].strip()
                    
                    skill_recommendations.append({
                        "skill": name_part,
                        "probability": prob_part
                    })
                except Exception:
                    continue

        # Sort by probability score descending
        skill_recommendations.sort(key=lambda x: str(x['probability']), reverse=True)
        return skill_recommendations[:5]

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return []

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return {"error": "Failed to call Gemini API.", "details": str(e)}

    return skill_counts, missing_skills

def get_market_skills(role):
    """
    Asks Gemini to identify the top 20 critical technical skills for a given job role.
    Returns a list of skills.
    """
    import random
    
    # Add randomness to prompt to prevent caching and encourage diversity
    variations = [
        "cutting-edge", "essential", "industry-standard", "highly sought-after"
    ]
    adjective = random.choice(variations)

    prompt = f"""
    Act as a senior technical recruiter.
    Identify the top 20 {adjective} technical skills strictly for a "{role}" position in the modern 2024/2025 tech landscape.
    
    Context:
    - If the role is an abbreviation (e.g. 'AIML', 'SDE', 'QA', 'DevSecOps'), expand it to its full meaning (e.g. 'AI & Machine Learning', 'Software Development Engineer') and provide relevant skills.
    
    Rules:
    1. STRICTLY Technical Skills only (e.g., 'React', 'Kubernetes', 'TensorFlow', 'PyTorch').
    2. NO Soft Skills (e.g., 'Communication', 'Teamwork', 'Problem Solving').
    3. NO generic terms (e.g., 'Computer Science', 'Programming').
    4. Provide a diverse mix of languages, frameworks, tools, and platforms relevant to {role}.
    
    Respond strictly with a comma-separated list of skills only.
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Clean up the response
        skills_text = response.text.strip()
        # Remove any potential "Here are..." text if the model disobeys slightly
        if ":" in skills_text:
            skills_text = skills_text.split(":")[-1]
            
        market_skills = [s.strip() for s in skills_text.split(',') if s.strip()]
        
        # Fallback if AI returns empty or garbage
        if len(market_skills) < 3:
             raise ValueError("AI returned insufficient skills")
             
        return market_skills[:20] 
        
    except Exception as e:
        print(f"Error fetching market skills from Gemini: {e}")
        # Dynamic Fallback based on role keywords if API fails
        role_lower = role.lower()
        
        if "data" in role_lower or "analyst" in role_lower:
             return ["Python", "SQL", "Pandas", "Tableau", "PowerBI", "Excel", "R", "BigQuery"]
             
        elif "ai" in role_lower or "ml" in role_lower or "artificial" in role_lower or "machine" in role_lower or "deep" in role_lower or "neural" in role_lower:
             return ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "Deep Learning", "NLP", "Pandas", "NumPy", "Keras", "Model Deployment"]
             
        elif "frontend" in role_lower or "react" in role_lower or "web" in role_lower or "ui" in role_lower or "angular" in role_lower or "vue" in role_lower:
             return ["React", "JavaScript", "CSS", "HTML", "Redux", "TypeScript", "Tailwind CSS", "Next.js", "Vue.js", "Webpack"]
             
        elif "backend" in role_lower or "api" in role_lower or "java" in role_lower or "node" in role_lower or "django" in role_lower or "spring" in role_lower:
             return ["Node.js", "Python", "Java", "SQL", "Docker", "REST API", "Microservices", "MongoDB", "PostgreSQL", "Redis"]
             
        elif "full stack" in role_lower or "fullstack" in role_lower or "mern" in role_lower:
            return ["React", "Node.js", "TypeScript", "SQL", "NoSQL", "Docker", "AWS", "Git", "Redux", "Express.js"]
            
        elif "devops" in role_lower or "cloud" in role_lower or "aws" in role_lower or "azure" in role_lower:
            return ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Python", "Bash", "Azure", "Ansible"]
            
        elif "security" in role_lower or "cyber" in role_lower or "pentest" in role_lower:
            return ["Network Security", "Linux", "Python", "Penetration Testing", "Wireshark", "Cryptography", "Risk Assessment", "SIEM", "Firewalls", "OWASP"]
            
        elif "mobile" in role_lower or "ios" in role_lower or "android" in role_lower or "flutter" in role_lower:
            return ["Flutter", "React Native", "Swift", "Kotlin", "Dart", "Firebase", "Mobile UI Design", "API Integration"]
            
        else:
             # Default to general software engineering skills instead of generic terms
             return ["JavaScript", "Python", "SQL", "Git", "Cloud Computing", "Data Structures", "Algorithms", "Testing", "System Design", "Agile"]
