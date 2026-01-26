import fitz  # PyMuPDF
import docx2txt
import tempfile
import os


def extract_text_from_pdf(file_storage):
    text = ""

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file_storage.save(tmp.name)
        tmp_path = tmp.name

    try:
        with fitz.open(tmp_path) as doc:
            for page in doc:
                text += page.get_text()
    finally:
        os.remove(tmp_path)

    return text


def extract_text_from_docx(file_storage):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        file_storage.save(tmp.name)
        tmp_path = tmp.name

    try:
        text = docx2txt.process(tmp_path)
    finally:
        os.remove(tmp_path)

    return text


def extract_text(file_storage):
    filename = file_storage.filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_storage)

    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_storage)

    else:
        raise ValueError("Only PDF and DOCX files are supported")
