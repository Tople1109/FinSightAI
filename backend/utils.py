import os, warnings, re
import pandas as pd
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaLLM
from langchain.chains import RetrievalQA
from langchain_huggingface import HuggingFaceEmbeddings
from pdfminer.high_level import extract_text

# suppress noisy output
warnings.filterwarnings("ignore", category=UserWarning)

# shared components
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")


def extract_prompt_facts(chain):
    prompt = (
        "Extract 5 useful or interesting numerical facts from this annual report. "
        "Each fact should be a label and a number. Respond in JSON array format like:\n"
        '[{"label": "...", "value": ...}, ...]'
    )
    resp = chain.invoke({"query": prompt})
    return resp.get("result") if isinstance(resp, dict) else resp


def process_pdf(path: str):
    # 1. Extract & split content
    full_text = extract_text(path)
    docs = [Document(page_content=chunk) for chunk in text_splitter.split_text(full_text)]

    # 2. Build vector DB and chain
    llm = OllamaLLM(model="mistral")
    db = FAISS.from_documents(docs, embedding)
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever())

    # 3. Summary
    summary_prompt = "In one sentence, what is the main objective of this annual report?"
    summary_resp = qa_chain.invoke({"query": summary_prompt})
    summary = summary_resp.get("result") if isinstance(summary_resp, dict) else summary_resp

    # 4. Prompt-based data
    facts_json = extract_prompt_facts(qa_chain)

    return qa_chain, summary, facts_json
