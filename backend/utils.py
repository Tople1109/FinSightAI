import re, json, warnings
import pdfplumber, pandas as pd
from pdfminer.high_level import extract_text
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM

# Suppress noisy warnings
warnings.filterwarnings("ignore", category=UserWarning)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

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

def extract_fact_groups(llm, vectorstore) -> list[dict]:
    chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever())
    prompt = (
        "From this annual report, extract 1 to 5 groups of related numeric insights that could be shown as bar or pie charts. "
        "Each group should have a title (e.g., 'Gender Distribution', 'Revenue by Region') and include 2+ label-value pairs. "
        "Only include facts that are clearly available in the text. Respond in JSON format like:\n"
        "["
        "  {\"title\": \"Gender Distribution\", \"data\": [{\"label\": \"Male\", \"value\": 70}, {\"label\": \"Female\", \"value\": 30}]},\n"
        "  {\"title\": \"Revenue by Region\", \"data\": [{\"label\": \"US\", \"value\": 6000}, {\"label\": \"India\", \"value\": 2000}]}\n"
        "]"
    )
    response = chain.invoke({"query": prompt})
    raw_text = response.get("result", "") if isinstance(response, dict) else response
    try:
        return json.loads(raw_text)
    except:
        match = re.search(r'\[(\s*{.*?})\s*\]', raw_text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                return []
    return []


def suggest_charts_from_facts(facts: list[dict]) -> list[dict]:
    charts = []
    if not facts:
        return charts

    if len(facts) >= 3:
        charts.append({"type": "bar", "data": facts, "title": "Key Insights Comparison"})

    time_facts = [f for f in facts if any(kw in f["label"] for kw in ["2021", "2022", "2023", "2024"])]
    if len(time_facts) >= 2:
        charts.append({"type": "line", "data": time_facts, "title": "Time-Based Trend"})

    if len(facts) == 2:
        charts.append({"type": "pie", "data": facts, "title": "Binary Comparison"})

    if len(set(f["value"] for f in facts)) > 3:
        charts.append({"type": "histogram", "data": facts, "title": "Value Distribution"})

    if not charts:
        charts.append({"type": "bar", "data": facts, "title": "General Metrics"})

    return charts

def process_pdf(path: str, memory):
    full_text = extract_text(path)
    chunks = text_splitter.split_text(full_text)
    docs = [Document(page_content=c) for c in chunks]

    llm = OllamaLLM(model="mistral")
    vectorstore = FAISS.from_documents(docs, embedding)

    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever(),memory=memory)

    summary_prompt = "In one sentence, what is the main objective of this annual report?"
    summary_response = qa_chain.invoke({"query": summary_prompt})
    summary = summary_response.get("result") if isinstance(summary_response, dict) else summary_response

    grouped_facts = extract_fact_groups(llm, vectorstore)

    return qa_chain, summary, grouped_facts, []

