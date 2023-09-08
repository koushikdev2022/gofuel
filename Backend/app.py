from flask import Flask, request, jsonify
import pandas as pd
import spacy
from transformers import pipeline
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load the Excel sheet
excel_file = 'Support_Scripts.xlsx'
df = pd.read_excel(excel_file)

# Load spaCy model
nlp = spacy.load("en_core_web_md")

# Load a pretrained question-answering model and tokenizer
qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

# Define a similarity function (e.g., using spaCy for similarity scoring)
def similarity_function(user_question, data_question):
    # Implement your similarity scoring here
    doc1 = nlp(user_question)
    doc2 = nlp(data_question)
    similarity_score = doc1.similarity(doc2)
    return similarity_score

def answer_question(user_question):
    # Search for the most relevant question in the Excel data
    relevant_question = None
    max_similarity = 0.0

    for question in df['Subject']:
        if isinstance(question, str):  # Check if the value is a string
            similarity = similarity_function(user_question, question)
            if similarity > max_similarity:
                max_similarity = similarity
                relevant_question = question

    # Retrieve the answer corresponding to the relevant question
    if relevant_question:
        answer = df[df['Subject'] == relevant_question]['Instructions'].values[0]
        return answer
    else:
        return "I couldn't find an answer to your question."

@app.route('/answer', methods=['POST'])
def get_answer():
    data = request.get_json()
    user_question = data.get('question')
    if user_question:
        answer = answer_question(user_question)
        return jsonify({"answer": answer})
    else:
        return jsonify({"error": "Invalid request"}), 400

if __name__ == '__main__':
    app.run(debug=True)
