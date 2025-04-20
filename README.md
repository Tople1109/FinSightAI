# FinSightAI

## Overview
FinSightAI couples a modern **React + Node.js** dashboard with a **Python‑powered AI/ML pipeline** so you can ingest PDFs, index their contents, and ask natural‑language questions against your documents. The frontend provides real‑time charts and an intuitive interface, while the backend runs a Retrieval‑Augmented Generation (RAG) workflow built with **LangChain**, **FAISS**, and **Ollama** for lightning‑fast document search and answer generation.

---

## Technologies Used

### Frontend
| Tool | Purpose |
|------|---------|
| **React** | Component‑driven UI |
| **JavaScript** | Application logic & state management |
| **CSS / Tailwind** | Responsive styling |
| **VS Code** | Primary IDE with ESLint & Prettier |

### Backend

#### Node.js & Express
- Exposes REST endpoints for the React client  
- Proxies requests to the Python AI/ML service  

#### Python AI/ML Pipeline
| Library / Module | Role |
|------------------|------|
| `os`, `warnings`, `re` | File handling, logging, regex |
| **pandas** | Tabular data manipulation |
| **pdfminer.six** (`extract_text`) | PDF → text extraction |
| **LangChain** core | Orchestrates RAG |
| &nbsp;&nbsp;• `Document`, `RecursiveCharacterTextSplitter` | Wrap text & chunk large files |
| &nbsp;&nbsp;• **LangChain Community FAISS** | In‑memory vector store |
| &nbsp;&nbsp;• **HuggingFaceEmbeddings** | Generate vector embeddings |
| &nbsp;&nbsp;• `OllamaLLM` | Local LLM inference |
| &nbsp;&nbsp;• `RetrievalQA` | Retrieval + generation chain |

#### Data Storage
- **FAISS**: Similarity‑search index  
- **MongoDB & Mongoose** (optional): Metadata / user sessions  

### Dev & Testing Tools
| Tool | Purpose |
|------|---------|
| **Postman** | API testing & exploration |
| **nodemon** | Auto‑reload Node server in dev |

---

## Setup & Running the Application

> **Prerequisites**  
> – Python 3.8 + (with `pip`)  
> – Node.js 16 + and `npm`  
> – MongoDB (optional, for metadata storage)

# 1.  Clone the repository
```bash
git clone https://github.com/YourUser/FinSightAI.git
cd FinSightAI
```
# 2.  Start the Python AI/ML service  *(terminal #1)*
```bash
cd python-service
pip install -r requirements.txt
```
### Build the FAISS index (run once per PDF set)
```bash
python ingest_pdfs.py --pdf-dir ./docs
```
### Launch the FastAPI / Flask server (defaults to http://localhost:8000)
```bash
python app.py
```
# 3. Start the Node.js backend   *(terminal #2)*
```bash
cd backend
npm install
```
### Copy environment variables
```bash
cp .env.example .env
```
#4.  Start the React frontend   *(terminal #3)*
```bash
cd finsightai-client
npm install
npm start              # opens http://localhost:3000
```
#### Then just add the Pdf file and start asking questions :) !!!
---

# Conclusion
FinSightAI transforms static PDFs into living data— searchable, analyzable, and actionable—by uniting a React + Node.js dashboard with a Python‑based RAG engine. With rapid vector search (FAISS), local LLM inference (Ollama), and an ergonomic UI, the project showcases how full‑stack AI can turn raw documents into instant insight.

This is only the beginning. Future milestones include:

- **Real‑time WebSocket streaming** for live market and sentiment data  
- **Drag‑and‑drop widgets** so users can build custom dashboards  
- **Role‑based authentication** and shared workspaces for team collaboration  
- **Mobile clients** via React Native  
- **Alerting & scheduled reports** delivered via email or push notifications  

We welcome issues, feature requests, and pull requests—check out `CONTRIBUTING.md` to get started. Together we can evolve FinSightAI into a best‑in‑class, open‑source platform for document‑driven intelligence.
