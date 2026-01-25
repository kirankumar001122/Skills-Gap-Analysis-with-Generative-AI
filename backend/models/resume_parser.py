
# import requests
# import json

# # Ollama API URL for LLaMA model
# OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"

# # Define a prompt asking for only skills in a comma-separated format
# LLAMA_PROMPT_TEMPLATE = """You are an AI designed to analyze resumes. Given the following paragraph, extract only the technical skills mentioned. Return **only** the skills as a comma-separated list, without any introductory phrases or additional commentary. Do not include any explanations, headers, or other information—just a simple, clean list of skills.

# Here is the paragraph:
# "{resume_text}"

# Please respond with only the skills, in a strict comma-separated list format.
# """

# def extract_skills_with_llama(resume_text):
#     """
#     Send the resume text to LLaMA via the Ollama API to extract skills as a list of strings.
#     """
#     # Format the prompt for LLaMA
#     prompt = LLAMA_PROMPT_TEMPLATE.format(resume_text=resume_text)
    
#     # Send the request to Ollama API
#     response = requests.post(OLLAMA_API_URL, json={"prompt": prompt, "model": "llama3.1"}, timeout=60, stream=True)
    
#     # Check if the response is successful
#     if response.status_code == 200:
#         try:
#             # Initialize variables to store the response chunks
#             full_response = ""
            
#             # Loop through the streaming response chunks
#             for chunk in response.iter_lines():
#                 if chunk:
#                     # Decode the chunk and parse it as JSON
#                     data = json.loads(chunk.decode('utf-8'))
                    
#                     # Check if we have a "response" field and append it
#                     if "response" in data:
#                         full_response += data["response"]
                    
#                     # Stop if the response is marked as done
#                     if data.get("done_reason") == "stop":
#                         break

#             # Print LLaMA's raw response for debugging
#             print("LLaMA raw response:", full_response)
            
#             # Strip unnecessary text and convert to a list of skills
#             skills_list = full_response.strip()
            
#             # Convert the comma-separated list into a Python list
#             skills = [skill.strip() for skill in skills_list.split(",")]
            
#             # Return the list of skills
#             return skills
        
#         except Exception as e:
#             print(f"Error parsing the LLaMA response: {response.text}")
#             raise ValueError("Error parsing the LLaMA response: " + str(e))
#     else:
#         raise ValueError(f"Error from LLaMA API: {response.status_code}, {response.text}")
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("Google_api_key")
genai.configure(api_key=GOOGLE_API_KEY)

# Define a more strict prompt asking for skills, certifications, and years of experience
# Define a more strict prompt asking for skills, certifications, and years of experience
# Define a more strict prompt asking for skills, certifications, years of experience, and education
LLAMA_PROMPT_TEMPLATE = """
You are an AI designed to analyze resumes. Given the following paragraph, extract the following fields:

1. **Technical Skills**: Only list the TECHNICAL hard skills mentioned in a comma-separated list. Do not include soft skills like "Communication" or "Teamwork".
2. **Certifications**: Only list any certifications mentioned in a comma-separated list. If there are no certifications, return "None".
3. **Years of Experience**: Only return the number of years of experience as a numerical value. If no duration is mentioned, return "0".
4. **Education**: Extract the highest degree, major, and university mentioned. Simplify to a short string (e.g., "B.Tech in Computer Science"). If not mentioned, return "None".

Respond strictly in the following format:

Skills: <comma-separated list of technical skills>
Certifications: <comma-separated list of certifications or 'None'>
Years of Experience: <years of experience or 0>
Education: <education summary or 'None'>

Here is the paragraph:
"{resume_text}"
"""

def extract_resume_with_llama(resume_text):
    """
    Send the resume text to Google Gemini to extract skills, certifications, experience, and education.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Configure safety settings to avoid blocking benign content
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
        ]

        response = model.generate_content(
            LLAMA_PROMPT_TEMPLATE.format(resume_text=resume_text),
            safety_settings=safety_settings
        )
        
        # Check if response was blocked or incomplete
        if not response.parts:
             print(f"Gemini Response Blocked/Empty. Feedback: {response.prompt_feedback}")
             raise ValueError("Gemini API blocked the response or returned empty.")

        full_response = response.text
        print("Gemini raw response:", full_response)

        # Handle case when response is empty or incomplete
        if not full_response.strip():
            raise ValueError("Gemini returned an empty text response")

        # Initialize empty fields
        skills, certifications, years_of_experience, education = "", "None", "0", "Not Mentioned"

        # Regex Parsing for robustness
        import re
        
        # Extract Skills
        skills_match = re.search(r'Skills:\s*(.*)', full_response, re.IGNORECASE)
        if skills_match:
            skills = skills_match.group(1).strip()
            
        # Extract Certifications
        cert_match = re.search(r'Certifications:\s*(.*)', full_response, re.IGNORECASE)
        if cert_match:
            certifications = cert_match.group(1).strip()
            
        # Extract Experience
        exp_match = re.search(r'Years of Experience:\s*(.*)', full_response, re.IGNORECASE)
        if exp_match:
            years_of_experience = exp_match.group(1).strip()
            
        # Extract Education
        edu_match = re.search(r'Education:\s*(.*)', full_response, re.IGNORECASE)
        if edu_match:
            education = edu_match.group(1).strip()

        # Convert skills and certifications into lists
        skills_list = [skill.strip() for skill in skills.split(",") if skill.strip()]
        certifications_list = [cert.strip() for cert in certifications.split(",") if cert.strip().lower() != "none"]

        if len(skills_list) < 3:
            print("Gemini returned few skills, using fallback keyword extraction.")
            fallback_skills = fallback_extract_skills(resume_text)
            # Merge lists, keeping unique
            skills_list = list(set(skills_list + fallback_skills))

        # Return structured data as a dictionary
        return {
            "skills": skills_list,
            "certifications": certifications_list,
            "years_of_experience": years_of_experience,
            "education": education
        }
    
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        # Use fallback strictly
        fallback_skills = fallback_extract_skills(resume_text)
        return {
            "skills": fallback_skills,
            "certifications": [],
            "years_of_experience": "0",
            "education": "Analysis Failed",
            "error": str(e)
        }

def fallback_extract_skills(text):
    """
    Naive regex-based skill extraction for failsafe.
    """
    import re
    common_skills = [
        "Python", "Java", "C++", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js", "Express",
        "Django", "Flask", "Spring Boot", "SQL", "MySQL", "PostgreSQL", "MongoDB", "NoSQL", "Git", "Docker",
        "Kubernetes", "AWS", "Azure", "GCP", "Linux", "HTML", "CSS", "SASS", "Tailwind", "Bootstrap",
        "Machine Learning", "Deep Learning", "Data Analysis", "TensorFlow", "PyTorch", "Pandas", "NumPy",
        "Spark", "Hadoop", "Tableau", "Power BI", "Excel", "Word", "Salesforce", "JIRA", "Agile", "Scrum",
        "C#", ".NET", "PHP", "Laravel", "Ruby", "Rails", "Go", "Rust", "Swift", "Kotlin", "Flutter",
        "DevOps", "CI/CD", "Jenkins", "Terraform", "Ansible", "Redis", "Elasticsearch", "Three.js", "WebGL"
    ]
    
    found_skills = []
    text_lower = text.lower()
    
    for skill in common_skills:
        # Simple word boundary check (roughly)
        # Escape special chars like C++ or .js
        escaped_skill = re.escape(skill.lower())
        pattern = r'\b' + escaped_skill + r'\b'
        
        # Handle C++ specially since it has non-word chars at end
        if "++" in skill or ".js" in skill or "#" in skill:
             if skill.lower() in text_lower:
                 found_skills.append(skill)
        else:
             if re.search(pattern, text_lower):
                 found_skills.append(skill)
                 
    return found_skills
