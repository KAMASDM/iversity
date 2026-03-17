export const aiApiAppsCourse = {
  title: "Building AI-Powered Applications with APIs",
  description: "Go from prompt user to AI developer. Learn to call OpenAI, Gemini, and Anthropic APIs with Python, build prompt pipelines, handle streaming, and deploy production-ready AI features.",
  category: "AI & Machine Learning",
  level: "intermediate",
  duration: 6,
  topics: [
    "AI API fundamentals and authentication",
    "Making API calls with Python",
    "Prompt engineering for APIs",
    "Streaming responses",
    "Function calling and tool use",
    "Building reusable prompt pipelines",
    "Error handling and rate limits",
    "Cost management and token optimisation",
    "Building a complete AI application",
    "Deploying AI features to production"
  ],
  objectives: [
    "Call OpenAI, Gemini, and Anthropic APIs from Python scripts",
    "Build multi-turn conversation systems with chat history",
    "Implement streaming for real-time AI responses",
    "Use function calling to integrate AI with external tools",
    "Manage API costs through token monitoring and caching",
    "Deploy a production-ready AI feature to a web application"
  ],
  prerequisites: [
    "Basic Python knowledge (variables, functions, loops)",
    "Completed 'Mastering Prompt Engineering' or equivalent",
    "Familiarity with REST APIs is helpful but not required",
    "A free OpenAI or Google account"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "API Fundamentals and Setup",
      description: "Understand what APIs are and set up your AI development environment",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "What is an API and Why Do AI APIs Matter?",
          type: "article",
          content: `# What is an API and Why Do AI APIs Matter?

## APIs: The Universal Connector

An API (Application Programming Interface) is a set of rules that lets two pieces of software communicate.

Think of it like a restaurant menu:
- You (your code) are the customer
- The menu (API spec) tells you what you can order and how
- The kitchen (the AI model) does the work
- The waiter (API server) handles the exchange

You don't need to know how the kitchen works — just how to place orders.

## Why Use AI APIs Instead of ChatGPT?

| ChatGPT/Claude Web | API |
|---------------------|-----|
| Manual copy/paste | Automated |
| One user at a time | Scales to millions |
| Fixed interface | Full customisation |
| No integration | Embed anywhere |
| Free / fixed plans | Pay per token |

When you use an AI API, you can:
- Build AI features directly into your app
- Automate tasks that run without human intervention
- Process thousands of documents overnight
- Create custom AI experiences for your users

## The Three Major AI APIs

### OpenAI API
- Models: GPT-4o, GPT-4o mini, o1, DALL-E 3, Whisper
- Best for: Broad use cases, widest ecosystem
- Pricing: ~$0.005/1K input tokens (GPT-4o mini)

### Google Gemini API
- Models: Gemini 1.5 Pro, Gemini 1.5 Flash
- Best for: Large context, multimodal tasks
- Pricing: Free tier available

### Anthropic API
- Models: Claude 3.5 Sonnet, Claude 3 Haiku
- Best for: Long documents, nuanced writing
- Pricing: ~$0.003/1K input tokens (Claude 3 Haiku)

## Key API Concepts

**Endpoint**: The URL you send requests to
\`\`\`
https://api.openai.com/v1/chat/completions
\`\`\`

**API Key**: Your secret authentication token — never share it or commit to git

**Request**: The data you send (model, messages, parameters)

**Response**: The JSON object the API sends back

**Rate Limit**: Maximum requests per minute your account allows`,
          estimatedMinutes: 15,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "Setting Up Your Development Environment",
          type: "article",
          content: `# Setting Up Your Development Environment

## What You'll Need

1. Python 3.10+ installed
2. A code editor (VS Code recommended)
3. An OpenAI or Gemini API key
4. The openai Python library

## Step 1: Install Python and VS Code

Download Python from python.org and VS Code from code.visualstudio.com.

Verify Python works:
\`\`\`bash
python --version
# Python 3.11.x
\`\`\`

## Step 2: Create a Project Directory

\`\`\`bash
mkdir ai-projects
cd ai-projects
python -m venv venv  # Create virtual environment
source venv/bin/activate  # Mac/Linux
# venv\\Scripts\\activate  # Windows
\`\`\`

## Step 3: Install Dependencies

\`\`\`bash
pip install openai anthropic google-generativeai python-dotenv
\`\`\`

## Step 4: Get Your API Key

**OpenAI**: platform.openai.com → API Keys → Create new key

**Google Gemini**: aistudio.google.com → Get API Key

Store your key securely in a .env file:

\`\`\`
# .env (NEVER commit this to git)
OPENAI_API_KEY=sk-your-key-here
GEMINI_API_KEY=your-gemini-key-here
\`\`\`

Create a .gitignore file:
\`\`\`
# .gitignore
.env
venv/
__pycache__/
\`\`\`

## Step 5: Your First API Call

\`\`\`python
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Say hello in 5 different languages"}
    ]
)

print(response.choices[0].message.content)
\`\`\`

## Understanding the Response Object

\`\`\`python
print(response.model)         # Which model was used
print(response.usage)         # Token usage
print(response.choices[0].message.content)  # The actual text
print(response.choices[0].finish_reason)    # Why generation stopped
\`\`\`

## API Security Best Practices

1. **Never** hardcode API keys in your code
2. **Always** use environment variables
3. **Never** commit .env files to git
4. **Rotate** keys regularly
5. **Set spend limits** in your API dashboard`,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Understanding the Chat Completions API",
          type: "article",
          content: `# Understanding the Chat Completions API

The Chat Completions endpoint is the workhorse of AI development. Understanding its structure deeply unlocks everything else.

## The Messages Array

Every request to GPT or Claude centres on a messages array — a list of turns in the conversation.

\`\`\`python
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What is it famous for?"}
]
\`\`\`

## The Three Roles

**system** — The "instruction manual" for the model
- Sets behaviour, tone, and constraints
- The user never sees this in a UI
- Best practice: put your core instructions here

**user** — What the human says
- The actual input from your user (or your script)

**assistant** — What the AI said previously
- Used to build multi-turn conversations
- You append each AI response to maintain context

## Building a Conversation Loop

\`\`\`python
from openai import OpenAI
import os

client = OpenAI()

conversation = [
    {"role": "system", "content": "You are a concise tech explainer. Keep answers under 100 words."}
]

while True:
    user_input = input("You: ")
    if user_input.lower() == 'quit':
        break
    
    conversation.append({"role": "user", "content": user_input})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=conversation
    )
    
    assistant_message = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": assistant_message})
    
    print(f"AI: {assistant_message}\\n")
\`\`\`

## Key Parameters

\`\`\`python
response = client.chat.completions.create(
    model="gpt-4o-mini",        # Which model
    messages=messages,           # The conversation
    temperature=0.7,             # Creativity (0-2)
    max_tokens=500,              # Limit response length
    top_p=0.9,                   # Nucleus sampling
    presence_penalty=0.1,        # Penalise topic repetition
    frequency_penalty=0.1,       # Penalise word repetition
    stream=False,                # Streaming (next lesson)
)
\`\`\`

## The Gemini Equivalent

\`\`\`python
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

response = model.generate_content("Explain quantum entanglement simply.")
print(response.text)
\`\`\`

## Token Counting and Cost Estimation

\`\`\`python
usage = response.usage
print(f"Input tokens: {usage.prompt_tokens}")
print(f"Output tokens: {usage.completion_tokens}")
print(f"Total tokens: {usage.total_tokens}")

# Estimate cost (GPT-4o mini pricing)
cost = (usage.prompt_tokens * 0.15 + usage.completion_tokens * 0.60) / 1_000_000
print(f"Estimated cost: \${cost:.6f}")
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
            question: "Where should you store your API keys in a Python project?",
            options: [
              "Directly in your Python file as a string",
              "In a .env file loaded via python-dotenv, never committed to git",
              "In a public GitHub repository for easy access",
              "In a comments at the top of the file"
            ],
            correctAnswer: 1,
            explanation: "API keys must be kept secret. Store them in a .env file, add .env to .gitignore, and load them with python-dotenv."
          },
          {
            id: "q1-2",
            question: "What is the 'system' role in the messages array?",
            options: [
              "A message from the system about errors",
              "The AI's response",
              "Instructions that set the model's behaviour and are hidden from the user",
              "The first user message"
            ],
            correctAnswer: 2,
            explanation: "The 'system' role provides persistent instructions to the model — setting its persona, rules, and behaviour. It's typically not shown to the end user."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Streaming, Function Calling, and Advanced Patterns",
      description: "Build responsive AI apps with streaming and tool integration",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Streaming Responses for Real-Time UX",
          type: "article",
          content: `# Streaming Responses for Real-Time UX

Without streaming, your app waits for the entire response before showing anything. With streaming, tokens appear as they're generated — like watching someone type.

## Why Streaming Matters

- Users see a response immediately (reduced perceived latency)
- Long responses don't feel like the app is frozen
- You can stop generation early if needed
- Essential for chat UI experiences

## Basic Streaming

\`\`\`python
from openai import OpenAI

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Write a 500-word essay on climate change."}],
    stream=True  # Enable streaming
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="", flush=True)

print()  # New line when done
\`\`\`

## Accumulating the Full Response

\`\`\`python
full_response = ""
for chunk in stream:
    content = chunk.choices[0].delta.content
    if content is not None:
        full_response += content
        print(content, end="", flush=True)

print(f"\\n\\nTotal length: {len(full_response)} chars")
\`\`\`

## Streaming in a Web App (FastAPI + SSE)

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from openai import OpenAI

app = FastAPI()
client = OpenAI()

@app.post("/chat")
async def chat(message: str):
    def generate():
        stream = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": message}],
            stream=True
        )
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield f"data: {content}\\n\\n"
        yield "data: [DONE]\\n\\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
\`\`\`

## Gemini Streaming

\`\`\`python
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain blockchain.", stream=True)

for chunk in response:
    print(chunk.text, end="", flush=True)
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "Function Calling: Giving AI Access to Tools",
          type: "article",
          content: `# Function Calling: Giving AI Access to Tools

Function calling lets the AI decide when to call your code — and with what arguments. It's the bridge between language and action.

## The Concept

Instead of guessing how to format tool calls, you define your functions as JSON schemas. The AI:
1. Reads your function definitions
2. Decides if/when to call one based on the user's request
3. Returns structured JSON arguments (not prose)
4. You execute the function and return the result
5. The AI incorporates the result into its response

## Defining a Function

\`\`\`python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g. 'London, UK'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["location"]
            }
        }
    }
]
\`\`\`

## The Full Function Calling Loop

\`\`\`python
import json
from openai import OpenAI

client = OpenAI()

def get_weather(location: str, unit: str = "celsius") -> dict:
    # In reality, call a weather API
    return {"location": location, "temperature": 22, "unit": unit, "condition": "sunny"}

messages = [{"role": "user", "content": "What's the weather like in Tokyo?"}]

# Step 1: Ask model with tools
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# Step 2: Check if model wants to call a function
if response.choices[0].finish_reason == "tool_calls":
    tool_call = response.choices[0].message.tool_calls[0]
    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)
    
    # Step 3: Execute the function
    result = get_weather(**arguments)
    
    # Step 4: Add results to messages
    messages.append(response.choices[0].message)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })
    
    # Step 5: Get final response
    final = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )
    print(final.choices[0].message.content)
\`\`\`

## Practical Use Cases

- **Database queries**: AI decides what to query based on user request
- **Calendar scheduling**: AI calls calendar API to find/create events
- **Email**: AI drafts and sends emails via Gmail API
- **Search**: AI decides when to search the web vs answer from memory
- **Calculations**: AI routes precise math to a calculator function`,
          estimatedMinutes: 30,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Error Handling and Rate Limits",
          type: "article",
          content: `# Error Handling and Rate Limits

Production AI apps fail gracefully. Here's how to handle every common failure mode.

## Common API Errors

| Error | Code | Cause | Fix |
|-------|------|-------|-----|
| RateLimitError | 429 | Too many requests | Exponential backoff |
| AuthenticationError | 401 | Bad API key | Check .env file |
| InvalidRequestError | 400 | Bad parameters | Check docs |
| APIConnectionError | - | Network issues | Retry with backoff |
| ContentFilterError | - | Content policy | Change prompt |

## Implementing Retry with Exponential Backoff

\`\`\`python
import time
import random
from openai import OpenAI, RateLimitError, APIConnectionError

client = OpenAI()

def api_call_with_retry(messages, max_retries=3, base_delay=1):
    """Retry API calls with exponential backoff."""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages
            )
            return response.choices[0].message.content
            
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limited. Retrying in {delay:.1f}s...")
            time.sleep(delay)
            
        except APIConnectionError as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(base_delay * (2 ** attempt))
    
    raise Exception("Max retries exceeded")
\`\`\`

## Timeout Handling

\`\`\`python
import httpx

client = OpenAI(timeout=httpx.Timeout(30.0, connect=5.0))

try:
    response = client.chat.completions.create(...)
except httpx.TimeoutException:
    print("Request timed out — try a shorter prompt or max_tokens")
\`\`\`

## Rate Limit Management

\`\`\`python
import time
from collections import deque

class RateLimiter:
    def __init__(self, requests_per_minute=60):
        self.rpm = requests_per_minute
        self.requests = deque()
    
    def wait_if_needed(self):
        now = time.time()
        # Remove requests older than 60 seconds
        while self.requests and now - self.requests[0] > 60:
            self.requests.popleft()
        
        if len(self.requests) >= self.rpm:
            sleep_time = 60 - (now - self.requests[0])
            if sleep_time > 0:
                print(f"Rate limit: waiting {sleep_time:.1f}s")
                time.sleep(sleep_time)
        
        self.requests.append(now)

rate_limiter = RateLimiter(requests_per_minute=60)

def safe_api_call(messages):
    rate_limiter.wait_if_needed()
    return client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
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
            question: "What HTTP status code typically indicates a rate limit error?",
            options: ["401", "404", "429", "500"],
            correctAnswer: 2,
            explanation: "HTTP 429 means 'Too Many Requests' — you've exceeded the API's rate limit and should back off and retry."
          },
          {
            id: "q2-2",
            question: "What does function calling allow an AI model to do?",
            options: [
              "Write Python functions automatically",
              "Decide when and how to call your code, returning structured arguments",
              "Call other AI models",
              "Generate faster responses"
            ],
            correctAnswer: 1,
            explanation: "Function calling lets the AI identify when a tool is needed and return structured JSON arguments so your code can execute the right function."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Building Prompt Pipelines",
      description: "Design reusable, robust prompt systems for production",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Prompt Templates and Dynamic Injection",
          type: "article",
          content: `# Prompt Templates and Dynamic Injection

Hard-coded prompts break when requirements change. Templates make prompts maintainable.

## The Problem with Hard-Coded Prompts

\`\`\`python
# Bad: hard-coded, not reusable
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Summarise this weekly sales report for Q1 2024 in 3 bullet points."}]
)
\`\`\`

If the period changes, you edit code. If the format changes, you edit code. If the content changes, you edit code.

## Template Approach

\`\`\`python
from string import Template

SUMMARISE_TEMPLATE = Template("""
Summarise the following $content_type for $period in $num_points bullet points.
Focus on: $focus_areas.

Content:
$content
""")

def summarise(content, content_type="report", period="Q1 2024", 
              num_points=3, focus_areas="key metrics and action items"):
    prompt = SUMMARISE_TEMPLATE.substitute(
        content_type=content_type,
        period=period,
        num_points=num_points,
        focus_areas=focus_areas,
        content=content
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
\`\`\`

## Jinja2 for Complex Templates

For more complex prompts (loops, conditionals):

\`\`\`python
from jinja2 import Template

ANALYSIS_TEMPLATE = Template("""
You are an expert {{ analyst_type }}.

Analyse the following {{ data_type }}:
{{ content }}

{% if include_recommendations %}
Provide:
1. Key findings (3-5 points)
2. Specific recommendations
{% else %}
Provide:
1. Key findings (3-5 points)
{% endif %}

{% if audience == "executive" %}
Keep language non-technical. Lead with business impact.
{% else %}
Include technical details where relevant.
{% endif %}
""")

prompt = ANALYSIS_TEMPLATE.render(
    analyst_type="financial analyst",
    data_type="quarterly earnings report",
    content=report_text,
    include_recommendations=True,
    audience="executive"
)
\`\`\`

## Prompt Version Control

\`\`\`python
PROMPTS = {
    "summarise_v1": "Summarise this: {text}",
    "summarise_v2": "Provide a 3-bullet summary of the key points in: {text}",
    "summarise_v3": "You are a concise analyst. Summarise: {text}\\nFormat: 3 bullet points, max 20 words each."
}

def get_prompt(name: str, **kwargs) -> str:
    template = PROMPTS.get(name)
    if not template:
        raise ValueError(f"Unknown prompt: {name}")
    return template.format(**kwargs)
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Chaining Prompts for Complex Tasks",
          type: "article",
          content: `# Chaining Prompts for Complex Tasks

Complex tasks often require multiple AI calls, each feeding the next.

## Why Chain?

- One very complex prompt often produces worse results than several focused ones
- Intermediate outputs can be validated before proceeding
- Easier to debug — you can see where the chain breaks
- Different steps can use different models or temperatures

## A Simple Chain: Extract → Analyse → Format

\`\`\`python
from openai import OpenAI

client = OpenAI()

def ai(prompt: str, system: str = None, temperature: float = 0.3) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=temperature
    )
    return response.choices[0].message.content

def process_customer_review(review: str) -> dict:
    # Step 1: Extract key information
    extracted = ai(f"""Extract from this review:
- Sentiment (positive/negative/mixed)
- Main product mentioned
- Top 3 specific issues or praises
- Rating implied (1-5)

Review: {review}

Return as JSON.""")
    
    # Step 2: Generate response
    response = ai(f"""Given this customer review analysis: {extracted}
    
Write a professional customer service response that:
- Acknowledges specific points raised
- If negative: apologises and offers resolution
- If positive: thanks and reinforces brand value
- Max 3 sentences""",
    system="You are a customer service specialist for a premium electronics brand.")
    
    # Step 3: Check tone
    tone_check = ai(f"""Rate this customer service response on:
- Professionalism (1-5)
- Empathy (1-5)
- Clarity (1-5)

Response: {response}

If any score is below 4, rewrite the response. Return final version.""")
    
    return {
        "analysis": extracted,
        "response": tone_check
    }
\`\`\`

## Parallel Chains

\`\`\`python
import asyncio
from openai import AsyncOpenAI

async_client = AsyncOpenAI()

async def analyse_parallel(documents: list[str]) -> list[str]:
    tasks = [
        async_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Summarise in 2 sentences: {doc}"}]
        )
        for doc in documents
    ]
    responses = await asyncio.gather(*tasks)
    return [r.choices[0].message.content for r in responses]

# Process 10 documents in parallel instead of sequentially
summaries = asyncio.run(analyse_parallel(documents))
\`\`\``,
          estimatedMinutes: 30,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Caching and Cost Optimisation",
          type: "article",
          content: `# Caching and Cost Optimisation

API costs add up fast. Smart caching can reduce costs by 80%.

## When to Cache

- Same prompt asked repeatedly (FAQs, product descriptions)
- Expensive analysis that doesn't change (document summaries)
- User sessions that ask the same questions

## Simple In-Memory Cache

\`\`\`python
import hashlib
import time
from openai import OpenAI

client = OpenAI()

class PromptCache:
    def __init__(self, ttl_seconds=3600):
        self.cache = {}
        self.ttl = ttl_seconds
    
    def _key(self, prompt: str, model: str) -> str:
        return hashlib.md5(f"{model}:{prompt}".encode()).hexdigest()
    
    def get(self, prompt: str, model: str):
        key = self._key(prompt, model)
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry["timestamp"] < self.ttl:
                return entry["response"]
            del self.cache[key]
        return None
    
    def set(self, prompt: str, model: str, response: str):
        key = self._key(prompt, model)
        self.cache[key] = {"response": response, "timestamp": time.time()}

cache = PromptCache(ttl_seconds=3600)

def cached_ai(prompt: str, model="gpt-4o-mini") -> str:
    cached = cache.get(prompt, model)
    if cached:
        print("✓ Cache hit — no API call")
        return cached
    
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}]
    )
    result = response.choices[0].message.content
    cache.set(prompt, model, result)
    return result
\`\`\`

## Redis Cache for Production

\`\`\`python
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def redis_cached_ai(prompt: str, ttl=3600) -> str:
    cache_key = f"ai:{hashlib.md5(prompt.encode()).hexdigest()}"
    
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    result = response.choices[0].message.content
    r.setex(cache_key, ttl, json.dumps(result))
    return result
\`\`\`

## Other Cost Reduction Strategies

\`\`\`python
# 1. Use cheaper models for simple tasks
def route_to_model(prompt: str) -> str:
    word_count = len(prompt.split())
    if word_count < 50:
        return "gpt-4o-mini"     # $0.15/1M tokens
    elif word_count < 500:
        return "gpt-4o-mini"
    else:
        return "gpt-4o"           # Complex tasks

# 2. Limit max_tokens
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=messages,
    max_tokens=200  # Don't pay for tokens you don't need
)

# 3. Truncate long inputs
def truncate_to_tokens(text: str, max_tokens: int = 3000) -> str:
    words = text.split()
    estimated_tokens = len(words) * 1.3
    if estimated_tokens > max_tokens:
        truncated_words = int(max_tokens / 1.3)
        return " ".join(words[:truncated_words]) + "..."
    return text
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
            question: "What is the main advantage of chaining multiple smaller prompts over one large prompt?",
            options: [
              "It uses fewer tokens overall",
              "It's always faster",
              "Each step is focused, debuggable, and validatable",
              "It works with free API tiers"
            ],
            correctAnswer: 2,
            explanation: "Chaining lets you validate intermediate results, use different models/temperatures per step, and makes debugging much easier than a single monolithic prompt."
          },
          {
            id: "q3-2",
            question: "What is a cache TTL?",
            options: [
              "A type of API key",
              "Time-To-Live — how long a cached response stays valid",
              "Total Tokens Left in your budget",
              "A model parameter"
            ],
            correctAnswer: 1,
            explanation: "TTL (Time-To-Live) defines how long a cached result is considered fresh. After the TTL expires, the next request triggers a new API call."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Building a Complete AI Application",
      description: "Put it all together with a real-world AI app from scratch",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Designing Your AI App Architecture",
          type: "article",
          content: `# Designing Your AI App Architecture

Before writing code, design the system. Good architecture prevents pain later.

## The AI App Stack

\`\`\`
Frontend (React/HTML)
    ↕
Backend API (FastAPI/Flask)
    ↕
AI Service Layer (your prompts + chain logic)
    ↕
LLM APIs (OpenAI / Gemini / Anthropic)
    ↕
Supporting Services (database, cache, search)
\`\`\`

## Project: AI Document Analyser

We'll build a tool that:
1. Accepts a document upload (PDF/text)
2. Extracts key information
3. Answers questions about the document
4. Generates a structured summary

## File Structure

\`\`\`
ai-doc-analyser/
├── main.py              # FastAPI app
├── services/
│   ├── ai_service.py    # All AI logic
│   ├── doc_service.py   # Document processing
│   └── cache_service.py # Caching layer
├── models/
│   └── schemas.py       # Pydantic models
├── prompts/
│   ├── extraction.j2    # Jinja2 templates
│   ├── qa.j2
│   └── summary.j2
├── .env
└── requirements.txt
\`\`\`

## The AI Service Layer

\`\`\`python
# services/ai_service.py
from openai import OpenAI
from jinja2 import Environment, FileSystemLoader
import os

client = OpenAI()
jinja_env = Environment(loader=FileSystemLoader("prompts"))

class AIService:
    def __init__(self, model="gpt-4o-mini", temperature=0.3):
        self.model = model
        self.temperature = temperature
    
    def _complete(self, system: str, user: str) -> str:
        response = client.chat.completions.create(
            model=self.model,
            temperature=self.temperature,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user}
            ]
        )
        return response.choices[0].message.content
    
    def extract_info(self, document: str) -> dict:
        template = jinja_env.get_template("extraction.j2")
        prompt = template.render(document=document)
        result = self._complete(
            system="You are a document analyst. Always return valid JSON.",
            user=prompt
        )
        import json
        return json.loads(result)
    
    def answer_question(self, document: str, question: str) -> str:
        return self._complete(
            system="Answer questions based only on the provided document. If the answer is not in the document, say so.",
            user=f"Document:\\n{document}\\n\\nQuestion: {question}"
        )
    
    def generate_summary(self, document: str, style: str = "executive") -> str:
        template = jinja_env.get_template("summary.j2")
        prompt = template.render(document=document, style=style)
        return self._complete(
            system="You are a professional document summariser.",
            user=prompt
        )
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Building the REST API with FastAPI",
          type: "article",
          content: `# Building the REST API with FastAPI

FastAPI is perfect for AI applications — async support, automatic docs, and type safety.

## Install Dependencies

\`\`\`bash
pip install fastapi uvicorn python-multipart pydantic pypdf2
\`\`\`

## Main Application

\`\`\`python
# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.ai_service import AIService
from services.doc_service import extract_text
import uvicorn

app = FastAPI(title="AI Document Analyser", version="1.0.0")
ai = AIService()

class QuestionRequest(BaseModel):
    document_id: str
    question: str

# In-memory doc store (use a database in production)
documents = {}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document."""
    if file.content_type not in ["text/plain", "application/pdf"]:
        raise HTTPException(400, "Only text and PDF files are supported")
    
    content = await file.read()
    text = extract_text(content, file.content_type)
    
    if len(text) < 50:
        raise HTTPException(400, "Document appears to be empty or unreadable")
    
    doc_id = f"doc_{len(documents) + 1}"
    documents[doc_id] = text
    
    info = ai.extract_info(text[:4000])  # First 4K tokens for extraction
    
    return {
        "document_id": doc_id,
        "filename": file.filename,
        "char_count": len(text),
        "extracted_info": info
    }

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """Ask a question about an uploaded document."""
    if request.document_id not in documents:
        raise HTTPException(404, "Document not found")
    
    doc_text = documents[request.document_id]
    answer = ai.answer_question(doc_text[:6000], request.question)
    
    return {"answer": answer}

@app.get("/summary/{document_id}")
async def get_summary(document_id: str, style: str = "executive"):
    """Generate a summary of a document."""
    if document_id not in documents:
        raise HTTPException(404, "Document not found")
    
    doc_text = documents[document_id]
    summary = ai.generate_summary(doc_text[:6000], style)
    return {"summary": summary}

@app.get("/summary/{document_id}/stream")
async def stream_summary(document_id: str):
    """Stream a document summary."""
    if document_id not in documents:
        raise HTTPException(404, "Document not found")
    
    doc_text = documents[document_id]
    
    def generate():
        from openai import OpenAI
        c = OpenAI()
        stream = c.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Summarise this document:\\n{doc_text[:4000]}"}],
            stream=True
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield f"data: {chunk.choices[0].delta.content}\\n\\n"
        yield "data: [DONE]\\n\\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`

## Running Your API

\`\`\`bash
uvicorn main:app --reload
# Visit http://localhost:8000/docs for automatic API documentation
\`\`\``,
          estimatedMinutes: 30,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Testing and Deploying Your AI App",
          type: "article",
          content: `# Testing and Deploying Your AI App

Production AI applications need testing strategies different from traditional software.

## Testing AI Components

\`\`\`python
# tests/test_ai_service.py
import pytest
from unittest.mock import patch, MagicMock
from services.ai_service import AIService

class TestAIService:
    def setup_method(self):
        self.ai = AIService()
    
    @patch('services.ai_service.client')
    def test_answer_question_from_document(self, mock_client):
        # Mock the API response
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "The revenue was $10M."
        mock_client.chat.completions.create.return_value = mock_response
        
        result = self.ai.answer_question(
            "The company reported revenue of $10M in Q4.",
            "What was the revenue?"
        )
        assert "10M" in result
    
    @patch('services.ai_service.client')
    def test_refuses_out_of_document_questions(self, mock_client):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "The answer is not in the document."
        mock_client.chat.completions.create.return_value = mock_response
        
        result = self.ai.answer_question(
            "This document is about sales figures.",
            "Who is the CEO?"
        )
        assert "not in the document" in result.lower()

# Integration tests (use real API, mark as slow)
@pytest.mark.integration
def test_real_summary():
    ai = AIService()
    result = ai.generate_summary("Python is a programming language.")
    assert len(result) > 20
\`\`\`

## Deploying to Railway (Simple)

\`\`\`bash
# Install Railway CLI
npm i -g @railway/cli
railway login

# In your project directory
railway init
railway up
\`\`\`

Add environment variables in Railway dashboard:
- OPENAI_API_KEY
- Any other secrets

## Deploying to Google Cloud Run

\`\`\`dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
\`\`\`

\`\`\`bash
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-app
gcloud run deploy --image gcr.io/PROJECT_ID/ai-app --platform managed
\`\`\`

## Production Checklist

- [ ] API keys in environment variables (never in code)
- [ ] Rate limiter implemented
- [ ] Error handling and fallbacks
- [ ] Request logging (without logging sensitive data)
- [ ] Cost monitoring and alerts set up
- [ ] Input validation and sanitisation
- [ ] Output length limits
- [ ] Spend limits set in OpenAI dashboard`,
          estimatedMinutes: 25,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "Why mock the AI client in unit tests?",
            options: [
              "Because the AI is too smart to test",
              "To avoid API costs and make tests fast and deterministic",
              "Because the API doesn't support testing",
              "Only integration tests matter for AI apps"
            ],
            correctAnswer: 1,
            explanation: "Mocking the AI client makes tests fast (no network), cheap (no API costs), and deterministic (same result every run) — essential for CI/CD pipelines."
          },
          {
            id: "q4-2",
            question: "What should NEVER be stored in your code repository?",
            options: [
              "Your test files",
              "Your API keys",
              "Your FastAPI routes",
              "Your Dockerfile"
            ],
            correctAnswer: 1,
            explanation: "API keys are secrets. Committing them to a repository (even private) is a security risk. Always use environment variables and add .env to .gitignore."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Advanced Patterns: Embeddings and Semantic Search",
      description: "Add semantic intelligence to your AI applications",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Generating and Storing Embeddings",
          type: "article",
          content: `# Generating and Storing Embeddings

Embeddings turn text into vectors, enabling semantic search and similarity matching.

## Generating Embeddings with OpenAI

\`\`\`python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text: str, model="text-embedding-3-small") -> list[float]:
    text = text.replace("\\n", " ")
    response = client.embeddings.create(input=[text], model=model)
    return response.data[0].embedding

# Example
embedding = get_embedding("What is machine learning?")
print(f"Embedding dimension: {len(embedding)}")  # 1536 for text-embedding-3-small
\`\`\`

## Computing Similarity

\`\`\`python
def cosine_similarity(a: list, b: list) -> float:
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Find most similar document
query = get_embedding("How do neural networks learn?")
docs = [
    "Neural networks learn through backpropagation and gradient descent",
    "The weather today is sunny with a high of 72°F",
    "Deep learning uses multiple layers to extract features"
]
doc_embeddings = [get_embedding(d) for d in docs]

similarities = [cosine_similarity(query, de) for de in doc_embeddings]
best_idx = np.argmax(similarities)
print(f"Most relevant: {docs[best_idx]}")
\`\`\`

## Building a Simple Document Search

\`\`\`python
class SimpleVectorStore:
    def __init__(self):
        self.documents = []
        self.embeddings = []
    
    def add(self, text: str, metadata: dict = None):
        embedding = get_embedding(text)
        self.documents.append({"text": text, "metadata": metadata or {}})
        self.embeddings.append(embedding)
    
    def search(self, query: str, top_k: int = 3) -> list:
        query_embedding = get_embedding(query)
        similarities = [
            cosine_similarity(query_embedding, emb)
            for emb in self.embeddings
        ]
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        return [
            {**self.documents[i], "similarity": similarities[i]}
            for i in top_indices
        ]

# Usage
store = SimpleVectorStore()
store.add("Python is great for data science", {"source": "article1"})
store.add("JavaScript powers the web", {"source": "article2"})
store.add("NumPy is essential for numerical computing", {"source": "article3"})

results = store.search("scientific computing with Python")
for r in results:
    print(f"{r['similarity']:.3f}: {r['text']}")
\`\`\``,
          estimatedMinutes: 25,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Integrating Semantic Search into Your App",
          type: "article",
          content: `# Integrating Semantic Search into Your App

Combine semantic search with LLM generation for powerful question-answering.

## The RAG Pattern (Preview)

Retrieval-Augmented Generation (RAG) in its simplest form:
1. User asks a question
2. Find the most relevant documents via semantic search
3. Include those documents in the LLM prompt
4. LLM answers based on retrieved context

This is covered in depth in the dedicated RAG course — here's the foundation.

## A Simple Q&A System

\`\`\`python
class SimpleQASystem:
    def __init__(self):
        self.store = SimpleVectorStore()
        self.ai = OpenAI()
    
    def add_knowledge(self, texts: list[str]):
        for text in texts:
            self.store.add(text)
        print(f"Added {len(texts)} documents to knowledge base")
    
    def answer(self, question: str, top_k: int = 3) -> str:
        # Step 1: Retrieve relevant context
        relevant = self.store.search(question, top_k=top_k)
        context = "\\n\\n".join([r["text"] for r in relevant])
        
        # Step 2: Generate answer
        response = self.ai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Answer questions using only the provided context. If the answer is not in the context, say so."
                },
                {
                    "role": "user",
                    "content": f"Context:\\n{context}\\n\\nQuestion: {question}"
                }
            ]
        )
        return response.choices[0].message.content

# Example
qa = SimpleQASystem()
qa.add_knowledge([
    "Our return policy allows returns within 30 days with receipt.",
    "Shipping is free for orders over $50.",
    "We offer express shipping for $15 extra.",
    "Customer support is available Mon-Fri 9am-6pm EST.",
    "We accept Visa, Mastercard, and PayPal."
])

answer = qa.answer("How long do I have to return an item?")
print(answer)
\`\`\``,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Optimising Embedding Performance",
          type: "article",
          content: `# Optimising Embedding Performance

Embeddings can be slow and expensive at scale. Here's how to make them production-ready.

## Batch Embedding (Much Cheaper)

\`\`\`python
def get_embeddings_batch(texts: list[str], model="text-embedding-3-small") -> list:
    """Embed multiple texts in one API call — far cheaper than individual calls."""
    clean_texts = [t.replace("\\n", " ") for t in texts]
    response = client.embeddings.create(input=clean_texts, model=model)
    return [item.embedding for item in response.data]

# Batch 100 docs in one call vs 100 individual calls
texts = ["document " + str(i) for i in range(100)]
embeddings = get_embeddings_batch(texts)  # 1 API call
\`\`\`

## Caching Embeddings

\`\`\`python
import hashlib
import pickle
import os

CACHE_DIR = ".embedding_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

def cached_embedding(text: str) -> list:
    cache_key = hashlib.md5(text.encode()).hexdigest()
    cache_path = f"{CACHE_DIR}/{cache_key}.pkl"
    
    if os.path.exists(cache_path):
        with open(cache_path, "rb") as f:
            return pickle.load(f)
    
    embedding = get_embedding(text)
    
    with open(cache_path, "wb") as f:
        pickle.dump(embedding, f)
    
    return embedding
\`\`\`

## Persisting to Disk

\`\`\`python
import numpy as np
import json

class PersistentVectorStore:
    def __init__(self, path: str):
        self.path = path
        self.documents = []
        self.embeddings = []
        self._load()
    
    def _load(self):
        if os.path.exists(f"{self.path}.json"):
            with open(f"{self.path}.json") as f:
                self.documents = json.load(f)
        if os.path.exists(f"{self.path}.npy"):
            self.embeddings = np.load(f"{self.path}.npy").tolist()
    
    def save(self):
        with open(f"{self.path}.json", "w") as f:
            json.dump(self.documents, f)
        np.save(f"{self.path}.npy", np.array(self.embeddings))
    
    def add(self, text: str, metadata: dict = None):
        embedding = cached_embedding(text)
        self.documents.append({"text": text, "metadata": metadata or {}})
        self.embeddings.append(embedding)
        self.save()
\`\`\`

## Choosing the Right Embedding Model

| Model | Dimensions | Best For | Cost |
|-------|-----------|----------|------|
| text-embedding-3-small | 1536 | General use, low cost | $0.02/1M tokens |
| text-embedding-3-large | 3072 | High accuracy | $0.13/1M tokens |
| Gemini text-embedding-004 | 768 | Free tier | Free (limits apply) |`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "What does cosine similarity measure between two embeddings?",
            options: [
              "The number of shared words",
              "The length difference between texts",
              "The semantic similarity — how alike the meanings are",
              "The edit distance between strings"
            ],
            correctAnswer: 2,
            explanation: "Cosine similarity measures the angle between two vectors in embedding space. Vectors pointing in similar directions (similar meaning) have high cosine similarity."
          },
          {
            id: "q5-2",
            question: "Why is batch embedding more efficient than individual calls?",
            options: [
              "Batch calls use a different, faster model",
              "You get free tokens with batch calls",
              "Multiple texts are embedded in one API round-trip",
              "Batch embeddings are more accurate"
            ],
            correctAnswer: 2,
            explanation: "Batch API calls reduce network overhead — instead of 100 HTTP round-trips, you make 1. This is dramatically faster and cheaper."
          }
        ]
      }
    },
    {
      id: "chapter-6",
      title: "Production, Monitoring, and Next Steps",
      description: "Ship reliable AI features and keep them running well",
      order: 6,
      lessons: [
        {
          id: "lesson-6-1",
          title: "Monitoring AI Applications in Production",
          type: "article",
          content: `# Monitoring AI Applications in Production

AI apps have unique monitoring needs beyond traditional software metrics.

## What to Monitor

### Cost Metrics
\`\`\`python
import logging

logger = logging.getLogger(__name__)

def tracked_api_call(messages: list, model="gpt-4o-mini") -> str:
    response = client.chat.completions.create(
        model=model,
        messages=messages
    )
    
    usage = response.usage
    cost = (usage.prompt_tokens * 0.15 + usage.completion_tokens * 0.60) / 1_000_000
    
    logger.info({
        "event": "api_call",
        "model": model,
        "input_tokens": usage.prompt_tokens,
        "output_tokens": usage.completion_tokens,
        "cost_usd": round(cost, 6),
    })
    
    return response.choices[0].message.content
\`\`\`

### Quality Metrics
\`\`\`python
import time

def monitored_ai_call(prompt: str, expected_format: str = None) -> dict:
    start = time.time()
    response_text = tracked_api_call([{"role": "user", "content": prompt}])
    latency = time.time() - start
    
    quality_signals = {
        "too_short": len(response_text) < 20,
        "refusal_detected": any(phrase in response_text.lower() for phrase in 
                               ["i cannot", "i'm sorry", "i can't help"]),
        "format_valid": True if not expected_format else validate_format(response_text, expected_format)
    }
    
    return {
        "response": response_text,
        "latency_ms": round(latency * 1000),
        "quality": quality_signals
    }
\`\`\`

### OpenAI's Built-in Usage Dashboard
Check platform.openai.com/usage for:
- Daily token usage graphs
- Cost breakdown by model
- Set spending limits and alerts

## Logging with LangSmith (Optional)

LangSmith provides full observability for LLM apps:
\`\`\`python
# pip install langsmith
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-langsmith-key"

# All LangChain calls are now automatically traced
\`\`\``,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-6-2",
          title: "Handling Edge Cases and Safety",
          type: "article",
          content: `# Handling Edge Cases and Safety

Production AI apps encounter unexpected inputs. Design for resilience.

## Input Validation

\`\`\`python
from pydantic import BaseModel, validator

class ChatRequest(BaseModel):
    message: str
    conversation_id: str
    
    @validator("message")
    def validate_message(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Message cannot be empty")
        if len(v) > 10000:
            raise ValueError("Message too long (max 10,000 chars)")
        return v.strip()

# Detect potential prompt injection
INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all prior prompts",
    "pretend you are",
    "you are now",
    "disregard your system prompt"
]

def check_for_injection(text: str) -> bool:
    text_lower = text.lower()
    return any(pattern in text_lower for pattern in INJECTION_PATTERNS)

def safe_process(user_message: str) -> str:
    if check_for_injection(user_message):
        return "I can only help with questions related to our product."
    return ai_call(user_message)
\`\`\`

## Output Validation

\`\`\`python
import json

def get_structured_output(prompt: str, schema: dict, max_retries=3) -> dict:
    for attempt in range(max_retries):
        prompt_with_format = f"{prompt}\\n\\nReturn ONLY valid JSON matching this schema:\\n{json.dumps(schema)}"
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt_with_format}],
            response_format={"type": "json_object"}
        )
        
        try:
            result = json.loads(response.choices[0].message.content)
            return result
        except json.JSONDecodeError:
            if attempt == max_retries - 1:
                raise ValueError("Model failed to return valid JSON")
            continue
\`\`\`

## Graceful Degradation

\`\`\`python
def ai_with_fallback(prompt: str, fallback_text: str = "Service temporarily unavailable") -> str:
    try:
        return ai_call(prompt, model="gpt-4o")
    except Exception as premium_error:
        try:
            return ai_call(prompt, model="gpt-4o-mini")  # Fallback to cheaper model
        except Exception as mini_error:
            logger.error(f"Both models failed: {premium_error}, {mini_error}")
            return fallback_text
\`\`\``,
          estimatedMinutes: 25,
          order: 2
        },
        {
          id: "lesson-6-3",
          title: "What to Build Next",
          type: "article",
          content: `# What to Build Next

You've built the foundation. Here's how to keep growing.

## Project Ideas to Practise

### Beginner Projects
1. **Email Auto-Responder**: Read emails, classify intent, draft replies
2. **Meeting Notes Summariser**: Paste transcript → structured summary with action items
3. **Code Explainer**: Paste any code snippet → plain English explanation

### Intermediate Projects
4. **Customer Support Bot**: Answer product questions using a knowledge base (RAG)
5. **Resume Analyser**: Upload resume + job description → match score and suggestions
6. **Content Calendar Generator**: Brand details → weeks of social posts

### Advanced Projects
7. **AI Research Assistant**: Agent that searches the web, reads papers, synthesises
8. **Automated Data Pipeline**: Process CSV files with AI-generated insights
9. **Multi-Modal App**: Process images + text together

## Natural Next Courses

After this course, explore:

**LangChain & Agents** — Build multi-step AI agents that use tools, memory, and reasoning to complete complex tasks autonomously.

**RAG & Vector Databases** — Build production-grade knowledge bases with Pinecone, Chroma, or Weaviate for enterprise-scale Q&A.

**Fine-Tuning** — When prompting isn't enough, teach the model your specific domain, style, or vocabulary.

## The Developer Mindset for AI

- **Start with prompts** — always try prompting before building infrastructure
- **Validate outputs** — treat AI responses as untrusted user input
- **Monitor costs** — a bug can drain a budget in minutes
- **Version your prompts** — small wording changes can have big effects
- **Fail gracefully** — always have fallbacks
- **Stay current** — the APIs and models evolve every month`,
          estimatedMinutes: 15,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q6-1",
            question: "What should you check for in user inputs before sending to an AI API?",
            options: [
              "Only spelling errors",
              "Prompt injection attempts, length limits, and empty inputs",
              "Whether the user is logged in",
              "The user's timezone"
            ],
            correctAnswer: 1,
            explanation: "Always validate inputs: check for injection attempts (users trying to override your system prompt), enforce length limits, and reject empty inputs."
          },
          {
            id: "q6-2",
            question: "What is graceful degradation in an AI application?",
            options: [
              "The AI getting worse over time",
              "Slowing down the app when traffic is high",
              "Falling back to a cheaper model or default response when the primary model fails",
              "Removing AI features when costs are too high"
            ],
            correctAnswer: 2,
            explanation: "Graceful degradation means having fallbacks: if the primary (expensive) model fails, try a cheaper one; if all AI fails, return a sensible default message."
          }
        ]
      }
    }
  ]
};
