import fitz  # PyMuPDF
import spacy
import re
from typing import List

# Load Spacy Model
nlp = spacy.load('en_core_web_sm')

# A basic list of skills to match against
COMMON_SKILLS = [
    'python', 'java', 'c++', 'c#', 'javascript', 'typescript', 'html', 'css',
    'react', 'angular', 'vue', 'django', 'flask', 'spring', 'node.js', 'sql',
    'mysql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'azure',
    'machine learning', 'data science', 'nlp', 'pandas', 'numpy', 'scikit-learn',
    'git', 'linux', 'agile', 'scrum'
]

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from a PDF file using PyMuPDF (fitz)"""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text("text") + " "
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from text by matching against a predefined list"""
    text = text.lower()
    doc = nlp(text)
    
    extracted_skills = set()
    
    # Check for direct string matches in the text
    for skill in COMMON_SKILLS:
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            extracted_skills.add(skill)
            
    return list(extracted_skills)

def parse_resume(pdf_path: str) -> dict:
    """Main function to parse resume and return structured data"""
    text = extract_text_from_pdf(pdf_path)
    if not text.strip():
        return {}
        
    skills = extract_skills_from_text(text)
    
    return {
        "text_snippet": text[:500] + "...", 
        "skills": skills
    }
