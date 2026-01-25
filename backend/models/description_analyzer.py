import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("Google_api_key")
genai.configure(api_key=GOOGLE_API_KEY)

# Define the Gemini prompt template to analyze role, experience, and skills
GEMINI_PROMPT_TEMPLATE = """
You are an AI designed to analyze short text descriptions of professional roles. Given the following description, do the following:

1. **certifications**: Identify the certifications from the text.
2. **Experience**: Determine the number of years of experience (if mentioned). If it's not mentioned, return 0.
3. **Skills**: Extract all relevant technical and soft skills.
   - If specific skills are mentioned, list them.
   - If the description is vague, infer 10 relevant skills (tech + soft) based on the role context.
   - Prioritize technical skills for technical roles.
   
Respond strictly in the following format:

Skills: <comma-separated list of skills>
Certifications: <comma-separated list of certifications or 'None'>
Years of Experience: <years of experience or 0>

Here is the description:
"{description}"
"""

def analyze_text_with_llama(description):
    """
    Send a short description to Google Gemini to extract certifications, experience, and skills.
    (Function name kept as 'analyze_text_with_llama' for compatibility, but uses Gemini).
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content(
            GEMINI_PROMPT_TEMPLATE.format(description=description)
        )
        
        full_response = response.text
        print(f"DEBUG: Gemini Full Response: {full_response}")

        # Safe Default Values
        response_data = {
            "certifications": "None",
            "experience": "0 Years",
            "skills": []
        }

        try:
            # Parse Format
            skills_found = []
            
            lines = full_response.strip().split("\n")
            for line in lines:
                clean_line = line.strip()
                if clean_line.lower().startswith("skills:"):
                    parts = clean_line.split(":", 1)
                    if len(parts) > 1:
                        raw = parts[1].strip()
                        skills_found = [s.strip() for s in raw.split(',') if s.strip()]
                        
                elif clean_line.lower().startswith("certifications:"):
                    parts = clean_line.split(":", 1)
                    if len(parts) > 1:
                        response_data["certifications"] = parts[1].strip()
                        
                elif clean_line.lower().startswith("years of experience:"):
                    parts = clean_line.split(":", 1)
                    if len(parts) > 1:
                        response_data["experience"] = parts[1].strip()

            if skills_found:
                response_data["skills"] = skills_found
            
            # Robustness: If parsing failed to find "Skills:", try fallback logic or return defaults?
            # Usually Gemini adheres to format well.

        except Exception as parse_error:
            print(f"DEBUG: Parsing logic failed: {parse_error}. Using defaults.")

        return response_data
    
    except Exception as e:
        print(f"DEBUG: Request failed: {e}")
        # FALLBACK
        return {
            "certifications": "None",
            "experience": "0 Years",
            "skills": ["Communication", "Problem Solving", "Python", "Java", "SQL"] # Better fallback
        }
