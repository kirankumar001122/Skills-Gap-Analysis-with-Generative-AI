import os
import tempfile

# Safe imports to prevent startup crashes on Render
try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

try:
    import docx2txt
except ImportError:
    docx2txt = None

def extract_text_from_pdf(file_storage):
    if fitz is None:
        raise ImportError("PyMuPDF (fitz) is not installed on the server. PDF extraction is unavailable.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file_storage.save(tmp.name)
        tmp_path = tmp.name

    text = ""
    try:
        with fitz.open(tmp_path) as doc:
            for page in doc:
                text += page.get_text()
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return text


def extract_text_from_docx(file_storage):
    if docx2txt is None:
        raise ImportError("docx2txt is not installed on the server. DOCX extraction is unavailable.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        file_storage.save(tmp.name)
        tmp_path = tmp.name

    text = ""
    try:
        text = docx2txt.process(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return text


def extract_text(file_storage):
    filename = file_storage.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_storage)
    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_storage)
    else:
        raise ValueError("Unsupported file format")
