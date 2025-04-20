from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from langchain.schema import HumanMessage, AIMessage
from langchain.memory import ConversationBufferMemory
from utils import process_pdf

app = Flask(__name__)
CORS(app)
os.makedirs("uploads", exist_ok=True)

# globals
qa_chain = None
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

@app.route('/upload', methods=['POST'])
def upload_pdf():
    global qa_chain, memory

    memory.clear()

    f = request.files['pdf']
    save_path = os.path.join("uploads", f.filename)
    f.save(save_path)

    qa_chain, summary, fact_groups, chart_recs = process_pdf(save_path, memory)

    return jsonify({
        "message": "PDF uploaded and processed successfully.",
        "summary": summary,
        "facts": fact_groups,
        "chartRecommendations": chart_recs
    })

@app.route('/ask', methods=['POST'])
def ask():
    global qa_chain, memory
    if qa_chain is None:
        return jsonify({"error": "Upload a PDF first."}), 400

    question = request.json.get("question", "").strip()
    response = qa_chain.invoke({"query": question})
    answer = response.get("result") if isinstance(response, dict) else response

    history_raw = memory.load_memory_variables({})["chat_history"]
    history_text = ""
    for msg in history_raw:
        if isinstance(msg, HumanMessage):
            history_text += f"Q: {msg.content}\n"
        elif isinstance(msg, AIMessage):
            history_text += f"A: {msg.content}\n"

    return jsonify({
        "answer": answer,
        "history": history_text.strip()
    })



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5050, debug=True)
