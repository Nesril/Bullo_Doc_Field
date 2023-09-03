import os
import PyPDF2
from docx import Document
import pandas as pd
import spacy
import pickle
from sentence_transformers import SentenceTransformer
from django.core.files.base import ContentFile


nlp = spacy.load("en_core_web_lg")


def extract_text_from_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        text += page.extract_text()
    return text


def read_text_files(file_path):
    data = []
    
    if file_path.endswith('.txt'):
        try:
            with open(file_path, 'r') as f:
                document = f.read()
                file_dict = {'Filename': os.path.basename(file_path), 'Text': document, "file_type": ".txt"}
                data.append(file_dict)
        except Exception as e:
            print(f"Error reading text file: {file_path}. {e}")

    elif file_path.endswith('.pdf'):
        try:
            text = extract_text_from_pdf(file_path)
            file_dict = {'Filename': os.path.basename(file_path), 'Text': text, "file_type": ".pdf"}
            data.append(file_dict)
        except Exception as e:
            print(f"Error reading PDF file: {file_path}. {e}")

    elif file_path.endswith('.doc') or file_path.endswith('.docx'):
        try:
            doc = Document(file_path)
            text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
            file_dict = {'Filename': os.path.basename(file_path), 'Text': text, "file_type": ".doc"}
            data.append(file_dict)
        except Exception as e:
            print(f"Error reading Word document: {file_path}. {e}")

    else:
        print(f"Unsupported file format: {file_path}")

    return data
def pre_processor(text):
    text = " ".join(text.split())
    text = text.replace(" ", "\t")
    new_text = []

    # Calculate the appropriate chunk size based on document length
    doc_length = len(text)
    max_chunk_length = 100000  # Maximum chunk length (adjust as needed)
    num_chunks = max(1, doc_length // max_chunk_length)
    chunk_size = doc_length // num_chunks

    # Make sure chunk_size is not zero
    if chunk_size == 0:
        chunk_size = 1

    text_chunks = [text[i:i+chunk_size] for i in range(0, doc_length, chunk_size)]

    for chunk in text_chunks:
        doc = nlp(chunk)
        for token in doc:
            if not token.is_punct and not token.is_stop and not token.is_digit and token.text != "\n" and token.text != "\t":
                new_text.append(token.lemma_)

    return " ".join(new_text)


def Process_Each_file(File):
    data=read_text_files(File)
    return data
   



def Model_Generator(df, email):
    df["Text"] = df["Text"].apply(pre_processor)

    # Load the SentenceTransformer model
    sentence_transformer_model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L12-v2')

    # Encode the text_data using SentenceTransformer
    text_vectorized = sentence_transformer_model.encode(df["Text"])

    # Create the directory path for saving the models and data
    save_dir = r"C:\Users\Nesredin\Desktop\Web dev\Back\Django\task\start_with\api\model_generator"
    os.makedirs(save_dir, exist_ok=True)

    # Generate the file names based on the email
    split_email = email.split(".")
    email_filename = "_".join(split_email)

    
    model_filename = os.path.join(save_dir, f"{email_filename}.model")
    text_vectorized_filename = os.path.join(save_dir, f"{email_filename}_text_vectorized.pkl")
    text_data_filename = os.path.join(save_dir, f"{email_filename}_text_data.pkl")

    # Save the models and data
    sentence_transformer_model.save(model_filename)

    with open(text_vectorized_filename, 'wb') as file:
        pickle.dump(text_vectorized, file)

    df.to_pickle(text_data_filename)

    models = {
        'model': f"{email_filename}.model",
        'text_vectorized': f"{email_filename}_text_vectorized.pkl",
        'text_data': f"{email_filename}_text_data.pkl",
    }

    return models


#Model_Generator('files')

