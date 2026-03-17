export const langchainAgentsCourse = {
  title: "LangChain & Agents: Orchestrating AI Workflows",
  description: "Move beyond single API calls. Learn LangChain to build chains, integrate memory, connect tools, and deploy autonomous AI agents that plan and act.",
  category: "AI & Machine Learning",
  level: "intermediate",
  duration: 6,
  topics: [
    "LangChain architecture and components",
    "Chains and prompt templates",
    "Memory types and conversation history",
    "Tool integration and custom tools",
    "ReAct and agent frameworks",
    "Autonomous AI agents",
    "LangChain Expression Language (LCEL)",
    "LangSmith for debugging",
    "Production agent patterns",
    "Multi-agent systems"
  ],
  objectives: [
    "Build LangChain chains and pipelines using LCEL",
    "Add persistent memory to AI conversations",
    "Create custom tools and integrate APIs into agents",
    "Implement ReAct agents that reason and act autonomously",
    "Debug and trace agent behaviour with LangSmith",
    "Deploy a production-ready multi-step AI agent"
  ],
  prerequisites: [
    "Python proficiency (functions, classes, async)",
    "Completed 'Building AI-Powered Applications with APIs' or equivalent",
    "Understanding of LLM prompting fundamentals",
    "An OpenAI or Anthropic API key"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "LangChain Fundamentals",
      description: "Understand LangChain's core abstractions and why they exist",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Why LangChain? The Problem with Raw API Calls",
          type: "article",
          content: `# Why LangChain? The Problem with Raw API Calls

## The Problem Raw API Calls Create

As you build more AI features, you accumulate boilerplate:
- Formatting messages arrays manually each time
- Re-implementing retry logic in every service
- Copy/pasting token counting utilities
- No standardised way to swap models
- No built-in memory management
- Complicated multi-step flows become spaghetti code

LangChain solves this with composable, standardised abstractions.

## What LangChain Provides

**1. Model Abstraction** — Swap between OpenAI, Anthropic, Gemini with one line

**2. Prompt Templates** — Versioned, reusable, type-safe prompts

**3. Chains** — Compose multiple steps into pipelines declaratively

**4. Memory** — Built-in conversation history management

**5. Tools** — Standardised way to give LLMs access to external functions

**6. Agents** — LLMs that autonomously decide which tools to use and when

**7. Retrieval** — First-class vector store and document loader support

## Install LangChain

\`\`\`bash
pip install langchain langchain-openai langchain-community langchain-core
pip install python-dotenv
\`\`\`

## Your First LangChain Call

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.3)

messages = [
    SystemMessage(content="You are a concise technical writer."),
    HumanMessage(content="Explain REST APIs in 2 sentences.")
]

response = llm.invoke(messages)
print(response.content)
print(f"Model: {response.response_metadata['model_name']}")
\`\`\`

## The LangChain Ecosystem

- **langchain-core**: Base abstractions (no dependencies)
- **langchain**: Chains, agents, retrieval
- **langchain-openai**: OpenAI integrations
- **langchain-anthropic**: Claude integrations
- **langchain-community**: 100+ third-party integrations
- **langgraph**: Stateful agent workflows (advanced)
- **langsmith**: Debugging, tracing, evaluation`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "Prompt Templates and Output Parsers",
          type: "article",
          content: `# Prompt Templates and Output Parsers

## PromptTemplate: Reusable, Typed Prompts

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate

# Simple string template
summarise_prompt = PromptTemplate.from_template(
    "Summarise this text in {num_sentences} sentences:\\n\\n{text}"
)

# Fill in variables
filled = summarise_prompt.format(
    num_sentences=3,
    text="LangChain is a framework for building LLM applications..."
)
print(filled)
\`\`\`

## ChatPromptTemplate (For Chat Models)

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}. Your tone is {tone}."),
    ("human", "{input}")
])

# Format the prompt
formatted = template.format_messages(
    role="senior software engineer",
    tone="direct and technical",
    input="Review this function: def add(a, b): return a + b"
)
\`\`\`

## Output Parsers: Structured Responses

\`\`\`python
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

# String parser (default)
str_parser = StrOutputParser()

# Structured output with Pydantic
class CodeReview(BaseModel):
    issues: list[str] = Field(description="List of bugs or problems found")
    suggestions: list[str] = Field(description="Improvement suggestions")
    rating: int = Field(description="Code quality rating 1-10")

json_parser = JsonOutputParser(pydantic_object=CodeReview)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a code reviewer. {format_instructions}"),
    ("human", "Review this code:\\n{code}")
]).partial(format_instructions=json_parser.get_format_instructions())

llm = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | llm | json_parser

review = chain.invoke({"code": "def divide(a, b): return a / b"})
print(review)  # CodeReview(issues=['No division by zero check'], ...)
\`\`\`

## The Pipe Operator (|) — LangChain Expression Language (LCEL)

The \`|\` operator chains components together:

\`\`\`python
prompt = ChatPromptTemplate.from_template("Translate to French: {text}")
llm = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# This is a Runnable chain
chain = prompt | llm | parser

result = chain.invoke({"text": "Hello, how are you?"})
print(result)  # "Bonjour, comment allez-vous?"
\`\`\`

This is LCEL — LangChain Expression Language. It makes chains composable, streamable, and parallelisable.`,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "LangChain Expression Language (LCEL) Deep Dive",
          type: "article",
          content: `# LangChain Expression Language (LCEL) Deep Dive

LCEL is LangChain's declarative way to build pipelines. Every component is a Runnable.

## Runnable Interface

Every LCEL component has:
- \`invoke(input)\` — Single call
- \`stream(input)\` — Streaming
- \`batch(inputs)\` — Parallel processing
- \`astream(input)\` — Async streaming

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template("Summarise: {text}")
chain = prompt | llm | StrOutputParser()

# Single call
result = chain.invoke({"text": "LangChain is..."})

# Streaming
for chunk in chain.stream({"text": "LangChain is..."}):
    print(chunk, end="", flush=True)

# Batch (parallel)
results = chain.batch([
    {"text": "Python is..."},
    {"text": "JavaScript is..."},
    {"text": "Rust is..."},
])
\`\`\`

## RunnableParallel: Fan-Out

Run multiple chains in parallel with the same input:

\`\`\`python
from langchain_core.runnables import RunnableParallel

translate_to_french = (
    ChatPromptTemplate.from_template("Translate to French: {text}") | llm | StrOutputParser()
)
translate_to_spanish = (
    ChatPromptTemplate.from_template("Translate to Spanish: {text}") | llm | StrOutputParser()
)

parallel_chain = RunnableParallel(
    french=translate_to_french,
    spanish=translate_to_spanish
)

result = parallel_chain.invoke({"text": "Good morning!"})
# {"french": "Bonjour!", "spanish": "¡Buenos días!"}
\`\`\`

## RunnableLambda: Custom Functions

Inject any Python function into a chain:

\`\`\`python
from langchain_core.runnables import RunnableLambda

def count_words(text: str) -> dict:
    return {"text": text, "word_count": len(text.split())}

preprocess = RunnableLambda(count_words)

chain = (
    preprocess
    | ChatPromptTemplate.from_template("Text ({word_count} words): {text}\\nSummarise it.")
    | llm
    | StrOutputParser()
)

result = chain.invoke("LangChain makes building LLM applications much easier...")
\`\`\`

## Branching with RunnableBranch

\`\`\`python
from langchain_core.runnables import RunnableBranch

branch = RunnableBranch(
    (lambda x: len(x["text"]) > 1000, long_doc_chain),
    (lambda x: len(x["text"]) > 100, medium_doc_chain),
    short_doc_chain  # Default
)
\`\`\``,
          estimatedMinutes: 30,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "What does the pipe operator (|) do in LCEL?",
            options: [
              "Compares two values",
              "Chains Runnable components together in a pipeline",
              "Runs two chains in parallel",
              "Logs chain outputs"
            ],
            correctAnswer: 1,
            explanation: "The | operator creates a chain where the output of each component becomes the input of the next, forming a pipeline."
          },
          {
            id: "q1-2",
            question: "What is the advantage of using RunnableParallel?",
            options: [
              "It runs chains faster by using fewer tokens",
              "It lets you run multiple chains with the same input simultaneously",
              "It prevents rate limit errors",
              "It caches results automatically"
            ],
            correctAnswer: 1,
            explanation: "RunnableParallel fans out a single input to multiple chains running in parallel, collecting results into a dictionary — much faster than running them sequentially."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Memory and State Management",
      description: "Give your AI apps persistent context and conversation history",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Conversation Memory in LangChain",
          type: "article",
          content: `# Conversation Memory in LangChain

LLMs are stateless — they forget each call. Memory adds continuity.

## The Memory Problem

\`\`\`python
# Without memory — the AI forgets!
for turn in ["My name is Alex.", "What's my name?"]:
    response = llm.invoke([HumanMessage(content=turn)])
    print(response.content)
# Turn 2: "I don't know your name..."
\`\`\`

## ChatMessageHistory (Manual Approach)

\`\`\`python
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory

history = ChatMessageHistory()

def chat(user_input: str) -> str:
    history.add_user_message(user_input)
    
    response = llm.invoke(history.messages)
    history.add_ai_message(response.content)
    
    return response.content

print(chat("My name is Alex."))
print(chat("What's my name?"))    # "Your name is Alex."
print(chat("What did I just say?"))  # Remembers full history
\`\`\`

## RunnableWithMessageHistory (LCEL Integration)

\`\`\`python
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

session_store = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("placeholder", "{history}"),
    ("human", "{input}")
])

chain = prompt | llm | StrOutputParser()

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

# Each session_id maintains separate history
chain_with_history.invoke(
    {"input": "My favourite colour is blue."},
    config={"configurable": {"session_id": "user_123"}}
)
chain_with_history.invoke(
    {"input": "What is my favourite colour?"},
    config={"configurable": {"session_id": "user_123"}}
)
\`\`\`

## Trimming History (Managing Token Limits)

\`\`\`python
from langchain_core.messages import trim_messages

trimmed = trim_messages(
    history.messages,
    max_tokens=2000,
    strategy="last",          # Keep most recent
    token_counter=llm,
    include_system=True,
    allow_partial=False
)
\`\`\``,
          estimatedMinutes: 30,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "Persistent Memory with Databases",
          type: "article",
          content: `# Persistent Memory with Databases

In-memory history disappears when the server restarts. Use databases for persistence.

## Redis Chat History

\`\`\`python
from langchain_community.chat_message_histories import RedisChatMessageHistory

def get_redis_history(session_id: str) -> RedisChatMessageHistory:
    return RedisChatMessageHistory(
        session_id=session_id,
        url="redis://localhost:6379",
        ttl=86400  # Expire after 24 hours
    )

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_redis_history,
    input_messages_key="input",
    history_messages_key="history"
)
\`\`\`

## Firestore Chat History (for Firebase projects)

\`\`\`python
from langchain_google_firestore import FirestoreChatMessageHistory
from google.cloud import firestore

client = firestore.Client(project="your-project-id")

def get_firestore_history(session_id: str) -> FirestoreChatMessageHistory:
    return FirestoreChatMessageHistory(
        session_id=session_id,
        collection="chat_histories",
        client=client
    )
\`\`\`

## SQLite for Simple Persistence

\`\`\`python
from langchain_community.chat_message_histories import SQLChatMessageHistory

def get_sql_history(session_id: str) -> SQLChatMessageHistory:
    return SQLChatMessageHistory(
        session_id=session_id,
        connection_string="sqlite:///chat_history.db"
    )
\`\`\`

## Summarisation Memory (For Long Conversations)

After many turns, the history gets too long. Summarise it:

\`\`\`python
summariser = ChatPromptTemplate.from_messages([
    ("system", "Summarise this conversation in under 200 words, preserving key facts:"),
    ("human", "{conversation}")
]) | llm | StrOutputParser()

def compress_history(messages: list, max_turns: int = 10) -> str:
    if len(messages) <= max_turns * 2:
        return None
    
    older = messages[:-max_turns*2]
    conversation_text = "\\n".join(
        f"{m.type}: {m.content}" for m in older
    )
    summary = summariser.invoke({"conversation": conversation_text})
    return summary
\`\`\``,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Entity Memory and Knowledge Extraction",
          type: "article",
          content: `# Entity Memory and Knowledge Extraction

Some applications need to extract and store facts from conversations.

## What Is Entity Memory?

Instead of storing raw messages, entity memory extracts facts about named entities (people, places, objects) and stores them as a structured knowledge graph.

\`\`\`
User: "My name is Jamie and I work at Google."
User: "My daughter Maya is 8 years old."
User: "I prefer Python over JavaScript."

Entity Store:
- Jamie: works at Google, has daughter Maya, prefers Python
- Maya: 8 years old, daughter of Jamie
\`\`\`

## Building a Simple Entity Extractor

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
import json

extract_prompt = ChatPromptTemplate.from_messages([
    ("system", """Extract entities and facts from this message.
Return JSON: {{"entities": [{{"name": "...", "facts": ["..."]}}]}}
Only extract concrete, useful facts."""),
    ("human", "{message}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
extractor = extract_prompt | llm | JsonOutputParser()

class EntityMemory:
    def __init__(self):
        self.store = {}
    
    def update(self, message: str):
        extracted = extractor.invoke({"message": message})
        for entity in extracted.get("entities", []):
            name = entity["name"]
            if name not in self.store:
                self.store[name] = []
            self.store[name].extend(entity["facts"])
    
    def get_context(self) -> str:
        if not self.store:
            return ""
        lines = ["Known information:"]
        for entity, facts in self.store.items():
            lines.append(f"- {entity}: {', '.join(facts)}")
        return "\\n".join(lines)

memory = EntityMemory()
memory.update("My name is Sarah and I live in London.")
memory.update("I'm learning Python for data science.")
print(memory.get_context())
# Known information:
# - Sarah: lives in London, learning Python for data science
\`\`\``,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "Why does a simple LLM response not remember previous messages?",
            options: [
              "LLMs have a 30-second memory limit",
              "LLMs are stateless — each call is independent unless history is passed in",
              "Memory requires a premium API tier",
              "LangChain blocks memory by default"
            ],
            correctAnswer: 1,
            explanation: "LLMs have no inherent state between API calls. You must explicitly pass conversation history in the messages array for context to persist."
          },
          {
            id: "q2-2",
            question: "What problem does summarisation memory solve?",
            options: [
              "It makes AI responses more creative",
              "It prevents conversations from exceeding the context window limit",
              "It speeds up API response times",
              "It reduces hallucinations"
            ],
            correctAnswer: 1,
            explanation: "Long conversations accumulate many tokens. Summarisation compresses older history into a dense summary, keeping the important context while reducing token usage."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Tools and Tool Use",
      description: "Extend LLMs with real-world capabilities through tools",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Creating Custom Tools",
          type: "article",
          content: `# Creating Custom Tools

Tools are functions that AI agents can choose to invoke. They're the bridge between language and action.

## The @tool Decorator

\`\`\`python
from langchain_core.tools import tool
from datetime import datetime
import requests

@tool
def get_current_datetime() -> str:
    """Get the current date and time. Use when you need to know what day/time it is."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression. Input must be a valid Python math expression.
    Examples: '2 + 2', '100 * 1.08', 'pow(2, 10)'"""
    try:
        result = eval(expression, {"__builtins__": {}}, {"pow": pow, "abs": abs, "round": round})
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def search_web(query: str) -> str:
    """Search the web for current information. Use for factual questions needing recent data."""
    # In production, use a real search API (Serper, Tavily, etc.)
    return f"Mock search results for: {query}"

print(get_current_datetime.name)         # "get_current_datetime"
print(get_current_datetime.description)  # Docstring
print(get_current_datetime.args_schema)  # Auto-generated JSON schema
\`\`\`

## Building More Powerful Tools

\`\`\`python
from langchain_core.tools import tool
from pydantic.v1 import BaseModel, Field

class DatabaseQueryInput(BaseModel):
    table: str = Field(description="Table name to query")
    filters: dict = Field(default={}, description="Filter conditions as key-value pairs")
    limit: int = Field(default=10, description="Maximum rows to return")

@tool(args_schema=DatabaseQueryInput)
def query_database(table: str, filters: dict = {}, limit: int = 10) -> str:
    """Query the application database. Use for retrieving records about orders, customers, or products."""
    # Build and execute a safe parameterised query
    # NEVER use f-strings or .format() directly with user-provided table names in production!
    allowed_tables = {"orders", "customers", "products"}
    if table not in allowed_tables:
        return f"Error: Table '{table}' is not accessible"
    
    # Mock result
    return f"Found 3 records in {table} matching {filters}"

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email. Use when explicitly asked to send a message to someone."""
    # Validate email format
    if "@" not in to:
        return "Error: Invalid email address"
    # In production, integrate with SendGrid/Gmail API
    return f"Email sent to {to} with subject '{subject}'"
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Binding Tools to Models (Tool Calling)",
          type: "article",
          content: `# Binding Tools to Models (Tool Calling)

Once you have tools, you bind them to a model so it can decide when to use them.

## Binding Tools

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

@tool
def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b

@tool
def add(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b

llm = ChatOpenAI(model="gpt-4o-mini")
llm_with_tools = llm.bind_tools([multiply, add])

# The model can now decide to call tools
response = llm_with_tools.invoke("What is 47 multiplied by 83?")
print(response.tool_calls)
# [{'name': 'multiply', 'args': {'a': 47.0, 'b': 83.0}, 'id': '...'}]
\`\`\`

## Processing Tool Calls

\`\`\`python
from langchain_core.messages import ToolMessage

tools_map = {"multiply": multiply, "add": add}

def process_tool_calls(response, tool_map: dict) -> list:
    """Execute tool calls and return results as ToolMessages."""
    tool_messages = []
    for tc in response.tool_calls:
        result = tool_map[tc["name"]].invoke(tc["args"])
        tool_messages.append(
            ToolMessage(content=str(result), tool_call_id=tc["id"])
        )
    return tool_messages

messages = [HumanMessage(content="What is 47 times 83?")]
response = llm_with_tools.invoke(messages)
messages.append(response)

if response.tool_calls:
    tool_results = process_tool_calls(response, tools_map)
    messages.extend(tool_results)
    final = llm_with_tools.invoke(messages)
    print(final.content)  # "47 multiplied by 83 is 3,901."
\`\`\`

## Built-in LangChain Tools

\`\`\`python
from langchain_community.tools import DuckDuckGoSearchRun, WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

# Web search
search = DuckDuckGoSearchRun()
search.invoke("LangChain latest version")

# Wikipedia
wiki = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())
wiki.invoke("Large Language Models")

# Python REPL (powerful but needs sandboxing!)
from langchain_core.tools import tool
@tool
def python_repl(code: str) -> str:
    """Execute Python code and return the output. For calculations only."""
    import io, contextlib
    stdout = io.StringIO()
    with contextlib.redirect_stdout(stdout):
        exec(code, {})  # Add whitelist of allowed builtins in production
    return stdout.getvalue()
\`\`\``,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Tavily Search and Real-Time Information",
          type: "article",
          content: `# Tavily Search and Real-Time Information

Tavily provides AI-optimised search results — perfect for grounding agents in current facts.

## Setup

\`\`\`bash
pip install tavily-python
# Get free API key at tavily.com
\`\`\`

## Using Tavily

\`\`\`python
from langchain_community.tools.tavily_search import TavilySearchResults
import os

os.environ["TAVILY_API_KEY"] = "tvly-your-key"

search_tool = TavilySearchResults(
    max_results=5,
    search_depth="advanced",  # "basic" or "advanced"
    include_answer=True,      # Include Tavily's AI answer
    include_raw_content=False,
    include_images=False
)

results = search_tool.invoke("What is the latest version of Python?")
for r in results:
    print(r["url"])
    print(r["content"][:200])
    print()
\`\`\`

## Building a Research Chain

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

def search_and_format(query: str) -> str:
    results = search_tool.invoke(query)
    context = "\\n\\n".join([f"[{r['url']}]\\n{r['content']}" for r in results])
    return context

research_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a research assistant. Answer the question based on the provided search results.
Cite sources using [URL] format. Be factual and concise."""),
    ("human", "Question: {question}\\n\\nSearch Results:\\n{context}")
])

research_chain = (
    {"question": lambda x: x, "context": RunnableLambda(search_and_format)}
    | research_prompt
    | llm
    | StrOutputParser()
)

answer = research_chain.invoke("What are the key features of Python 3.13?")
print(answer)
\`\`\`

## Combining Search with Memory

\`\`\`python
class ResearchAssistant:
    def __init__(self):
        self.search = TavilySearchResults(max_results=3)
        self.llm = ChatOpenAI(model="gpt-4o-mini")
        self.history = ChatMessageHistory()
    
    def needs_search(self, query: str) -> bool:
        classifier = ChatPromptTemplate.from_template(
            "Does this question require recent/real-time information? Only reply YES or NO.\\nQuestion: {query}"
        ) | self.llm | StrOutputParser()
        return "yes" in classifier.invoke({"query": query}).lower()
    
    def chat(self, user_input: str) -> str:
        context = ""
        if self.needs_search(user_input):
            results = self.search.invoke(user_input)
            context = "\\n".join([r["content"] for r in results[:2]])
        
        self.history.add_user_message(user_input)
        
        prompt = f"{context}\\n\\nUser: {user_input}" if context else user_input
        response = self.llm.invoke(self.history.messages)
        
        self.history.add_ai_message(response.content)
        return response.content
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
            question: "What does the @tool decorator's docstring do?",
            options: [
              "It is shown to the user in the UI",
              "It tells the LLM when and how to use the tool",
              "It documents the code for developers only",
              "It defines the return type"
            ],
            correctAnswer: 1,
            explanation: "The docstring becomes the tool's description in the LLM's context. The model reads it to decide whether and when to invoke the tool — so clear descriptions are critical."
          },
          {
            id: "q3-2",
            question: "What security risk must you consider when creating a database query tool?",
            options: [
              "Slow query performance",
              "Token limit exceeded",
              "SQL injection if user input is not sanitised and parameterised",
              "The AI might delete the wrong table"
            ],
            correctAnswer: 2,
            explanation: "Never directly interpolate user-provided (or AI-provided) strings into SQL queries. Always validate allowed values (whitelisting) and use parameterised queries."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Building AI Agents",
      description: "Create autonomous agents that reason and act",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "The ReAct Framework: Reason + Act",
          type: "article",
          content: `# The ReAct Framework: Reason + Act

ReAct (Reasoning + Acting) is the most common agent pattern. The agent thinks through its approach before taking actions.

## The ReAct Loop

\`\`\`
Thought: I need to find the current price of AAPL stock.
Action: search_web("AAPL stock price today")
Observation: AAPL is trading at $189.50 as of market close.
Thought: I have the price. Now I can answer the user.
Answer: Apple (AAPL) is currently trading at $189.50.
\`\`\`

The agent reasons step-by-step, using tools as needed, until it reaches an answer.

## Building a ReAct Agent with LangChain

\`\`\`python
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain import hub

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

tools = [search_tool, calculate, get_current_datetime]

# Pull the standard ReAct prompt from LangChain hub
react_prompt = hub.pull("hwchase17/react")

agent = create_react_agent(llm, tools, react_prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,          # Print each thought/action
    max_iterations=10,     # Prevent infinite loops
    handle_parsing_errors=True
)

result = agent_executor.invoke({
    "input": "What is today's date and what is 2 to the power of 10?"
})
print(result["output"])
\`\`\`

## Tool Use Agent (OpenAI Functions-style)

\`\`\`python
from langchain.agents import create_tool_calling_agent

# More reliable for OpenAI models
agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "Search for the latest LangChain news"})
\`\`\`

## Customising Agent Behaviour

\`\`\`python
custom_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful research assistant with access to search and calculation tools.

Rules:
1. Always verify facts by searching before stating them
2. Show your calculations step by step
3. If unsure, say so rather than guessing
4. Keep responses concise"""),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

agent = create_tool_calling_agent(llm, tools, custom_prompt)
\`\`\``,
          estimatedMinutes: 30,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Agent Memory and Multi-Turn Agents",
          type: "article",
          content: `# Agent Memory and Multi-Turn Agents

Agents need memory to have coherent multi-turn conversations.

## Adding Memory to AgentExecutor

\`\`\`python
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

session_store = {}

def get_session_history(session_id: str):
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

memory_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when needed."),
    ("placeholder", "{chat_history}"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

agent = create_tool_calling_agent(llm, tools, memory_prompt)
executor = AgentExecutor(agent=agent, tools=tools)

agent_with_memory = RunnableWithMessageHistory(
    executor,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history"
)

# Session 1
agent_with_memory.invoke(
    {"input": "My name is Jordan."},
    config={"configurable": {"session_id": "s1"}}
)
agent_with_memory.invoke(
    {"input": "What is my name and what is 15% of 200?"},
    config={"configurable": {"session_id": "s1"}}
)
\`\`\`

## Controlling Agent Steps

\`\`\`python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=5,          # Max tool calls before stopping
    max_execution_time=30,     # Timeout in seconds
    early_stopping_method="generate",  # Generate answer when limit hit
    handle_parsing_errors="Check your output and make sure it conforms",
    verbose=True
)
\`\`\`

## Logging Agent Steps

\`\`\`python
from langchain.callbacks import StdOutCallbackHandler

handler = StdOutCallbackHandler()
result = executor.invoke(
    {"input": "Find the population of Tokyo"},
    config={"callbacks": [handler]}
)
\`\`\``,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Debugging Agents with LangSmith",
          type: "article",
          content: `# Debugging Agents with LangSmith

Agents can fail in subtle ways. LangSmith gives full visibility into every step.

## Setup

\`\`\`bash
pip install langsmith
\`\`\`

\`\`\`python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "your-langsmith-key"
os.environ["LANGCHAIN_PROJECT"] = "My AI Project"

# That's it — all LangChain calls are now automatically traced!
\`\`\`

## What LangSmith Shows

For every run, you see:
- Every step in the chain/agent loop
- Exact prompts sent to the model (including system message, history, tool descriptions)
- Exact model responses
- Which tools were called and with what arguments
- Tool return values
- Token usage and cost per step
- Total latency

## Adding Custom Metadata

\`\`\`python
from langsmith import traceable

@traceable(name="Product Recommendation", tags=["recommendation", "v2"])
def recommend_product(user_query: str, user_id: str) -> str:
    result = agent_executor.invoke(
        {"input": user_query},
        config={"metadata": {"user_id": user_id, "version": "2.0"}}
    )
    return result["output"]
\`\`\`

## Evaluating Agent Quality

\`\`\`python
from langsmith.evaluation import evaluate, LangChainStringEvaluator

# Define a test dataset
examples = [
    {
        "input": "What is 2 + 2?",
        "expected": "4"
    },
    {
        "input": "Search for the capital of France",
        "expected": "Paris"
    }
]

# Create a dataset in LangSmith
from langsmith import Client

client_ls = Client()
dataset = client_ls.create_dataset("Agent Test Cases")
for ex in examples:
    client_ls.create_example(
        inputs={"input": ex["input"]},
        outputs={"output": ex["expected"]},
        dataset_id=dataset.id
    )
\`\`\``,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "In the ReAct pattern, what does 'Observation' represent?",
            options: [
              "The agent's initial plan",
              "The user's question",
              "The result returned by a tool after it's been called",
              "The final answer"
            ],
            correctAnswer: 2,
            explanation: "In ReAct, after the agent takes an Action (calls a tool), it receives an Observation — the tool's return value — which it uses to inform its next Thought."
          },
          {
            id: "q4-2",
            question: "Why set max_iterations on an AgentExecutor?",
            options: [
              "To improve response quality",
              "To prevent infinite loops where the agent keeps calling tools endlessly",
              "To limit API costs to exactly N calls",
              "ReAct requires knowing the number of steps in advance"
            ],
            correctAnswer: 1,
            explanation: "Without a limit, a confused agent can spiral into using tools repeatedly without making progress. max_iterations forces the agent to produce an answer or error after N steps."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Advanced Agent Patterns",
      description: "Plan-and-execute agents, multi-agent systems, and LangGraph",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Plan-and-Execute Agents",
          type: "article",
          content: `# Plan-and-Execute Agents

For complex multi-step tasks, first plan the full approach, then execute each step.

## Why Plan First?

Standard ReAct agents decide one step at a time — they can get "lost" on complex tasks. Plan-and-execute splits reasoning:
1. **Planner** — Creates a full step-by-step plan
2. **Executor** — Executes each step using tools
3. **Replanner** — Updates the plan if execution results change the approach

## Simple Plan-and-Execute

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

planner_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a task planner. Break the user's task into clear, sequential steps.
Return JSON: {{"steps": ["step 1", "step 2", ...]}}
Make each step concrete and actionable."""),
    ("human", "Task: {task}")
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
planner = planner_prompt | llm | JsonOutputParser()

executor_prompt = ChatPromptTemplate.from_messages([
    ("system", "Execute this step using the available tools if needed."),
    ("human", "Step: {step}\\n\\nPrevious results: {context}")
])

def plan_and_execute(task: str, tools: list) -> str:
    plan = planner.invoke({"task": task})
    steps = plan["steps"]
    
    print(f"Plan: {steps}\\n")
    
    results = []
    for i, step in enumerate(steps, 1):
        print(f"Executing step {i}: {step}")
        context = "\\n".join(results[-3:]) if results else "None"
        
        # Use tool-calling agent for each step
        executor = AgentExecutor(
            agent=create_tool_calling_agent(
                llm, tools, 
                ChatPromptTemplate.from_messages([
                    ("system", "Execute the given step. Context from previous steps: {context}"),
                    ("human", "{input}"),
                    ("placeholder", "{agent_scratchpad}")
                ])
            ),
            tools=tools
        )
        result = executor.invoke({"input": step, "context": context})
        results.append(f"Step {i} result: {result['output']}")
        print(f"  ✓ {result['output']}\\n")
    
    # Synthesise final answer
    synthesis = llm.invoke(
        f"Task: {task}\\n\\nResults:\\n" + "\\n".join(results) + "\\n\\nProvide a final answer."
    )
    return synthesis.content

answer = plan_and_execute(
    "Research the top 3 frameworks for building AI agents, compare them, and recommend the best for a beginner",
    tools=[search_tool]
)
\`\`\``,
          estimatedMinutes: 30,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Introduction to LangGraph",
          type: "article",
          content: `# Introduction to LangGraph

LangGraph builds stateful, cyclical agent workflows as graphs — far more flexible than linear chains.

## Install

\`\`\`bash
pip install langgraph
\`\`\`

## Core Concepts

- **Node**: A function that takes state and returns updated state
- **Edge**: A connection between nodes (can be conditional)
- **State**: A shared dictionary that flows through the graph
- **Graph**: The workflow definition

## Building a Simple Agent Graph

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from langchain_core.messages import AnyMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[list[AnyMessage], operator.add]

def call_model(state: AgentState) -> AgentState:
    messages = state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def call_tools(state: AgentState) -> AgentState:
    last_message = state["messages"][-1]
    tool_messages = []
    for tc in last_message.tool_calls:
        result = tools_map[tc["name"]].invoke(tc["args"])
        tool_messages.append(ToolMessage(content=str(result), tool_call_id=tc["id"]))
    return {"messages": tool_messages}

def should_continue(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return END

# Build the graph
graph = StateGraph(AgentState)
graph.add_node("agent", call_model)
graph.add_node("tools", call_tools)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")  # Loop back

app = graph.compile()

result = app.invoke({"messages": [HumanMessage(content="What is 15% of 240?")]})
print(result["messages"][-1].content)
\`\`\`

## Why LangGraph Over AgentExecutor?

- Full control over the graph topology
- Checkpointing and persistence between runs
- Easier to add conditional logic
- Better for complex multi-agent systems
- Human-in-the-loop patterns`,
          estimatedMinutes: 30,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Multi-Agent Systems",
          type: "article",
          content: `# Multi-Agent Systems

For very complex tasks, multiple specialised agents collaborate — each with its own tools, memory, and expertise.

## Why Multi-Agent?

- **Parallelism**: Different aspects of a task handled simultaneously
- **Specialisation**: Each agent is an expert in its domain
- **Fault isolation**: One agent failing doesn't crash the whole system
- **Scale**: Distribute work across agents

## Supervisor Pattern

\`\`\`python
# One supervisor routes tasks to specialised sub-agents

AGENTS = {
    "researcher": {"description": "Searches the web and summarises findings", "tools": [search_tool]},
    "analyst": {"description": "Analyses data and produces reports", "tools": [calculate, python_repl]},
    "writer": {"description": "Drafts documents and emails", "tools": []}
}

supervisor_prompt = ChatPromptTemplate.from_messages([
    ("system", f"""You are a task supervisor. Route user requests to the best agent.
Available agents: {list(AGENTS.keys())}
Descriptions: {', '.join(f"{k}: {v['description']}" for k, v in AGENTS.items())}
Return JSON: {{"agent": "agent_name", "task": "rephrased task for the agent"}}"""),
    ("human", "{input}")
])

supervisor = supervisor_prompt | llm | JsonOutputParser()

def multi_agent_run(user_input: str) -> str:
    routing = supervisor.invoke({"input": user_input})
    agent_name = routing["agent"]
    task = routing["task"]
    
    print(f"Routing to: {agent_name}")
    
    agent_tools = AGENTS[agent_name]["tools"]
    agent_executor = AgentExecutor(
        agent=create_tool_calling_agent(llm, agent_tools, memory_prompt),
        tools=agent_tools
    )
    
    result = agent_executor.invoke({"input": task})
    return result["output"]
\`\`\`

## Coordination Pattern (Agents in Sequence)

\`\`\`python
# Research → Analyse → Write pipeline
def research_to_report(topic: str) -> str:
    # Step 1: Research agent
    research = researcher_executor.invoke({"input": f"Research: {topic}"})["output"]
    
    # Step 2: Analysis agent
    analysis = analyst_executor.invoke({"input": f"Analyse this data: {research}"})["output"]
    
    # Step 3: Writing agent
    report = writer_executor.invoke({"input": f"Write a professional report from this analysis: {analysis}"})["output"]
    
    return report
\`\`\``,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "What is the main advantage of plan-and-execute over ReAct for complex tasks?",
            options: [
              "It uses fewer tokens",
              "It creates a full plan upfront so it doesn't get lost in sub-problems",
              "It runs tools in parallel",
              "It doesn't need a system prompt"
            ],
            correctAnswer: 1,
            explanation: "Plan-and-execute separates planning from execution. The agent first creates a full step-by-step plan, preventing the goal-drift that can happen when ReAct decides one step at a time."
          },
          {
            id: "q5-2",
            question: "In LangGraph, what is a 'node'?",
            options: [
              "A server running the AI model",
              "A function that takes agent state and returns updated state",
              "A database connection",
              "A type of memory store"
            ],
            correctAnswer: 1,
            explanation: "In LangGraph, nodes are Python functions that receive the current graph state and return updates to it. They represent individual steps or decisions in the workflow."
          }
        ]
      }
    },
    {
      id: "chapter-6",
      title: "Production Deployment",
      description: "Deploy, monitor, and maintain LangChain applications",
      order: 6,
      lessons: [
        {
          id: "lesson-6-1",
          title: "LangServe: Deploying Chains as APIs",
          type: "article",
          content: `# LangServe: Deploying Chains as APIs

LangServe wraps any LangChain Runnable as a production-ready REST API with one line.

## Install

\`\`\`bash
pip install langserve[all] fastapi uvicorn
\`\`\`

## Creating a LangServe App

\`\`\`python
from fastapi import FastAPI
from langserve import add_routes
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

app = FastAPI(title="AI Chains API", version="1.0.0")

# Chain 1: Simple Q&A
qa_chain = (
    ChatPromptTemplate.from_template("Answer this question concisely: {question}")
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)
add_routes(app, qa_chain, path="/qa")

# Chain 2: Summariser
summarise_chain = (
    ChatPromptTemplate.from_template("Summarise in 3 bullets:\\n{text}")
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)
add_routes(app, summarise_chain, path="/summarise")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`

## What LangServe Gives You For Free

- \`POST /qa/invoke\` — Single call
- \`POST /qa/stream\` — Streaming
- \`POST /qa/batch\` — Batch calls
- \`GET /qa/playground\` — Interactive web UI
- OpenAPI documentation at \`/docs\`

## Calling LangServe from Python

\`\`\`python
from langserve import RemoteRunnable

remote_chain = RemoteRunnable("http://localhost:8000/qa")
result = remote_chain.invoke({"question": "What is LangChain?"})

# Streaming
for chunk in remote_chain.stream({"question": "Explain agents"}):
    print(chunk, end="")
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-6-2",
          title: "Performance Optimisation for Production",
          type: "article",
          content: `# Performance Optimisation for Production

Production LangChain apps need to be fast, cheap, and reliable.

## Async Everything

\`\`\`python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

async_chain = (
    ChatPromptTemplate.from_template("Summarise: {text}")
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)

async def process_many(texts: list[str]) -> list[str]:
    tasks = [async_chain.ainvoke({"text": t}) for t in texts]
    return await asyncio.gather(*tasks)

results = asyncio.run(process_many(["text1", "text2", "text3"]))
# Runs all 3 in parallel — 3x faster than sequential
\`\`\`

## Caching with LangChain

\`\`\`python
from langchain_core.caches import InMemoryCache
from langchain_community.cache import RedisCache
import langchain
import redis

# In-memory (good for dev)
langchain.llm_cache = InMemoryCache()

# Redis (good for production)
redis_client = redis.Redis.from_url("redis://localhost:6379")
langchain.llm_cache = RedisCache(redis_client)

# Now identical prompts are served from cache, not the API
llm = ChatOpenAI(model="gpt-4o-mini", cache=True)
\`\`\`

## Connection Pooling

\`\`\`python
from langchain_openai import ChatOpenAI
import httpx

# Use a shared async client with connection pooling
http_client = httpx.AsyncClient(
    limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
    timeout=httpx.Timeout(60.0, connect=5.0)
)

llm = ChatOpenAI(
    model="gpt-4o-mini",
    async_client=http_client,
    max_retries=3
)
\`\`\``,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-6-3",
          title: "Where to Go Next with LangChain",
          type: "article",
          content: `# Where to Go Next with LangChain

You've covered the core LangChain stack. Here's your growth path.

## What You've Mastered

- LCEL and composable chains
- Memory management strategies
- Custom tool creation
- ReAct and tool-calling agents
- LangGraph state machine agents
- Multi-agent coordination
- LangServe deployment

## Immediate Next Steps

### Build These Projects
1. **Study assistant with memory** — Takes lecture notes, answers questions with conversation context
2. **Automated report generator** — Takes a topic, researches it, produces a formatted PDF report
3. **Customer support bot** — Answers product questions using a knowledge base built with RAG

### Learn These Next Topics

**RAG & Vector Databases** (take the dedicated course):
- Proper document chunking strategies
- Pinecone, Chroma, Weaviate integration
- Hybrid search (vector + keyword)
- Advanced retrieval strategies (HyDE, multi-query)

**LangGraph** (deeper dive):
- Checkpointing for resumable workflows
- Human-in-the-loop interrupts
- Parallel node execution
- Sub-graphs

### LangChain Resources

- Official docs: python.langchain.com
- LangChain YouTube channel
- LangChain Discord
- r/LangChain subreddit
- LangSmith for production evaluation

## The Future of Agents

The field is moving fast:
- Function calling is becoming native to most LLMs
- Agent frameworks are converging
- Multi-modal agents (vision + speech + text) are emerging
- Long-context models reduce the need for RAG in some cases

Stay current, keep building, and experiment.`,
          estimatedMinutes: 15,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q6-1",
            question: "What does LangServe automatically provide for a deployed chain?",
            options: [
              "A trained AI model",
              "A database connection",
              "invoke, stream, and batch endpoints plus an interactive playground UI",
              "Authentication and user management"
            ],
            correctAnswer: 2,
            explanation: "LangServe wraps any LangChain Runnable as a FastAPI app, automatically providing /invoke, /stream, /batch endpoints and a /playground UI for testing."
          },
          {
            id: "q6-2",
            question: "Why is async important for production LangChain apps?",
            options: [
              "The LangChain library only works async in production",
              "Async allows multiple API calls to run in parallel instead of sequentially",
              "Async is required for streaming",
              "Async reduces the size of API responses"
            ],
            correctAnswer: 1,
            explanation: "Async enables parallelism — you can process multiple users' requests simultaneously. Using asyncio.gather() lets multiple AI calls run concurrently, dramatically improving throughput."
          }
        ]
      }
    }
  ]
};
