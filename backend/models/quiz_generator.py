
import google.generativeai as genai
import json
import random

def get_fallback_questions(role):
    """
    Returns a robust set of 26 technical questions with unique options
    to serve as a fallback if AI generation fails.
    """
    # A pool of diverse technical questions
    db = [
        {
            "question": "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
            "options": ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
            "correct": 1
        },
        {
            "question": "Which HTTP status code represents 'Unauthorized'?",
            "options": ["200", "404", "401", "500"],
            "correct": 2
        },
        {
            "question": "What is the primary purpose of a Load Balancer?",
            "options": ["To encrypt data", "To distribute network traffic across multiple servers", "To store data", "To cache static assets"],
            "correct": 1
        },
        {
            "question": "In React, what is the purpose of the 'useEffect' hook?",
            "options": ["To manage state", "To handle side effects", "To optimize performance", "To route pages"],
            "correct": 1
        },
        {
            "question": "What indicates a 'SQL Injection' vulnerability?",
            "options": ["Unvalidated user input used in queries", "Weak passwords", "Lack of HTTPS", "Using NoSQL databases"],
            "correct": 0
        },
        {
            "question": "What is the difference between TCP and UDP?",
            "options": ["TCP is connectionless, UDP is connection-oriented", "TCP provides reliable delivery, UDP does not", "UDP is slower than TCP", "They are identical"],
            "correct": 1
        },
        {
            "question": "What does ACID stand for in databases?",
            "options": ["Atomicity, Consistency, Isolation, Durability", "Automated, Consistent, Internal, Data", "Access, Control, Integrated, Design", "Association, Class, Interface, Delegation"],
            "correct": 0
        },
        {
            "question": "Which design pattern ensures a class has only one instance?",
            "options": ["Factory", "Observer", "Singleton", "Strategy"],
            "correct": 2
        },
        {
            "question": "What is 'Docker' primarily used for?",
            "options": ["Compiling code", "Containerization of applications", "Database management", "Network security"],
            "correct": 1
        },
        {
            "question": "In Git, command to retrieve changes from a remote repo?",
            "options": ["git push", "git commit", "git pull", "git merge"],
            "correct": 2
        },
        {
            "question": "What is a 'deadlock' in operating systems?",
            "options": ["A process terminating unexpectedly", "Two processes waiting for each other to release resources", "Memory leak", "High CPU usage"],
            "correct": 1
        },
        {
            "question": "Which sorting algorithm has the worst-case complexity of O(n^2)?",
            "options": ["Merge Sort", "Heap Sort", "Bubble Sort", "Quick Sort (with good pivot)"],
            "correct": 2
        },
        {
            "question": "What is the main advantage of NoSQL over SQL?",
            "options": ["ACID compliance", "Flexible schema and scalability", "Complex joins", "Standardized query language"],
            "correct": 1
        },
        {
            "question": "What does CORS stand for?",
            "options": ["Cross-Origin Resource Sharing", "Computer Origin Resource Security", "Central Organizational Route Storage", "Client Object Request System"],
            "correct": 0
        },
        {
            "question": "What is 'Continuous Integration' (CI)?",
            "options": ["Deploying to production manually", "Automatically merging and testing code changes", "Buying new servers", "Hiring more developers"],
            "correct": 1
        },
        {
            "question": "Which structure uses LIFO (Last In First Out)?",
            "options": ["Queue", "Stack", "Linked List", "Tree"],
            "correct": 1
        },
        {
            "question": "What is specific to Python's 'GIL'?",
            "options": ["Global Interpreter Lock", "General Interface Logic", "Graphical Input Library", "Generated Intrinsic Link"],
            "correct": 0
        },
        {
            "question": "What is a 'JWT' used for?",
            "options": ["Encrypting databases", "Stateless authentication", "Compressing images", "Formatting text"],
            "correct": 1
        },
        {
            "question": "Which generic principle encourages 'Don't Repeat Yourself'?",
            "options": ["KISS", "SOLID", "DRY", "YAGNI"],
            "correct": 2
        },
        {
            "question": "What is the purpose of 'indexes' in a database?",
            "options": ["To encrypt data", "To speed up data retrieval", "To backup data", "To validate data types"],
            "correct": 1
        },
        {
            "question": "In Microservices, how do services typically communicate?",
            "options": ["Shared Memory", "Direct Database Access", "APIs (REST/gRPC)", "Global Variables"],
            "correct": 2
        },
        {
            "question": "What is 'Polyfill' in web development?",
            "options": ["A drawing library", "Code that implements missing features in browsers", "A CSS framework", "A database engine"],
            "correct": 1
        },
        {
            "question": "What is 'memoization'?",
            "options": ["Writing notes", "Caching results of function calls", "Managing memory manually", "Compressing files"],
            "correct": 1
        },
        {
            "question": "What is 'Big O' notation used for?",
            "options": ["Describing algorithm efficiency", "Measuring code length", "Counting variables", "Naming classes"],
            "correct": 0
        },
        {
            "question": "Which IP address is a loopback address?",
            "options": ["192.168.1.1", "127.0.0.1", "8.8.8.8", "255.255.255.0"],
            "correct": 1
        },
        {
            "question": "What is 'Unit Testing'?",
            "options": ["Testing the whole system", "Testing individual components/functions", "User acceptance testing", "Performance testing"],
            "correct": 1
        }
    ]
    
    # Shuffle options for randomness if needed, or keeping static is fine for stability.
    # Return exactly 26
    return db[:26]

def generate_quiz_questions(role, missing_skills):
    """
    Generates 26 multiple-choice questions based on the user's missing skills and role.
    """
    if not missing_skills:
        missing_skills = [role]

    skills_str = ", ".join(missing_skills[:5])

    prompt = f"""
    You are a technical interviewer for a "{role}" position.
    The candidate is missing the following skills: {skills_str}.
    
    Generate exactly 26 multiple-choice questions (MCQs) to test their knowledge on these specific MISSING SKILLS.
    
    Format Constraints:
    1. Provide exactly 26 questions.
    2. Each question must have 4 options.
    3. Clearly indicate the correct option index (0-3).
    4. Questions should be technical and challenging.
    5. Output must be valid JSON array with no markdown formatting.
    
    Example format:
    [
        {{
            "question": "Question text?",
            "options": ["A", "B", "C", "D"],
            "correct": 0
        }}
    ]
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        # Generate content
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean up any markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        questions = json.loads(response_text)
        
        # Validate count
        current_count = len(questions)
        if current_count < 26:
            # If AI returned fewer, fill the rest with fallback questions
            fallback_pool = get_fallback_questions(role)
            # Remove any that might overlap or just append from fallback index 0
            needed = 26 - current_count
            questions.extend(fallback_pool[:needed])
            
        return questions[:26]

    except Exception as e:
        print(f"Error generating quiz: {e}")
        # Return full fallback set
        return get_fallback_questions(role)

def generate_verification_questions(role, skills):
    """
    Generates 10 multiple-choice questions to verify the user's MATCHED skills.
    """
    skills_str = ", ".join(skills[:5]) # Focus on top 5 matched skills to keep it focused

    prompt = f"""
    You are a technical interviewer for a "{role}" position.
    The candidate CLAIMS to have the following skills: {skills_str}.
    
    Generate exactly 10 multiple-choice questions (MCQs) to VERIFY their proficiency in these specific MATCHED skills.
    
    Format Constraints:
    1. Provide exactly 10 questions.
    2. Each question must have 4 options.
    3. Clearly indicate the correct option index (0-3).
    4. Questions should be moderately difficult to filter out false positives.
    5. Output must be valid JSON array with no markdown formatting.
    
    Example format:
    [
        {{
            "question": "Question text?",
            "options": ["A", "B", "C", "D"],
            "correct": 0
        }}
    ]
    """

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        questions = json.loads(response_text)
        
        # Validate count (basic check)
        if len(questions) < 10:
             # Fallback if too few, just fill with generic ones from db
            fallback_pool = get_fallback_questions(role)
            needed = 10 - len(questions)
            questions.extend(fallback_pool[:needed])

        return questions[:10]

    except Exception as e:
        print(f"Error generating verification quiz: {e}")
        return get_fallback_questions(role)[:10]
