import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("Google_api_key")

if api_key:
    genai.configure(api_key=api_key)
    try:
        with open("models.txt", "w") as f:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    f.write(m.name + "\n")
    except Exception as e:
        with open("models.txt", "w") as f:
            f.write(f"Error: {e}")
