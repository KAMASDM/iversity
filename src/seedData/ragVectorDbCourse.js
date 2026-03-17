export const ragVectorDbCourse = {
  title: "Retrieval-Augmented Generation (RAG) & Vector Databases",
  description: "Build AI systems that know your data. Learn to embed documents, store them in vector databases, retrieve relevant context, and generate grounded answers with RAG pipelines.",
  category: "AI & Machine Learning",
  level: "intermediate",
  duration: 5,
  topics: [
    "LLM knowledge limitations and hallucinations",
    "Text embeddings and semantic similarity",
    "Document chunking strategies",
    "Vector databases (Chroma, Pinecone, FAISS)",
    "Building a RAG pipeline from scratch",
    "Retrieval strategies and query expansion",
    "Reranking and hybrid search",
    "Multi-modal RAG",
    "Evaluating RAG systems",
    "Production RAG architecture"
  ],
  objectives: [
    "Explain why RAG outperforms pure prompting for knowledge-intensive tasks",
    "Chunk, embed, and index documents into a vector database",
    "Build an end-to-end RAG pipeline that answers questions from documents",
    "Implement hybrid search combining vector and keyword retrieval",
    "Evaluate RAG system quality with precision and faithfulness metrics",
    "Deploy a production RAG application with Chroma or Pinecone"
  ],
  prerequisites: [
    "Python proficiency",
    "Basic understanding of AI APIs (OpenAI or Gemini)",
    "Completed 'Building AI-Powered Applications with APIs' or equivalent",
    "Familiarity with embeddings is helpful but not required"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "Why RAG? The Limits of LLM Memory",
      description: "Understand the problem RAG solves and when to use it",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "The Knowledge Problem in LLMs",
          type: "article",
          content: `# The Knowledge Problem in LLMs

## LLMs Are Frozen in Time

Every LLM has a training cutoff date. GPT-4o knows nothing that happened after its training ended. Ask it about:
- Yesterday's news
- Your company's internal policies
- A document you uploaded
- The latest product pricing

It will either say it doesn't know, or worse — hallucinate a plausible-sounding but wrong answer.

## The Context Window Approach

You could paste all your documents into the prompt:

\`\`\`python
response = llm.invoke(f"""
{your_entire_document_here}

Based on the above, {user_question}
""")
\`\`\`

This works for small documents. But most LLMs max out at 128K-1M tokens (≈100K-750K words). Your company's documentation is probably larger.

**Problems with stuffing everything in:**
- Expensive (you pay for all those tokens every request)
- Slow (more tokens = slower response)
- LLMs actually perform worse with very long contexts ("lost in the middle" problem)
- Not feasible for large knowledge bases (thousands of documents)

## Enter RAG: Retrieval-Augmented Generation

RAG fetches only the most relevant pieces of your knowledge base and includes them in the prompt.

\`\`\`
User: "What is our refund policy for digital products?"
↓
1. RETRIEVE: Find the 3 most relevant policy paragraphs
2. AUGMENT: Add them to the prompt as context
3. GENERATE: LLM answers based on the retrieved context
\`\`\`

**Benefits:**
- Accurate, up-to-date answers from your own data
- Scales to millions of documents
- Cost-efficient (retrieve once, reuse context)
- Answers are grounded in real sources
- Can cite the source for each claim

## When to Use RAG vs Other Approaches

| Approach | Use When |
|----------|----------|
| Pure prompting | Answer is in the model's training data |
| Stuffing full document in context | Document is short (<50 pages), queried once |
| **RAG** | Large knowledge base, many queries, need up-to-date answers |
| Fine-tuning | Changing model behaviour, style, or adding a new skill |`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "How RAG Works: The Architecture",
          type: "article",
          content: `# How RAG Works: The Architecture

Every RAG system has two phases.

## Phase 1: Indexing (Run Once / Periodically)

\`\`\`
Raw Documents
    ↓
Document Loading (PDFs, Word, Web, DB)
    ↓
Text Cleaning & Preprocessing
    ↓
Chunking (splitting into pieces)
    ↓
Embedding (each chunk → vector)
    ↓
Vector Database Storage
\`\`\`

## Phase 2: Querying (Every User Request)

\`\`\`
User Question
    ↓
Query Embedding (question → vector)
    ↓
Similarity Search (find top-k matching chunks)
    ↓
Context Assembly (format retrieved chunks)
    ↓
LLM Generation (answer from context + question)
    ↓
Response (with source citations)
\`\`\`

## Visualising the Vector Space

Embeddings turn text into points in a high-dimensional space (e.g., 1536 dimensions). Similar meanings cluster together.

\`\`\`
"dog" ●
"puppy" ●  ←→ close in space (similar meaning)
"cat" ●
"feline" ●  ←→ close to "cat"

"database" ●
"SQL" ●     ←→ close in space (same domain)

"happy" ●
"database" ●  ←→ far apart (unrelated)
\`\`\`

When you embed a question, you find the document chunks whose embeddings are closest — i.e., most semantically related.

## The Three Databases in a RAG System

1. **Vector store** — Stores embeddings for semantic search (Chroma, Pinecone, FAISS)
2. **Document store** — Stores original text chunks (can be the same DB or a separate one)
3. **Metadata store** — Source URLs, timestamps, document titles

## Simple RAG in Code (Preview)

\`\`\`python
# Indexing
embedder = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(documents, embedder)

# Querying
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
docs = retriever.invoke("What is the return policy?")

# Generation
context = "\\n\\n".join([d.page_content for d in docs])
answer = llm.invoke(f"Context:\\n{context}\\n\\nQuestion: What is the return policy?")
\`\`\`

Full implementation in Chapter 4.`,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Chunking Strategies: The Most Important Decision",
          type: "article",
          content: `# Chunking Strategies: The Most Important Decision

How you split documents dramatically affects retrieval quality.

## Why Chunking Matters

Too large: Too much irrelevant information retrieved, costs more tokens
Too small: Context is incomplete, answers lack nuance
Wrong boundaries: Splits sentences mid-thought, destroying meaning

## Fixed-Size Chunking

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # ~750 words
    chunk_overlap=200,    # Overlap prevents boundary issues
    length_function=len,
    separators=["\\n\\n", "\\n", " ", ""]  # Try to split at paragraphs first
)

chunks = splitter.split_text(document_text)
print(f"{len(chunks)} chunks created")
\`\`\`

## Semantic Chunking

Split at meaning boundaries, not character counts:

\`\`\`python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

semantic_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile",
    breakpoint_threshold_amount=85
)

chunks = semantic_splitter.split_text(document_text)
# Splits where the semantic meaning shifts
\`\`\`

## Document-Aware Chunking

\`\`\`python
from langchain.text_splitter import MarkdownHeaderTextSplitter

# Split markdown by headers
md_splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=[
        ("#", "chapter"),
        ("##", "section"),
        ("###", "subsection")
    ]
)

chunks = md_splitter.split_text(markdown_document)
# Each chunk includes metadata about its section
\`\`\`

## Chunking Rules of Thumb

| Document Type | Chunk Size | Overlap |
|---------------|-----------|---------|
| News articles | 300-500 | 50 |
| Technical docs | 500-1000 | 100-200 |
| Legal documents | 1000-2000 | 200-400 |
| Source code | By function/class | 0 |
| Conversational data | By exchange | 1 turn |

## Parent-Child Chunking

Store large chunks but retrieve with small chunks — best of both worlds:

\`\`\`python
# Small chunks for precise retrieval
small_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
# Large chunks for rich context in the prompt
large_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=100)

# Index: small chunks → embeddings
# Retrieve: find small chunks, return their parent large chunk
\`\`\``,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "What is the primary problem RAG solves?",
            options: [
              "Making LLMs run faster",
              "Reducing the cost of API calls",
              "Grounding LLM answers in specific, up-to-date knowledge from documents",
              "Making LLMs more creative"
            ],
            correctAnswer: 2,
            explanation: "RAG retrieves relevant document chunks and includes them as context, allowing the LLM to answer questions about specific knowledge it wasn't trained on."
          },
          {
            id: "q1-2",
            question: "Why should chunks overlap when splitting documents?",
            options: [
              "To increase the number of chunks",
              "Overlap prevents information at chunk boundaries from being lost",
              "Overlapping chunks are retrieved faster",
              "Overlap reduces embedding costs"
            ],
            correctAnswer: 1,
            explanation: "Sentences near chunk boundaries could be split if there's no overlap. Overlap ensures context isn't lost at the edges of each chunk."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Embeddings and Vector Databases",
      description: "Store and retrieve documents using semantic similarity",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Embeddings Deep Dive",
          type: "article",
          content: `# Embeddings Deep Dive

## What Are Embeddings?

Embeddings are dense numerical representations of text where semantic similarity maps to geometric proximity.

\`\`\`python
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed(text: str) -> list[float]:
    return client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    ).data[0].embedding

# Compare similarity
e1 = embed("The cat sat on the mat")
e2 = embed("A feline rested on a rug")
e3 = embed("The database query failed")

def cosine_sim(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

print(cosine_sim(e1, e2))  # ~0.93 (highly similar)
print(cosine_sim(e1, e3))  # ~0.12 (unrelated)
\`\`\`

## Key Embedding Properties

**High dimensionality**: 768-3072 dimensions capture nuanced meaning

**Context sensitivity**: "bank" (financial) vs "bank" (river) get different embeddings in context

**Multilingual**: State-of-the-art models work across languages

**Asymmetric embeddings**: Some models use different encoders for queries vs documents

## Choosing an Embedding Model

\`\`\`python
# OpenAI: Most widely used, reliable
from langchain_openai import OpenAIEmbeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Google: Good free tier
from langchain_google_genai import GoogleGenerativeAIEmbeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# Local: Free, private (good for sensitive data)
from langchain_community.embeddings import OllamaEmbeddings
embeddings = OllamaEmbeddings(model="nomic-embed-text")
\`\`\`

## The MTEB Benchmark

The MTEB (Massive Text Embedding Benchmark) ranks embedding models on retrieval quality.
Top performers: text-embedding-3-large, voyage-large-2-instruct, Cohere's embed-v3.

For most RAG applications, **text-embedding-3-small** offers the best cost-performance balance.`,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "Chroma: The Local Vector Database",
          type: "article",
          content: `# Chroma: The Local Vector Database

Chroma is the easiest vector database to start with — no external services required.

## Install

\`\`\`bash
pip install chromadb langchain-chroma
\`\`\`

## Basic Chroma Operations

\`\`\`python
import chromadb
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Create persistent Chroma store
vectorstore = Chroma(
    collection_name="company_docs",
    embedding_function=embeddings,
    persist_directory="./chroma_db"  # Saves to disk
)

# Add documents
docs = [
    Document(
        page_content="Our return policy: 30 days with receipt, no questions asked.",
        metadata={"source": "policy.pdf", "page": 1, "category": "returns"}
    ),
    Document(
        page_content="Shipping: Free over $50. Standard 5-7 days. Express $15, 2 days.",
        metadata={"source": "policy.pdf", "page": 2, "category": "shipping"}
    ),
    Document(
        page_content="We accept Visa, Mastercard, Amex, and PayPal.",
        metadata={"source": "policy.pdf", "page": 3, "category": "payments"}
    ),
]

vectorstore.add_documents(docs)
print(f"Collection has {vectorstore._collection.count()} documents")
\`\`\`

## Searching Chroma

\`\`\`python
# Basic similarity search
results = vectorstore.similarity_search(
    "How do I return an item?",
    k=3
)
for doc in results:
    print(f"Score: {doc.metadata}")
    print(doc.page_content[:200])

# With relevance scores
results_with_scores = vectorstore.similarity_search_with_relevance_scores(
    "shipping cost",
    k=3
)
for doc, score in results_with_scores:
    print(f"Score: {score:.3f} | {doc.page_content[:100]}")

# Filter by metadata
results = vectorstore.similarity_search(
    "cost",
    k=3,
    filter={"category": "shipping"}
)
\`\`\`

## Loading Existing Chroma Store

\`\`\`python
# Load from disk (no need to re-embed)
vectorstore = Chroma(
    collection_name="company_docs",
    embedding_function=embeddings,
    persist_directory="./chroma_db"
)
\`\`\`

## Managing Collections

\`\`\`python
client = chromadb.PersistentClient(path="./chroma_db")

# List collections
print(client.list_collections())

# Delete collection
client.delete_collection("old_docs")

# Collection info
collection = client.get_collection("company_docs")
print(collection.count())
\`\`\``,
          estimatedMinutes: 30,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Pinecone: Production-Scale Vector Database",
          type: "article",
          content: `# Pinecone: Production-Scale Vector Database

For production applications with millions of vectors, Pinecone provides managed, scalable infrastructure.

## Setup

\`\`\`bash
pip install pinecone-client langchain-pinecone
\`\`\`

\`\`\`python
from pinecone import Pinecone, ServerlessSpec
import os

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Create index (once)
if "company-docs" not in pc.list_indexes().names():
    pc.create_index(
        name="company-docs",
        dimension=1536,   # Must match your embedding model
        metric="cosine",  # cosine, dotproduct, or euclidean
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
\`\`\`

## Using with LangChain

\`\`\`python
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Create/connect to vector store
vectorstore = PineconeVectorStore(
    index_name="company-docs",
    embedding=embeddings,
    namespace="v1"  # Namespace for logical separation
)

# Add documents
vectorstore.add_documents(documents)

# Search
results = vectorstore.similarity_search("return policy", k=4)
\`\`\`

## Pinecone Namespaces for Multi-Tenancy

\`\`\`python
# Different namespaces per customer/environment
def get_vectorstore(tenant_id: str) -> PineconeVectorStore:
    return PineconeVectorStore(
        index_name="company-docs",
        embedding=embeddings,
        namespace=f"tenant_{tenant_id}"
    )

# Now each customer's data is isolated
customer_store = get_vectorstore("customer_123")
\`\`\`

## Pinecone vs Chroma vs FAISS

| | Chroma | Pinecone | FAISS |
|--|--------|----------|-------|
| **Hosting** | Local / self-hosted | Managed cloud | Local only |
| **Scale** | Medium (1-10M) | Huge (billions) | Medium |
| **Setup** | pip install | API key needed | pip install |
| **Best for** | Dev / small prod | Large prod | Offline / research |
| **Cost** | Free | Free up to 1 index | Free |`,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "Why does 'text-embedding-3-small' produce different embeddings for 'bank' in 'river bank' vs 'bank account'?",
            options: [
              "It's a bug in the embedding model",
              "Modern embedding models are context-sensitive and capture surrounding word context",
              "The models have separate dictionaries for each word meaning",
              "Word length affects the embedding"
            ],
            correctAnswer: 1,
            explanation: "Modern embedding models (based on transformers) are context-sensitive — the embedding for 'bank' changes based on its surrounding words, correctly mapping different meanings to different vector positions."
          },
          {
            id: "q2-2",
            question: "When should you use Pinecone instead of Chroma?",
            options: [
              "For development and testing",
              "For small knowledge bases under 10,000 documents",
              "For billion-scale production deployments needing managed infrastructure",
              "When you need to run offline"
            ],
            correctAnswer: 2,
            explanation: "Pinecone is managed, globally distributed, and designed for production scale. Chroma is simpler and runs locally or self-hosted — perfect for development and smaller deployments."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Building a RAG Pipeline",
      description: "Connect all the pieces into a working document Q&A system",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Loading and Indexing Documents",
          type: "article",
          content: `# Loading and Indexing Documents

LangChain provides loaders for virtually every document type.

## Document Loaders

\`\`\`python
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    WebBaseLoader,
    CSVLoader,
    UnstructuredWordDocumentLoader
)

# PDF
pdf_loader = PyPDFLoader("company_policy.pdf")
pdf_docs = pdf_loader.load()  # One Document per page

# Web
web_loader = WebBaseLoader("https://example.com/docs/api")
web_docs = web_loader.load()

# CSV
csv_loader = CSVLoader("products.csv", source_column="product_id")
csv_docs = csv_loader.load()

# Multiple files
from langchain_community.document_loaders import DirectoryLoader
dir_loader = DirectoryLoader("./docs", glob="**/*.pdf", loader_cls=PyPDFLoader)
all_docs = dir_loader.load()

print(f"Loaded {len(all_docs)} documents")
print(f"First doc metadata: {all_docs[0].metadata}")
\`\`\`

## Full Indexing Pipeline

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

def build_index(documents_path: str, collection_name: str) -> Chroma:
    """Load, chunk, embed, and store documents."""
    
    # Step 1: Load
    loader = DirectoryLoader(documents_path, glob="**/*.pdf", loader_cls=PyPDFLoader)
    raw_docs = loader.load()
    print(f"Loaded {len(raw_docs)} raw pages")
    
    # Step 2: Chunk
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150,
        length_function=len
    )
    chunks = splitter.split_documents(raw_docs)
    print(f"Created {len(chunks)} chunks")
    
    # Step 3: Embed and store
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=f"./chroma_{collection_name}"
    )
    print(f"Indexed {len(chunks)} chunks into Chroma")
    return vectorstore

vectorstore = build_index("./docs", "company_knowledge")
\`\`\`

## Incremental Updates

\`\`\`python
from langchain.indexes import SQLRecordManager, index

record_manager = SQLRecordManager(
    f"chroma/{collection_name}",
    db_url="sqlite:///record_manager_cache.sql"
)
record_manager.create_schema()

result = index(
    new_documents,        # Only new/changed documents
    record_manager,
    vectorstore,
    cleanup="incremental",  # Remove deleted docs, add new ones
    source_id_key="source"
)
print(result)  # {"num_added": 5, "num_updated": 2, "num_deleted": 1}
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "The Complete RAG Chain with LangChain",
          type: "article",
          content: `# The Complete RAG Chain with LangChain

## Simple RAG Chain

\`\`\`python
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Load the existing vector store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(
    collection_name="company_knowledge",
    embedding_function=embeddings,
    persist_directory="./chroma_company_knowledge"
)

# Create retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# RAG prompt
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful assistant answering questions from company documents.
    
Answer the question using ONLY the provided context. If the answer is not in the context, say "I don't have that information in my knowledge base."

Always cite the source document where you found the answer.

Context:
{context}"""),
    ("human", "{question}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def format_docs(docs):
    return "\\n\\n".join([
        f"[Source: {doc.metadata.get('source', 'Unknown')}]\\n{doc.page_content}"
        for doc in docs
    ])

# Build the chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | llm
    | StrOutputParser()
)

# Use it
answer = rag_chain.invoke("What is the return policy for online orders?")
print(answer)
\`\`\`

## RAG Chain with Source Citations

\`\`\`python
from langchain_core.runnables import RunnableParallel

rag_chain_with_sources = RunnableParallel(
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
).assign(answer=rag_prompt | llm | StrOutputParser())

result = rag_chain_with_sources.invoke("What payment methods do you accept?")
print(result["answer"])
print("\\nSource documents:")
for doc in result["context"].split("\\n\\n"):
    if doc.startswith("[Source:"):
        print(f"  {doc.split(chr(10))[0]}")
\`\`\`

## Adding Conversation History (Conversational RAG)

\`\`\`python
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

# Rephrase question to be standalone (handles follow-ups)
contextualise_prompt = ChatPromptTemplate.from_messages([
    ("system", "Given the conversation history, rephrase the follow-up question as a standalone question."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}")
])

history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualise_prompt)

# Answer chain
answer_prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer based on context:\\n\\n{context}"),
    ("placeholder", "{chat_history}"),
    ("human", "{input}")
])

question_answer_chain = create_stuff_documents_chain(llm, answer_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
\`\`\``,
          estimatedMinutes: 30,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Hybrid Search: Vector + BM25",
          type: "article",
          content: `# Hybrid Search: Vector + BM25

Pure vector search struggles with exact keywords. Combining it with keyword search dramatically improves retrieval.

## The Problem with Pure Vector Search

\`\`\`
User query: "What is ORDER-12345 status?"

Vector search: Finds documents about "order status" semantically
But misses: The document actually containing "ORDER-12345"

Keyword search: Finds exact match for "ORDER-12345"
But misses: Documents with relevant context that don't use exact terms
\`\`\`

## BM25: Classic Keyword Retrieval

\`\`\`python
from rank_bm25 import BM25Okapi

class BM25Retriever:
    def __init__(self, documents: list):
        self.documents = documents
        tokenised = [doc.page_content.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenised)
    
    def retrieve(self, query: str, k: int = 4) -> list:
        tokenised_query = query.lower().split()
        scores = self.bm25.get_scores(tokenised_query)
        top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]
        return [self.documents[i] for i in top_indices]
\`\`\`

## Reciprocal Rank Fusion (Combining Results)

\`\`\`python
def reciprocal_rank_fusion(results_lists: list[list], k: int = 60) -> list:
    """Combine multiple ranked lists into one using RRF."""
    scores = {}
    
    for results in results_lists:
        for rank, doc in enumerate(results, 1):
            doc_id = doc.page_content[:50]  # Use first 50 chars as ID
            if doc_id not in scores:
                scores[doc_id] = {"doc": doc, "score": 0}
            scores[doc_id]["score"] += 1 / (k + rank)
    
    sorted_docs = sorted(scores.values(), key=lambda x: x["score"], reverse=True)
    return [item["doc"] for item in sorted_docs]

class HybridRetriever:
    def __init__(self, vectorstore, documents: list, k: int = 4):
        self.vector_retriever = vectorstore.as_retriever(search_kwargs={"k": k})
        self.bm25 = BM25Retriever(documents)
        self.k = k
    
    def invoke(self, query: str) -> list:
        vector_results = self.vector_retriever.invoke(query)
        keyword_results = self.bm25.retrieve(query, k=self.k)
        return reciprocal_rank_fusion([vector_results, keyword_results])[:self.k]

hybrid = HybridRetriever(vectorstore, all_chunks, k=5)
results = hybrid.invoke("ORDER-12345 status")
\`\`\``,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "What problem does hybrid search (vector + BM25) solve?",
            options: [
              "It makes search faster",
              "Vector search misses exact keyword matches; BM25 misses semantic similarity. Combining them fixes both weaknesses.",
              "It reduces embedding costs",
              "It works without an embedding model"
            ],
            correctAnswer: 1,
            explanation: "Hybrid search combines the semantic understanding of vector search with the exact-match precision of keyword search, giving better overall retrieval quality."
          },
          {
            id: "q3-2",
            question: "What does the history-aware retriever do in conversational RAG?",
            options: [
              "Stores all conversations in a database",
              "Rephrases follow-up questions into standalone questions before retrieving",
              "Searches previous conversations for answers",
              "Limits the conversation to 10 turns"
            ],
            correctAnswer: 1,
            explanation: "Follow-up questions like 'What about the refund?' depend on conversation context. The history-aware retriever rephrases them (e.g., 'What is the refund policy?') so retrieval works correctly."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Advanced RAG Techniques",
      description: "Improve retrieval quality with modern techniques",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Query Expansion and HyDE",
          type: "article",
          content: `# Query Expansion and HyDE

Short or ambiguous queries produce poor retrieval. These techniques improve query quality.

## Multi-Query Retrieval

Generate multiple phrasings of the query, retrieve for each, merge results:

\`\`\`python
from langchain.retrievers import MultiQueryRetriever

multi_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)

# For "refund process", generates and retrieves for:
# "How do I get a refund?",
# "What is the return policy?",
# "Can I get my money back?"
results = multi_retriever.invoke("refund process")
\`\`\`

## HyDE: Hypothetical Document Embeddings

The query "how do I return a product?" differs from the answer "Our return policy is 30 days..."

Instead of embedding the query, use the LLM to generate a hypothetical answer, then embed that:

\`\`\`python
from langchain.chains.hyde import HypotheticalDocumentEmbedder
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

hyde_embeddings = HypotheticalDocumentEmbedder.from_llm(
    ChatOpenAI(model="gpt-4o-mini"),
    OpenAIEmbeddings(),
    prompt_key="web_search"  # or create custom
)

vectorstore_with_hyde = Chroma(
    collection_name="knowledge",
    embedding_function=hyde_embeddings,
    persist_directory="./chroma_knowledge"
)

# When searching, the LLM first generates a hypothetical answer
# which is then embedded — often far closer to real document embeddings
results = vectorstore_with_hyde.similarity_search("What is the return window?")
\`\`\`

## Step-Back Prompting

Abstract the question to a more general one for better retrieval:

\`\`\`python
step_back_prompt = ChatPromptTemplate.from_messages([
    ("system", """Generate a more general version of this specific question.
This helps retrieve background knowledge.
Example: "How does GPT-4 handle long contexts?" → "What are common approaches to handling long contexts in LLMs?" """),
    ("human", "{question}")
])

step_back_chain = step_back_prompt | llm | StrOutputParser()

def enhanced_retrieve(question: str) -> list:
    # Retrieve with both original and abstract question
    abstract = step_back_chain.invoke({"question": question})
    
    specific_docs = retriever.invoke(question)
    abstract_docs = retriever.invoke(abstract)
    
    return reciprocal_rank_fusion([specific_docs, abstract_docs])
\`\`\``,
          estimatedMinutes: 30,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Reranking Retrieved Documents",
          type: "article",
          content: `# Reranking Retrieved Documents

The initial vector search retrieves candidates. Reranking improves precision by reordering them.

## Why Rerank?

Vector similarity is a proxy for relevance — sometimes the 3rd ranked document is actually the most useful. Rerankers read the actual content (query + document) to score relevance more accurately.

## Cross-Encoder Reranking

\`\`\`python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank_documents(query: str, documents: list, top_k: int = 4) -> list:
    """Rerank documents using a cross-encoder model."""
    pairs = [(query, doc.page_content) for doc in documents]
    scores = reranker.predict(pairs)
    
    ranked = sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in ranked[:top_k]]

# Usage: Retrieve 10 candidates, rerank, return top 4
initial_docs = vectorstore.similarity_search(query, k=10)
reranked_docs = rerank_documents(query, initial_docs, top_k=4)
\`\`\`

## Cohere Rerank API

\`\`\`python
import cohere

co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))

def cohere_rerank(query: str, documents: list, top_k: int = 4) -> list:
    doc_texts = [doc.page_content for doc in documents]
    
    results = co.rerank(
        model="rerank-english-v3.0",
        query=query,
        documents=doc_texts,
        top_n=top_k
    )
    
    return [documents[r.index] for r in results.results]
\`\`\`

## LLM-Based Reranking

\`\`\`python
score_prompt = ChatPromptTemplate.from_template("""
Rate how relevant this document is to the query on a scale of 1-10.
Return only the number.

Query: {query}
Document: {document}
""")

scorer = score_prompt | llm | StrOutputParser()

def llm_rerank(query: str, documents: list, top_k: int = 4) -> list:
    scored = []
    for doc in documents:
        score_str = scorer.invoke({"query": query, "document": doc.page_content[:500]})
        try:
            score = float(score_str.strip())
        except:
            score = 5.0
        scored.append((doc, score))
    
    return [doc for doc, _ in sorted(scored, key=lambda x: x[1], reverse=True)[:top_k]]
\`\`\``,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Evaluating RAG Systems",
          type: "article",
          content: `# Evaluating RAG Systems

RAG systems fail in specific ways. Evaluation metrics help you find and fix them.

## The Four RAG Failure Modes

1. **Wrong retrieval**: Retrieved documents don't contain the answer
2. **Missed retrieval**: The right document exists but wasn't retrieved
3. **Hallucination**: LLM generates text not grounded in retrieved context
4. **Faithfulness failure**: Answer contradicts the retrieved context

## Key Metrics

### Context Recall
Did the retrieved documents contain the answer?
\`\`\`python
recall_prompt = ChatPromptTemplate.from_template("""
Given this reference answer and these retrieved documents, does the retrieved context contain all the information needed to answer?

Answer: {answer}
Retrieved context: {context}

Return JSON: {{"recall": 0.0-1.0, "reason": "..."}}
""")
\`\`\`

### Faithfulness
Is the generated answer grounded in the retrieved context?
\`\`\`python
faithfulness_prompt = ChatPromptTemplate.from_template("""
Given the context and the answer, rate how faithful the answer is to the context.
A faithful answer only makes claims supported by the context.

Context: {context}
Answer: {answer}

Return JSON: {{"faithfulness": 0.0-1.0, "reason": "..."}}
""")
\`\`\`

## RAGAS: Automated RAG Evaluation

\`\`\`bash
pip install ragas
\`\`\`

\`\`\`python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall
from datasets import Dataset

eval_data = {
    "question": ["What is the return policy?", "How much is shipping?"],
    "answer": ["30 days return window.", "Free over $50."],
    "contexts": [
        ["Our return policy: 30 days with receipt."],
        ["Shipping: Free over $50. Standard 5-7 days."]
    ],
    "ground_truth": ["30 day return window", "Free shipping over $50"]
}

dataset = Dataset.from_dict(eval_data)
result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])
print(result)
# {'faithfulness': 0.97, 'answer_relevancy': 0.92, 'context_recall': 0.95}
\`\`\``,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "What does HyDE (Hypothetical Document Embeddings) improve?",
            options: [
              "The speed of vector search",
              "Query-document embedding mismatch by generating a hypothetical answer to embed instead of the query",
              "The size of the vector database",
              "Chunking accuracy"
            ],
            correctAnswer: 1,
            explanation: "Queries are phrased as questions; documents are phrased as statements. This creates an embedding space mismatch. HyDE bridges this by generating a hypothetical answer to embed, which is closer to real document embeddings."
          },
          {
            id: "q4-2",
            question: "What is a faithfulness failure in RAG?",
            options: [
              "The retriever fails to find any documents",
              "The generated answer contradicts or goes beyond what the retrieved context supports",
              "The vector database is offline",
              "The embedding model produces incorrect vectors"
            ],
            correctAnswer: 1,
            explanation: "Faithfulness measures whether the generated answer is grounded in the retrieved context. A faithfulness failure means the LLM hallucinated or contradicted the source material."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Production RAG Architecture",
      description: "Design and deploy enterprise-grade RAG systems",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Designing a Production RAG System",
          type: "article",
          content: `# Designing a Production RAG System

## Production Architecture

\`\`\`
Data Sources                   Query Path
(PDFs, URLs, DBs)              (User Request)
      ↓                              ↓
Document Processor           Query Preprocessing
(Load → Clean → Chunk)       (Rewrite / Expand)
      ↓                              ↓
Embedding Service            Retriever
(batch embed)                (Vector + BM25 Hybrid)
      ↓                              ↓
Vector Store                 Reranker
(Pinecone/Chroma)            (Cross-encoder)
      ↓                              ↓
Metadata Index               Context Assembly
(Postgres/Redis)             (Format + Truncate)
                                     ↓
                             LLM Generator
                             (GPT-4o/Claude)
                                     ↓
                             Response + Citations
\`\`\`

## Handling Multiple Document Types

\`\`\`python
from langchain_community.document_loaders import (
    PyPDFLoader, WebBaseLoader, TextLoader, CSVLoader
)

def load_document(source: str) -> list:
    """Route to the correct loader based on source type."""
    if source.endswith(".pdf"):
        return PyPDFLoader(source).load()
    elif source.startswith("http"):
        return WebBaseLoader(source).load()
    elif source.endswith(".csv"):
        return CSVLoader(source).load()
    elif source.endswith(".txt") or source.endswith(".md"):
        return TextLoader(source).load()
    else:
        raise ValueError(f"Unsupported source type: {source}")
\`\`\`

## Metadata-Filtered Retrieval

\`\`\`python
def smart_retriever(query: str, filters: dict = None) -> list:
    search_kwargs = {"k": 8}
    if filters:
        search_kwargs["filter"] = filters
    
    retriever = vectorstore.as_retriever(search_kwargs=search_kwargs)
    
    # Add date filtering logic
    if "date" in filters:
        # Filter documents newer than a threshold
        pass
    
    return retriever.invoke(query)

# Retrieve only from HR documents
hr_docs = smart_retriever("medical leave policy", filters={"department": "HR"})

# Retrieve only recent documents
recent_docs = smart_retriever("pricing changes", filters={"year": {"$gte": 2024}})
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Caching and Performance at Scale",
          type: "article",
          content: `# Caching and Performance at Scale

## Three Layers of Caching

### 1. Embedding Cache

\`\`\`python
import hashlib, pickle, os

EMBED_CACHE = {}

def cached_embed(text: str) -> list:
    key = hashlib.md5(text.encode()).hexdigest()
    if key not in EMBED_CACHE:
        EMBED_CACHE[key] = embeddings.embed_query(text)
    return EMBED_CACHE[key]
\`\`\`

### 2. Query-Level Semantic Cache

Cache based on semantic similarity — very similar queries return the same cached answer:

\`\`\`python
class SemanticCache:
    def __init__(self, threshold: float = 0.95):
        self.cache = []
        self.threshold = threshold
    
    def get(self, query: str):
        query_embed = cached_embed(query)
        for entry in self.cache:
            similarity = cosine_sim(query_embed, entry["embedding"])
            if similarity >= self.threshold:
                return entry["answer"]
        return None
    
    def set(self, query: str, answer: str):
        self.cache.append({
            "query": query,
            "embedding": cached_embed(query),
            "answer": answer
        })

semantic_cache = SemanticCache(threshold=0.95)

def cached_rag(query: str) -> str:
    cached = semantic_cache.get(query)
    if cached:
        return cached
    
    answer = rag_chain.invoke(query)
    semantic_cache.set(query, answer)
    return answer
\`\`\`

### 3. Answer Cache (Redis)

\`\`\`python
import redis, json, hashlib

r = redis.Redis()

def rag_with_cache(query: str, ttl: int = 3600) -> str:
    key = f"rag:{hashlib.md5(query.encode()).hexdigest()}"
    cached = r.get(key)
    if cached:
        return json.loads(cached)
    
    answer = rag_chain.invoke(query)
    r.setex(key, ttl, json.dumps(answer))
    return answer
\`\`\``,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Building and Deploying Your RAG App",
          type: "article",
          content: `# Building and Deploying Your RAG App

## Complete RAG Application

\`\`\`python
# app.py - FastAPI RAG Application
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import tempfile, os

app = FastAPI(title="Company Knowledge Base")

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(
    collection_name="knowledge",
    embedding_function=embeddings,
    persist_directory="./data/chroma"
)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

class QueryRequest(BaseModel):
    question: str
    k: int = 4

@app.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """Upload and index a document."""
    content = await file.read()
    text = content.decode("utf-8")
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=150)
    chunks = splitter.split_text(text)
    
    docs = [Document(
        page_content=c,
        metadata={"source": file.filename, "chunk": i}
    ) for i, c in enumerate(chunks)]
    
    vectorstore.add_documents(docs)
    return {"message": f"Indexed {len(chunks)} chunks from {file.filename}"}

@app.post("/ask")
async def ask(request: QueryRequest):
    """Answer a question from the knowledge base."""
    docs = vectorstore.similarity_search(request.question, k=request.k)
    
    if not docs:
        raise HTTPException(404, "No relevant documents found")
    
    context = "\\n\\n".join([f"[{d.metadata['source']}]\\n{d.page_content}" for d in docs])
    
    response = llm.invoke(f"""Answer based only on this context:
{context}

Question: {request.question}""")
    
    return {
        "answer": response.content,
        "sources": list(set([d.metadata["source"] for d in docs]))
    }
\`\`\`

## Deployment Options

| Platform | Cost | Setup | Best For |
|----------|------|-------|----------|
| Railway | ~$5/mo | 5 min | Prototypes |
| Render | Free tier | 10 min | Small apps |
| Google Cloud Run | Pay per use | 30 min | Production |
| AWS Lambda | Pay per use | 1hr | Serverless |

## Your RAG Journey

You've now learned:
- Why RAG exists and when to use it
- Chunking strategies and document loading
- Chroma and Pinecone vector databases
- Full RAG chains with LangChain
- Hybrid search, query expansion, reranking
- Evaluation with RAGAS
- Production architecture

**Next step**: The LangChain & Agents course will show you how to build RAG into autonomous agents that can dynamically decide when to search your knowledge base.`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "What is semantic caching?",
            options: [
              "Caching only semantically correct answers",
              "Serving cached answers for queries that are semantically similar to previously answered ones",
              "Using the LLM to decide what to cache",
              "Caching the vectorstore embeddings"
            ],
            correctAnswer: 1,
            explanation: "Semantic caching finds the embedding similarity between a new query and cached queries. If similarity exceeds a threshold, it returns the cached answer without a new LLM call."
          },
          {
            id: "q5-2",
            question: "What should the /ingest endpoint do when a document is uploaded?",
            options: [
              "Store the raw file in a file system only",
              "Load, chunk, embed, and add the document to the vector store",
              "Send it directly to the LLM for summarisation",
              "Return the document text to the user"
            ],
            correctAnswer: 1,
            explanation: "Ingestion is the full pipeline: load the file, split into chunks, embed each chunk, and add to the vector store — making it retrievable for future queries."
          }
        ]
      }
    }
  ]
};
