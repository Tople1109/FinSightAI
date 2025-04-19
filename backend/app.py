from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import process_pdf
import os

app = Flask(__name__)
CORS(app)

# Ensure uploads folder exists
os.makedirs("uploads", exist_ok=True)

qa_chain = None  # Global chain state

@app.route('/upload', methods=['POST'])
def upload_pdf():
    global qa_chain
    file = request.files['pdf']
    file_path = f'uploads/{file.filename}'
    file.save(file_path)
    qa_chain = process_pdf(file_path)
    return jsonify({"message": "PDF uploaded and processed successfully."})

@app.route('/ask', methods=['POST'])
def ask_question():
    global qa_chain
    if qa_chain is None:
        return jsonify({"error": "No PDF has been processed yet."}), 400

    data = request.get_json()
    question = data.get('question')
    print("❓ Question:", question)

    try:
        response = qa_chain.invoke({"query": question})
        print("✅ Answer:", response)
        return jsonify({"answer": response})
    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": "Failed to generate answer"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)
