
import google.generativeai as genai
import json

def get_interview_prep_data(role):
    """
    Generates interview preparation data for top companies hiring for the given role.
    """
    
    prompt = f"""
    You are an expert tech career coach.
    Identify 10 top-tier companies that are actively known for hiring "{role}" roles.
    
    For EACH company, provide:
    1. Company Name.
    2. A brief 1-sentence description of their interview style/pattern for this role (e.g. "Focuses heavily on LeetCode Medium/Hard and System Design").
    3. 5 specific technical or behavioral questions they are known to ask for this role.
    
    Format the output as a valid JSON array strictly. Do not use Markdown code blocks. Just the raw JSON string.
    
    Example Structure:
    [
        {{
            "company": "Company Name",
            "style": "Interview style description...",
            "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        }},
        ...
    ]
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up markdown if present
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        data = json.loads(response_text)
        return data

    except Exception as e:
        print(f"Error generating interview prep: {e}")
        # Robust Fallback Mock Data (3 examples to ensure some data is shown on error)
        return [
            {
                "company": "Google (Fallback Data)",
                "style": "Heavy focus on graph algorithms, dynamic programming, and system design for scale.",
                "questions": [
                    "Invert a binary tree.",
                    "Design a rate limiter.",
                    "Explain how search query processing works at scale.",
                    "What happens when you type a URL into a browser?",
                    "Find the longest substring without repeating characters."
                ]
            },
            {
                "company": "Amazon (Fallback Data)",
                "style": "Leadership Principles regarding customer obsession and ownership are critical.",
                "questions": [
                    "Tell me about a time you disagreed with a manager.",
                    "Design a parking lot system.",
                    "Find the K closest points to the origin.",
                    "Merge K sorted lists.",
                    "Describe a situation where you had to make a quick decision with limited data."
                ]
            },
            {
                "company": "Microsoft (Fallback Data)",
                "style": "Behavioral questions mixed with standard algorithmic challenges and OOD.",
                "questions": [
                    "Design a garbage collection system.",
                    "Check if a binary tree is a valid BST.",
                    "Explain the difference between a process and a thread.",
                    "Design an elevator system.",
                    "Tell me about a time you learned a new technology quickly."
                ]
            }
        ]
