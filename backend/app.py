from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from utils import process_pdf

app = Flask(__name__)
CORS(app)
os.makedirs("uploads", exist_ok=True)

# globals
qa_chain   = None
summary    = ""
tables     = []
chart_recs = []

@app.route('/upload', methods=['POST'])
def upload_pdf():
    global qa_chain, summary, facts

    f = request.files['pdf']
    path = os.path.join("uploads", f.filename)
    f.save(path)

    qa_chain, summary, facts = process_pdf(path)

    return jsonify({
        "message": "PDF uploaded and processed successfully.",
        "summary": summary,
        "facts": facts,
        "chartRecommendations": [],  # optional if you're skipping raw tables
    })

@app.route('/ask', methods=['POST'])
def ask():
    global qa_chain
    if qa_chain is None:
        return jsonify({"error": "Upload a PDF first."}), 400

    q = request.json.get("question", "").strip()
    resp = qa_chain.invoke({"query": q})
    answer = resp.get("result") if isinstance(resp, dict) else resp
    return jsonify({"answer": answer})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)