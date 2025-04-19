from pdfminer.high_level import extract_text
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM

# Initialize local embedding model
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

def process_pdf(path):
    text = extract_text(path)
    chunks = text_splitter.split_text(text)

    # Embed chunks
    db = FAISS.from_texts(chunks, embedding)

    # Use Ollama LLM (Mistral)
    llm = OllamaLLM(model="mistral")

    # Return QA chain
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever())
    return qa_chain
