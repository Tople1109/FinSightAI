import re, warnings, json
import pdfplumber, pandas as pd
from pdfminer.high_level import extract_text
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM

# suppress pdfplumber/PyPDF2 noise
warnings.filterwarnings("ignore", category=UserWarning)

# shared splitter & embedder
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
embedding     = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def extract_numeric_tables(path: str) -> list[dict]:
    tables = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for raw in page.extract_tables() or []:
                if not raw or len(raw) < 2:
                    continue
                df = pd.DataFrame(raw[1:], columns=raw[0])
                valid_cols = [c for c in df.columns if isinstance(c, str) and c.strip()]
                sub = df.loc[:, valid_cols]
                sub = sub.loc[:, ~sub.columns.duplicated()]
                for col in sub.columns:
                    try:
                        sub[col] = pd.to_numeric(sub[col])
                    except Exception:
                        pass
                if any(pd.api.types.is_numeric_dtype(sub[col]) for col in sub.columns):
                    tables.append(sub.to_dict(orient="list"))
    return tables

def process_pdf(path: str):
    full_text = extract_text(path)
    chunks    = text_splitter.split_text(full_text)
    docs      = [Document(page_content=c) for c in chunks]

    llm      = OllamaLLM(model="mistral")
    faiss_db = FAISS.from_documents(docs, embedding)
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=faiss_db.as_retriever())

    summary_prompt = "In one sentence, what is the main objective of this annual report?"
    summary_resp   = qa_chain.invoke({"query": summary_prompt})
    summary        = summary_resp.get("result") if isinstance(summary_resp, dict) else summary_resp

    insight_prompt = (
        "Extract 3–5 interesting or useful data points from this annual report "
        "that could be visualized as charts. Return them as a JSON list. "
        "Each item should have: 'title', 'type' (bar, line, scatter, histogram), and 'x' and 'y' or 'value'."
    )
    insight_resp = qa_chain.invoke({"query": insight_prompt})
    insight_text = insight_resp.get("result") if isinstance(insight_resp, dict) else insight_resp

    try:
        insight_graphs = json.loads(insight_text)
    except Exception:
        insight_graphs = []

    tables = extract_numeric_tables(path)
    return qa_chain, summary, tables, insight_graphs
