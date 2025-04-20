# FinSightAI

## Overview
FinSightAI combines a modern React + Node.js dashboard with a Python‑powered AI/ML pipeline to let you ingest PDFs, index their contents, and ask natural‑language questions against your documents. On the frontend, users get real‑time charts and an intuitive interface; on the backend, a Retrieval‑Augmented Generation (RAG) workflow powered by LangChain, FAISS, and Ollama handles document search and answer generation.

## Technologies Used

### Frontend
- **React**: Component‑driven UI framework  
- **JavaScript**: Application logic and state management  
- **CSS**: Styling and responsive layouts  
- **VS Code**: Primary development environment with ESLint & Prettier  

### Backend

#### Node.js & Express  
- Exposes REST endpoints for the React client  
- Proxies requests to the Python AI/ML service  

#### Python AI/ML Pipeline  
- **os, warnings, re**: file handling, logging, regex processing  
- **pandas**: tabular data manipulation for intermediate data frames  
- **pdfminer.six** (`extract_text`): text extraction from PDF files  
- **LangChain**:  
  - `Document` schema: wraps raw text with metadata  
  - `RecursiveCharacterTextSplitter`: breaks long text into manageable chunks  
  - **LangChain Community FAISS**: in‑memory vector store for embeddings  
  - **HuggingFaceEmbeddings`: computes vector embeddings for text chunks  
  - `OllamaLLM`: local LLM invocation for fast, offline inference  
  - `RetrievalQA`: orchestrates retrieval + generation to answer user queries  

#### Data Storage  
- **FAISS**: efficient similarity search index  
- **MongoDB & Mongoose** (if used): optional metadata or user‑session storage  

### Dev & Testing Tools
- **Postman**: API endpoint testing and exploration  
- **nodemon**: automatic server restarts during backend development  

## Setup & Running the Application

1. **Clone the repo**  
   ```bash
   git clone https://github.com/YourUser/FinSightAI.git
   cd FinSightAI
