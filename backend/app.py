from flask import Flask, request, jsonify
from flask_cors import CORS
import math
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

def clean_nans(obj):
    if isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(v) for v in obj]
    elif isinstance(obj, float) and math.isnan(obj):
        return None  # NaN → None for JSON
    else:
        return obj

@app.route('/upload', methods=['POST'])
@app.route('/upload', methods=['POST'])
def upload_pdf():
    global qa_chain, summary, tables, chart_recs

    f = request.files['pdf']
    save_path = os.path.join("uploads", f.filename)
    f.save(save_path)

    qa_chain, summary, tables, chart_recs = process_pdf(save_path)

    return jsonify({
        "message": "PDF uploaded and processed successfully.",
        "summary": summary,
        "tables": clean_nans(tables),
        "chartRecommendations": chart_recs
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
