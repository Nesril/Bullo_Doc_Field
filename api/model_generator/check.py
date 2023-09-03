import os
import PyPDF2
from docx import Document
import pandas as pd
import spacy
from sklearn.metrics.pairwise import cosine_similarity


from django.conf import settings





nlp = spacy.load("en_core_web_lg")


def extract_text_from_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        text += page.extract_text()
    return text

def read_text_files(files):
    data = []
    for file in files:
        if file.name.endswith('.txt'):
            document = file.read().decode("utf-8")  # Decode the bytes to string
            data.append({'Filename': file.name, 'Text': document, "file_name": ".txt"})
        elif file.name.endswith('.pdf'):
            try:
                text = extract_text_from_pdf(file)
                data.append({'Filename': file.name, 'Text': text, "file_name": ".pdf"})
            except Exception as e:
                print(f"Error reading PDF file: {file.name}. {e}")
        elif file.name.endswith('.doc') or file.name.endswith('.docx'):
            try:
                doc = Document(file)
                document = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
                data.append({'Filename': file.name, 'Text': document, "file_name": ".doc"})
            except Exception as e:
                print(f"Error reading Word document: {file.name}. {e}")
        else:
            continue

    df = pd.DataFrame(data)
    return df

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

    text_chunks = [text[i:i + chunk_size] for i in range(0, doc_length, chunk_size)]

    for chunk in text_chunks:
        doc = nlp(chunk)
        for token in doc:
            if not token.is_punct and not token.is_stop and not token.is_digit and token.text != "\n" and token.text != "\t":
                new_text.append(token.lemma_)

    return " ".join(new_text)

save_dir = r"C:\Users\Nesredin\Desktop\Web dev\Back\Django\task\start_with\api\model_generator"
from sentence_transformers import SentenceTransformer
import pickle

def Check_similarity(files,model,text_vectorized,text_data):
    data_to_check = read_text_files(files)
    data_to_check["Text"] = data_to_check["Text"].apply(pre_processor)

    model_filename = os.path.join(save_dir, f"{model}")
    model = SentenceTransformer(model_filename)

    # Load the vectorized data
    model_filename = os.path.join(save_dir, f"{text_vectorized}")
    with open(model_filename, 'rb') as file:
        text_vectorized = pickle.load(file)

    # Load the text_data DataFrame
    model_filename = os.path.join(save_dir, f"{text_data}")
    text_data = pd.read_pickle(model_filename)


    data_to_check_vectorized = model.encode(data_to_check["Text"])

    # Calculate the cosine similarity between each document in text_data and a document in data_to_check
    similarities = []
    for i, text_row in text_data.iterrows():
        similarity_scores = cosine_similarity(data_to_check_vectorized, text_vectorized[i].reshape(1, -1))
        for j, row in data_to_check.iterrows():
            similarity = similarity_scores[j][0]
            similarities.append({"similarity": similarity, "Text Filename": text_row["Filename"], "Data Filename": row["Filename"]})

    # Add the similarity scores to the dataframe
    similarities_df = pd.DataFrame(similarities)
    filenames_tobe_checked = similarities_df["Data Filename"].unique()
    for filename in filenames_tobe_checked:
        sorted_df = similarities_df.sort_values('similarity', ascending=False)
        print(sorted_df[sorted_df["Data Filename"] == filename])
        print("\n\n")

    # Sort the similarities_df DataFrame by similarity in descending order
    similarities_df_sorted = similarities_df.sort_values(by='similarity', ascending=False)
    return similarities_df_sorted
