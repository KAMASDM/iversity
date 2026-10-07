import { balanceAnswers } from './balanceAnswers.js';

export const mcpAgentsCourse = balanceAnswers({
  title: "Building AI Agents with MCP & Agent Skills",
  description: "Go from chatbot to capable agent. Learn how modern AI agents plan, call tools and act — then build your own Model Context Protocol (MCP) servers, package expertise as Agent Skills, and ship agents that are safe, observable and genuinely useful.",
  category: "AI & Machine Learning",
  level: "intermediate",
  duration: 5,
  topics: [
    "The agent loop: reason, act, observe",
    "Tool calling and structured outputs",
    "Model Context Protocol (MCP) architecture",
    "Building MCP servers in Python",
    "Agent Skills and context engineering",
    "Multi-step and multi-agent workflows",
    "Permissions, human-in-the-loop and security",
    "Shipping and monitoring agents in production"
  ],
  objectives: [
    "Explain how an AI agent differs from a chatbot and when an agent is the right tool",
    "Describe MCP's host, client and server roles and its tools, resources and prompts primitives",
    "Build and test a working MCP server that exposes tools to any MCP-compatible app",
    "Package repeatable expertise as an Agent Skill using a SKILL.md file",
    "Design agent workflows with sensible permissions, approvals and guardrails",
    "Plan an agent's path to production, including evaluation and monitoring"
  ],
  prerequisites: [
    "Comfortable reading basic Python",
    "Has used an AI assistant such as ChatGPT or Claude",
    "Helpful but not required: the 'Building AI-Powered Applications with APIs' course"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "From Chatbots to Agents",
      description: "Understand what makes something an agent, how the agent loop works, and when you should (and shouldn't) build one",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "What Actually Is an AI Agent?",
          type: "article",
          content: `# What Actually Is an AI Agent?

"Agent" is the most overused word in AI right now. Let's pin it down so you can spot the real thing.

## The One-Sentence Definition

**An AI agent is a language model that runs in a loop, deciding which actions to take, taking them through tools, and using the results to decide what to do next — until the goal is met.**

A chatbot answers. An agent *does*.

## Chatbot vs. Workflow vs. Agent

| | Chatbot | AI Workflow | AI Agent |
|---|---|---|---|
| Who decides the steps? | Nobody — single reply | You, in code | The model, at runtime |
| Uses tools? | Rarely | Yes, in a fixed order | Yes, chosen dynamically |
| Handles surprises? | No | Only the ones you coded | Adapts its plan |
| Predictability | High | High | Lower |
| Best for | Q&A, drafting | Repeatable processes | Open-ended, multi-step tasks |

A useful rule of thumb: **if you can draw the flowchart in advance, build a workflow. If the path depends on what you discover along the way, consider an agent.**

## A Concrete Example

Request: *"Find out why last night's sales report is empty and fix it."*

A chatbot can only guess. An agent can:

1. Query the database to check whether yesterday's orders exist
2. Read the report job's logs and spot an authentication error
3. Check the credentials configuration and find an expired token
4. Ask you for approval to rotate it
5. Re-run the job and confirm the report now has data

Nobody wrote "check the logs, then the credentials" in advance. The model chose each step based on what the previous one revealed.

## The Three Ingredients

Every agent, no matter how fancy, combines:

- **A model** — the reasoning engine that decides what to do
- **Tools** — functions the model can call: search, run code, read files, send email
- **A loop with context** — the running memory of the goal, the steps taken and what they returned

Change any one of these and you change what the agent can do. Most real-world improvements come from better tools and better context, not a bigger model.

> **Try it:** Think of a task you did at work this week that took more than three steps. Write down each step and mark which ones required a decision based on new information. Those decision points are exactly where an agent earns its keep.

## Key Takeaways

- An agent = model + tools + a loop that feeds results back in
- Workflows are predictable; agents are adaptable — pick based on how much the path varies
- Most agent quality comes from the tools and context you give it`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "The Agent Loop: Reason, Act, Observe",
          type: "article",
          content: `# The Agent Loop: Reason, Act, Observe

Under the hood, every agent runs the same simple cycle. Once you see it, agent frameworks stop feeling like magic.

## The Loop

1. **Reason** — the model reads the goal plus everything so far and decides the next step
2. **Act** — it requests a tool call, such as \`search_orders(date="2026-10-01")\`
3. **Observe** — your code runs the tool and appends the result to the conversation
4. **Repeat** — until the model replies with a final answer instead of another tool call

## What It Looks Like in Code

Here's the skeleton in plain Python. Real SDKs wrap this, but the shape is always the same:

\`\`\`python
messages = [{"role": "user", "content": goal}]

for step in range(MAX_STEPS):            # always cap the loop
    response = model.generate(messages, tools=TOOLS)

    if not response.tool_calls:          # model is done
        return response.text

    messages.append(response.as_message())
    for call in response.tool_calls:
        result = run_tool(call.name, call.arguments)
        messages.append(tool_result(call.id, result))

raise RuntimeError("Agent hit the step limit without finishing")
\`\`\`

Notice three design decisions hiding in those few lines:

- **A step cap.** Agents can loop forever on a confusing task. Always set a ceiling.
- **The model never executes anything itself.** It *asks*; your code decides whether and how to run the tool. That's your control point for permissions and safety.
- **Results go back into context.** The agent's "memory" is literally the growing message list.

## Why Agents Fail (and What to Do About It)

| Failure | What it looks like | Fix |
|---|---|---|
| Wrong tool | Uses search when it should query the DB | Clearer tool names and descriptions |
| Bad arguments | Passes "yesterday" where a date is required | Strict schemas plus helpful error messages |
| Looping | Repeats the same failing call | Step limits; return errors that suggest a next step |
| Context overflow | Forgets the goal after many steps | Summarise old steps; return concise tool output |
| Overconfidence | Declares success without checking | Add a verification step or tool |

A huge insight: **tool error messages are prompts.** \`Error 400\` teaches the model nothing. \`"date must be YYYY-MM-DD, e.g. 2026-10-01"\` lets it fix itself on the next turn.

> **Try it:** Take any tool you might give an agent (e.g. "send_email"). Write the error message it should return if the recipient address is invalid — in a way that tells the model exactly how to recover.

## Key Takeaways

- Agents are a loop: reason → act → observe → repeat
- Your code, not the model, executes tools — that's where control lives
- Cap the steps, keep tool output concise, and write error messages that teach`,
          estimatedMinutes: 14,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Tool Calling and Structured Outputs",
          type: "article",
          content: `# Tool Calling and Structured Outputs

Tools are an agent's hands. How you describe them decides whether the agent uses them well.

## Anatomy of a Tool

Every major model API describes tools the same way: a name, a description and a JSON Schema for the inputs.

\`\`\`json
{
  "name": "get_order_status",
  "description": "Look up the current status of a customer order. Use this when the user asks where their order is or whether it has shipped.",
  "input_schema": {
    "type": "object",
    "properties": {
      "order_id": {
        "type": "string",
        "description": "Order ID in the format ORD-12345"
      }
    },
    "required": ["order_id"]
  }
}
\`\`\`

The model never sees your code — only this description. So the description *is* the interface.

## Five Rules for Tools Agents Love

1. **Name by intent, not implementation.** \`find_customer\` beats \`db_query_v2\`.
2. **Say when to use it.** "Use this when…" lines dramatically improve tool choice.
3. **Constrain inputs.** Enums, formats and required fields prevent whole classes of mistakes.
4. **Return only what's useful.** A 5,000-row dump drowns the context. Return the top results plus a count.
5. **Prefer a few capable tools over many tiny ones.** Twenty near-identical tools confuse models; consolidate where you can.

## Structured Outputs

Sometimes you don't want prose at all — you want data your code can trust. Structured outputs force the model's final answer to match a schema:

\`\`\`python
from pydantic import BaseModel

class TicketTriage(BaseModel):
    category: str      # "billing" | "bug" | "how-to"
    urgency: int       # 1-5
    summary: str
    needs_human: bool
\`\`\`

Most model SDKs accept a schema like this and guarantee (or strongly encourage) valid JSON back. That's how agents hand results to the rest of your system without fragile text parsing.

## Read-Only vs. Side-Effect Tools

Split your tools into two groups from day one:

| Read-only | Side effects |
|---|---|
| search_docs, get_order_status, list_files | send_email, issue_refund, delete_file |
| Safe to call freely | Need limits, logging and often approval |

This one distinction drives most of your safety design later in the course.

> **Try it:** Write a tool definition for \`book_meeting\`. Decide which fields are required, which use enums, and what the description should say about when *not* to use it.

## Key Takeaways

- The tool description is the interface the model sees — write it like documentation for a new colleague
- Constrain inputs and keep outputs concise
- Separate read-only tools from tools with side effects`,
          estimatedMinutes: 14,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "What best distinguishes an AI agent from a fixed AI workflow?",
            options: [
              "Agents always use larger models",
              "In an agent, the model decides which steps and tools to use at runtime",
              "Workflows can't call external tools",
              "Agents never need human approval"
            ],
            correctAnswer: 1,
            explanation: "In a workflow, you define the steps in code. In an agent, the model chooses the next action based on what it has observed so far."
          },
          {
            id: "q1-2",
            question: "In the agent loop, who actually executes a tool call?",
            options: [
              "The language model runs the code itself",
              "The user, manually",
              "Your application code, after the model requests the call",
              "The tool provider's servers, automatically"
            ],
            correctAnswer: 2,
            explanation: "The model only requests a tool call. Your code decides whether to run it — which is exactly where you enforce permissions and safety."
          },
          {
            id: "q1-3",
            question: "An agent keeps failing because it passes 'yesterday' to a date field. What's the most effective fix?",
            options: [
              "Switch to a bigger model",
              "Remove the date field",
              "Return a helpful error like 'date must be YYYY-MM-DD' and tighten the schema",
              "Increase the step limit"
            ],
            correctAnswer: 2,
            explanation: "Tool error messages act as prompts. A clear, specific error plus a stricter schema lets the model correct itself on the next turn."
          },
          {
            id: "q1-4",
            question: "Why should you separate read-only tools from tools with side effects?",
            options: [
              "Side-effect tools are slower",
              "Tools with side effects need extra limits, logging and often human approval",
              "Models can only use read-only tools",
              "Read-only tools cost more tokens"
            ],
            correctAnswer: 1,
            explanation: "Reading data is low-risk; sending emails or issuing refunds is not. Separating them lets you apply stronger controls where they matter."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Model Context Protocol (MCP) Fundamentals",
      description: "Learn the open standard that lets any AI app connect to any tool or data source",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Why MCP Exists: The USB-C Port for AI",
          type: "article",
          content: `# Why MCP Exists: The USB-C Port for AI

Before MCP, every AI app had to build its own connector for every tool. MCP fixed that — and it's why agents suddenly got so much more capable.

## The N × M Problem

Imagine 10 AI apps (chat assistants, IDEs, agent frameworks) and 50 tools (GitHub, Slack, Postgres, Google Drive…). Without a standard, that's up to **500 custom integrations**, each maintained separately.

The **Model Context Protocol (MCP)** turns that into **10 + 50**: each app implements MCP once as a *client*, each tool implements it once as a *server*, and they all interoperate.

That's why people call it "the USB-C port for AI": one plug shape, endless devices.

## A Short History

- **Late 2024:** Anthropic open-sources MCP
- **2025:** OpenAI, Google, Microsoft and the major IDEs and agent frameworks add support; thousands of community servers appear
- **Late 2025:** MCP moves to neutral governance under the Linux Foundation's Agentic AI Foundation

The result: MCP is now the default way to connect agents to tools and data. Learning it is one of the highest-leverage skills for anyone building with AI.

## What MCP Is — and Isn't

| MCP is… | MCP is not… |
|---|---|
| A protocol (a contract for how apps and tools talk) | A model or an AI product |
| Built on JSON-RPC messages | Tied to one vendor's models |
| A way to expose tools, data and prompt templates | An agent framework — it's what frameworks plug into |

## Where You'll Meet MCP

- **Desktop assistants** that let you add servers for your files, calendar or CRM
- **Coding agents and IDEs** connecting to issue trackers, databases and docs
- **Agent frameworks and SDKs** that load MCP servers as tool sources
- **Enterprise platforms** exposing internal systems to approved AI apps

> **Try it:** List three systems at your company or in your life that you wish an AI assistant could read or act on. Search the web for "<system name> MCP server" — there's a good chance one already exists.

## Key Takeaways

- MCP turns N × M custom integrations into N + M
- Apps implement the client side once; tools implement the server side once
- It's an open, vendor-neutral standard — learn it once, use it everywhere`,
          estimatedMinutes: 10,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "MCP Architecture: Hosts, Clients and Servers",
          type: "article",
          content: `# MCP Architecture: Hosts, Clients and Servers

MCP has a small vocabulary. Master these few terms and every MCP doc will make sense.

## The Three Roles

| Role | What it is | Example |
|---|---|---|
| **Host** | The AI application the user interacts with | A desktop assistant, an IDE, your own agent |
| **Client** | A connector inside the host, one per server | The host's link to your GitHub server |
| **Server** | A program that exposes capabilities | A GitHub server, a Postgres server, your custom server |

One host can connect to many servers at once. Each connection gets its own client, which keeps servers isolated from one another.

## The Three Server Primitives

Servers can offer three kinds of things:

- **Tools** — actions the *model* can decide to call. Example: \`create_issue\`, \`run_query\`.
- **Resources** — data the *application* can load into context. Example: a file, a database schema, a document.
- **Prompts** — reusable templates the *user* can pick. Example: a "Summarise this PR" prompt with arguments.

A handy way to remember it: **tools are model-controlled, resources are app-controlled, prompts are user-controlled.**

## What Clients Can Offer Back

The protocol goes both ways. Clients can provide capabilities to servers too, such as:

- **Sampling** — the server asks the host's model to generate text (so the server doesn't need its own API key)
- **Roots** — the host tells the server which folders or locations it may work within
- **Elicitation** — the server asks the user for extra information mid-task

## Transports: How Messages Travel

- **stdio** — the host launches the server as a local process and talks over standard input/output. Simple and great for local tools.
- **Streamable HTTP** — the server runs as a web service. Used for remote and shared servers, typically with OAuth-based authorisation.

## A Session in Slow Motion

1. Host starts and connects to the server (\`initialize\`), and both sides agree on capabilities
2. Client asks \`tools/list\` and gets names, descriptions and schemas
3. The host gives those tool definitions to the model
4. The model requests a tool; the client sends \`tools/call\`
5. The server runs it and returns the result, which goes back into the model's context

> **Try it:** For a "company knowledge base" server, decide what should be a tool, what should be a resource and what should be a prompt. (Hint: searching is a tool; a specific policy document is a resource; "draft a policy summary" is a prompt.)

## Key Takeaways

- Host = the app, client = one connection, server = the capability provider
- Tools (model-controlled), resources (app-controlled), prompts (user-controlled)
- stdio for local servers, Streamable HTTP for remote ones`,
          estimatedMinutes: 14,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Using MCP Servers Safely",
          type: "article",
          content: `# Using MCP Servers Safely

Connecting a server gives an AI real power over real systems. Before you build servers, learn to evaluate the ones you install.

## Every Server Is Code You're Trusting

An MCP server runs with whatever access you give it — your files, your tokens, your network. A malicious or buggy server can leak data or take actions you didn't intend. Treat installing one like installing any software package.

## A Pre-Install Checklist

- **Source:** Is it from the official vendor or a well-known maintainer? Is the code public?
- **Permissions:** What credentials does it need? Can you give it a read-only or narrowly scoped token?
- **Tools exposed:** Read the tool list. Do you need the destructive ones (delete, send, pay)?
- **Updates:** Is it pinned to a version you've reviewed, or will it silently change?
- **Data flow:** Where does data go? A remote server sees everything you send it.

## Risks Specific to Agents

| Risk | What happens | Mitigation |
|---|---|---|
| Prompt injection via content | A web page or email the agent reads contains hidden instructions | Treat tool output as untrusted; require approval for sensitive actions |
| Tool poisoning | A server's tool description contains instructions aimed at the model | Review descriptions; only use trusted servers |
| Over-broad tokens | A server holding an admin token can do anything | Least-privilege, scoped credentials |
| Silent changes | A server update adds new tools or behaviour | Pin versions; review changes |

## The Most Dangerous Combination

Be extra careful when one agent has all three of these at once:

1. Access to **private data** (email, files, databases)
2. Exposure to **untrusted content** (web pages, inbound emails, user uploads)
3. A way to **send data out** (HTTP requests, email, posting messages)

Together they allow an attacker's hidden instructions to exfiltrate your data. Removing any one of the three breaks the attack chain. We'll go deeper on this in the security chapter.

## Human-in-the-Loop

Most hosts let you require confirmation before a tool runs. A sensible default:

- Auto-approve read-only tools you trust
- Always confirm tools that send, delete, pay or publish

> **Try it:** Pick an MCP server you'd like to use. Run through the checklist above and write down the narrowest credential you could give it.

## Key Takeaways

- An MCP server is trusted code with real access — vet it like any dependency
- Use least-privilege tokens and pin versions
- Never combine private data, untrusted content and outbound access without safeguards`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "What problem does MCP primarily solve?",
            options: [
              "It makes language models faster",
              "It replaces the need for APIs",
              "It turns N × M custom app-to-tool integrations into N + M standard ones",
              "It trains models on company data"
            ],
            correctAnswer: 2,
            explanation: "Each app implements an MCP client once and each tool implements an MCP server once, so they all interoperate without bespoke connectors."
          },
          {
            id: "q2-2",
            question: "In MCP, which primitive is controlled by the model?",
            options: [
              "Resources",
              "Prompts",
              "Tools",
              "Roots"
            ],
            correctAnswer: 2,
            explanation: "Tools are model-controlled (the model decides to call them), resources are app-controlled, and prompts are user-controlled."
          },
          {
            id: "q2-3",
            question: "Which transport is typically used for a remote, shared MCP server?",
            options: [
              "stdio",
              "Streamable HTTP",
              "Bluetooth",
              "SMTP"
            ],
            correctAnswer: 1,
            explanation: "stdio suits local servers launched as a subprocess. Remote servers run over Streamable HTTP, usually with OAuth-based authorisation."
          },
          {
            id: "q2-4",
            question: "Which combination makes an agent most vulnerable to data exfiltration?",
            options: [
              "A small model and a short context window",
              "Private data access, exposure to untrusted content, and a way to send data out",
              "Using more than three MCP servers",
              "Running servers over stdio"
            ],
            correctAnswer: 1,
            explanation: "With all three, hidden instructions in untrusted content can make the agent read private data and send it to an attacker. Removing any one breaks the chain."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Building Your Own MCP Server",
      description: "Write, test and connect a real MCP server that exposes tools and resources",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Your First MCP Server in Python",
          type: "article",
          content: `# Your First MCP Server in Python

Let's build a working server in about 30 lines. We'll create a tiny "support desk" server that lets any MCP host look up orders.

## Setup

\`\`\`bash
mkdir support-mcp && cd support-mcp
python -m venv .venv && source .venv/bin/activate
pip install "mcp[cli]"
\`\`\`

The official Python SDK includes **FastMCP**, a high-level API that turns ordinary functions into MCP tools.

## The Server

\`\`\`python
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("support-desk")

ORDERS = {
    "ORD-1001": {"status": "shipped", "carrier": "DHL", "eta": "2026-10-12"},
    "ORD-1002": {"status": "processing", "carrier": None, "eta": None},
}

@mcp.tool()
def get_order_status(order_id: str) -> dict:
    """Look up an order's status. Use when a customer asks where their
    order is. order_id looks like ORD-1001."""
    order = ORDERS.get(order_id.upper())
    if order is None:
        return {"error": f"No order {order_id}. IDs look like ORD-1001."}
    return order

@mcp.resource("policy://returns")
def returns_policy() -> str:
    """The company's returns policy."""
    return "Items can be returned within 30 days in original packaging."

if __name__ == "__main__":
    mcp.run()   # stdio transport by default
\`\`\`

## What FastMCP Did for You

- The function name became the **tool name**
- The docstring became the **description** the model reads
- The type hints became the **input schema** (order_id: string, required)
- The return value is serialised and sent back as the tool result

That's why good docstrings and type hints matter so much here: they're literally the prompt.

## Notice the Error Message

When an order isn't found we don't raise a bare exception — we return a message that tells the model the expected format. The agent can recover on its own.

> **Try it:** Add a second tool, \`list_recent_orders(limit: int = 5)\`, that returns the newest orders. Keep the docstring explicit about when to use it versus \`get_order_status\`.

## Key Takeaways

- FastMCP turns decorated Python functions into MCP tools and resources
- Docstrings and type hints become the description and schema the model sees
- Return helpful errors instead of crashing`,
          estimatedMinutes: 15,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Testing and Connecting Your Server",
          type: "article",
          content: `# Testing and Connecting Your Server

A server nobody can connect to isn't much use. Let's test it properly, then plug it into a real host.

## Step 1: Test with the MCP Inspector

The MCP Inspector is an official browser-based tool for poking at servers without involving a model.

\`\`\`bash
mcp dev server.py
\`\`\`

This launches your server and opens the Inspector, where you can:

- See the tool and resource lists exactly as a host would
- Call \`get_order_status\` with test inputs, including bad ones
- Check that descriptions and schemas read clearly

**Always test the unhappy paths:** wrong formats, missing IDs, empty results. That's where agents get stuck in production.

## Step 2: Connect to a Host

Most desktop hosts read a JSON config that tells them how to launch local servers. The shape is broadly similar across apps:

\`\`\`json
{
  "mcpServers": {
    "support-desk": {
      "command": "/path/to/support-mcp/.venv/bin/python",
      "args": ["/path/to/support-mcp/server.py"]
    }
  }
}
\`\`\`

Restart the host, and your tools appear. Ask: *"Where is order ORD-1001?"* — the model should call your tool and answer with the carrier and ETA.

Coding agents and agent SDKs have equivalent ways to register a server, either via a config file or a CLI command. Check your host's docs for the exact location.

## Step 3: Debug Like a Pro

| Symptom | Likely cause |
|---|---|
| Server doesn't appear | Wrong path or Python interpreter in config; check host logs |
| Tool appears but never gets used | Vague name or description — rewrite it |
| Tool called with wrong arguments | Schema too loose; add format hints and examples |
| Garbled output | Printing to stdout — with stdio, stdout is the protocol channel. Log to stderr instead |

That last one bites almost everyone once: **with the stdio transport, never print debug messages to stdout.**

> **Try it:** Deliberately break your server's description (make it vague, like "does stuff"). Ask the host the same question and observe how tool selection changes. Then fix it.

## Key Takeaways

- Use the MCP Inspector to test tools before involving a model
- Hosts launch local servers from a small JSON config
- With stdio, keep stdout clean — log to stderr`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Designing Production-Grade MCP Servers",
          type: "article",
          content: `# Designing Production-Grade MCP Servers

A demo server and a server your whole company relies on are different animals. Here's what changes.

## Design Tools Around Tasks, Not Endpoints

A common mistake is wrapping every REST endpoint as a tool. Agents do better with **fewer, task-shaped tools**:

| Endpoint-shaped (avoid) | Task-shaped (prefer) |
|---|---|
| get_user, get_user_orders, get_order_items, get_shipment | get_customer_overview(email) |
| create_draft, add_recipient, attach_file, send_draft | send_email(to, subject, body, attachments) |

Each extra round-trip costs tokens, time and another chance to go wrong.

## Keep Responses Lean

- Return the fields the agent needs, not the raw API payload
- Paginate large results and say how many more exist
- Offer a \`detail\` or \`verbose\` flag when deeper data is occasionally needed

## Authentication for Remote Servers

When your server runs over Streamable HTTP for many users:

- Use the protocol's **OAuth-based authorisation** flow rather than shared API keys
- Act **on behalf of the signed-in user**, so the agent can only reach what that user can
- Never pass a user's token through to unrelated downstream services

## Safety Built Into the Server

- **Idempotency:** make retries safe (e.g. pass an idempotency key when issuing refunds)
- **Limits:** cap amounts, rates and batch sizes in the server — not just in prompts
- **Dry-run modes:** let agents preview destructive actions before confirming
- **Audit logs:** record who asked, which tool ran, with what inputs, and the outcome

## Versioning

Tool names and schemas are a contract. Renaming a tool or changing a required field can silently break every agent using it. Add new tools or optional fields instead of breaking old ones, and document changes.

> **Try it:** Take an internal API you know and sketch the 3–5 task-shaped tools you'd expose. For each, mark whether it needs approval, a dry-run mode or a hard limit.

## Key Takeaways

- Fewer, task-shaped tools beat a 1:1 wrapper of your API
- Remote servers should use OAuth and act with the user's own permissions
- Enforce limits, idempotency and audit logging inside the server itself`,
          estimatedMinutes: 14,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "In FastMCP, where does the model get a tool's description from?",
            options: [
              "A separate YAML file",
              "The function's docstring",
              "The variable names inside the function",
              "It is generated randomly"
            ],
            correctAnswer: 1,
            explanation: "FastMCP uses the decorated function's docstring as the tool description and its type hints as the input schema."
          },
          {
            id: "q3-2",
            question: "Your stdio MCP server produces garbled output in the host. What's the most likely cause?",
            options: [
              "The model is too small",
              "You're printing debug messages to stdout, which is the protocol channel",
              "The server has too many tools",
              "Resources must be async"
            ],
            correctAnswer: 1,
            explanation: "With the stdio transport, stdout carries protocol messages. Debug output should go to stderr."
          },
          {
            id: "q3-3",
            question: "Why are task-shaped tools usually better than wrapping every API endpoint?",
            options: [
              "They are easier to version",
              "They reduce round-trips, token use and opportunities for error",
              "Models can't call more than five tools",
              "Endpoints can't be described in JSON Schema"
            ],
            correctAnswer: 1,
            explanation: "One task-shaped tool can replace several chained calls, which saves time and tokens and gives the agent fewer chances to go wrong."
          },
          {
            id: "q3-4",
            question: "Where should hard limits like maximum refund amounts be enforced?",
            options: [
              "Only in the system prompt",
              "In the tool's description text",
              "Inside the server's code, regardless of what the model asks",
              "In the user's browser"
            ],
            correctAnswer: 2,
            explanation: "Prompts can be ignored or manipulated. Limits enforced in server code hold no matter what the model requests."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Agent Skills and Context Engineering",
      description: "Give agents reusable expertise and the right information at the right time",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Context Engineering: The Skill Behind Great Agents",
          type: "article",
          content: `# Context Engineering: The Skill Behind Great Agents

Prompt engineering is about writing a good instruction. **Context engineering** is about deciding *everything* the model sees at each step — and it's what separates toy agents from reliable ones.

## The Context Window Is a Budget

At every step, the model's context contains:

- System instructions
- Tool definitions
- Retrieved documents and resources
- The conversation and every tool result so far

All of it competes for the model's attention. More isn't better: irrelevant context dilutes focus, raises cost and slows responses. Long-running agents often degrade not because the model got worse, but because their context filled up with noise.

## Four Core Techniques

| Technique | What it means | Example |
|---|---|---|
| **Select** | Load only what's relevant now | Retrieve 3 relevant docs, not the whole wiki |
| **Compress** | Summarise what's no longer needed in full | Replace 20 old tool results with a short progress note |
| **Isolate** | Split work so each part has a clean context | A sub-agent researches; only its summary returns |
| **Persist** | Save state outside the window | Write a notes or TODO file the agent re-reads later |

## Just-in-Time Context

Instead of stuffing everything up front, give the agent **ways to fetch** context when it needs it: a search tool, a file reader, a resource list. The agent keeps lightweight references (file paths, IDs) and loads details on demand — the same way you'd use a filing cabinet rather than memorising every file.

## Writing System Instructions for Agents

Good agent instructions are specific about the *job*, not just the tone:

- The goal and what "done" looks like
- Which tools to prefer for which situations
- When to stop and ask a human
- What never to do

> **Try it:** Take an agent instruction you've written (or a chatbot system prompt). Highlight every sentence that wouldn't change what the agent *does*. Delete those, and add one sentence about when it should stop and ask for help.

## Key Takeaways

- Context engineering = curating everything the model sees at each step
- Select, compress, isolate and persist to keep context focused
- Prefer just-in-time retrieval over front-loading everything`,
          estimatedMinutes: 13,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Packaging Expertise as Agent Skills",
          type: "article",
          content: `# Packaging Expertise as Agent Skills

MCP gives agents *capabilities*. **Agent Skills** give them *know-how*: the procedures, checklists and judgement your best people use.

## What Is a Skill?

A skill is simply a folder with a \`SKILL.md\` file — and optionally scripts, templates or reference documents. The open Agent Skills format uses a short metadata header followed by instructions:

\`\`\`markdown
---
name: quarterly-report
description: Builds the finance team's quarterly performance report. Use when asked for a quarterly report, QBR deck or quarter-over-quarter analysis.
---

# Quarterly Report

1. Pull revenue and cost data with the finance-db tools for the quarter requested.
2. Compare against the same quarter last year and the previous quarter.
3. Use template.xlsx in this folder; never change its formulas.
4. Flag any metric that moved more than 10% and suggest a likely cause.
5. Finish with three bullet-point recommendations.
\`\`\`

## Progressive Disclosure: Why Skills Scale

Agents can't load hundreds of detailed procedures into context at once. Skills solve this in layers:

1. **At start-up**, only each skill's *name and description* are loaded — a few dozen tokens each
2. **When a task matches**, the agent reads the full \`SKILL.md\`
3. **Only if needed**, it opens bundled files or runs bundled scripts

So you can install many skills without bloating every conversation. That's why the description line matters most: it decides whether the skill ever gets used.

## Skills vs. MCP vs. Prompts

| | Gives the agent… | Example |
|---|---|---|
| **MCP server** | Access to systems and actions | Query the finance database |
| **Skill** | A repeatable procedure and standards | How *our* team builds a quarterly report |
| **Prompt** | A one-off instruction | "Make this paragraph shorter" |

They work best together: the skill describes the process and calls tools provided by MCP servers.

## What Makes a Great Skill

- A description that says **what** it does and **when** to use it
- Concrete, ordered steps and explicit standards ("never change formulas")
- Deterministic work moved into **scripts** instead of asking the model to do arithmetic or formatting by hand
- Small and focused: one skill per job

> **Try it:** Write a SKILL.md for a task you repeat at work (a weekly update, a code review, a client brief). Keep it under 30 lines and make the description specific enough that an agent would know exactly when to load it.

## Key Takeaways

- A skill is a folder with SKILL.md: metadata plus instructions and optional resources
- Progressive disclosure keeps many skills cheap until they're needed
- MCP provides capabilities; skills provide procedures`,
          estimatedMinutes: 14,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Multi-Step and Multi-Agent Patterns",
          type: "article",
          content: `# Multi-Step and Multi-Agent Patterns

Most production systems combine a few well-known patterns. Knowing them saves you from reinventing — or over-engineering.

## Start Simple: Workflow Patterns

These are often enough on their own:

- **Prompt chaining** — step 1's output feeds step 2 (outline → draft → edit)
- **Routing** — classify the request, then send it to a specialised prompt or model
- **Parallelisation** — run independent checks at once and combine the results
- **Evaluator–optimiser** — one call drafts, another critiques, repeat until it passes

## Orchestrator and Sub-Agents

For broad tasks, an **orchestrator** agent breaks the job into pieces and hands each to a **sub-agent** with its own clean context:

\`\`\`
Orchestrator: "Compare our pricing with 5 competitors"
  ├─ Sub-agent 1: research competitor A  → 200-word summary
  ├─ Sub-agent 2: research competitor B  → 200-word summary
  └─ ...
Orchestrator: combine summaries → final comparison
\`\`\`

Benefits: parallel work, and each sub-agent's messy exploration stays out of the orchestrator's context (the *isolate* technique from earlier).

Costs: many more tokens, and harder debugging. Multi-agent setups shine for wide research tasks and struggle with tightly coupled ones, such as editing the same file.

## Human-in-the-Loop Checkpoints

Good agents know when to pause. Build in approval points:

- Before irreversible actions (sending, paying, deleting, publishing)
- When confidence is low or sources conflict
- When the plan changes significantly from what the user asked

A simple pattern: the agent proposes a **plan** first, the human approves or edits it, then the agent executes.

## Choosing a Pattern

| Situation | Start with |
|---|---|
| Fixed, repeatable process | Prompt chain or workflow |
| Different request types | Routing |
| Open-ended, single area | Single agent with good tools |
| Broad research across many sources | Orchestrator + sub-agents |
| High-stakes actions | Any of the above + approval checkpoints |

> **Try it:** Take a process like "onboard a new client". Sketch it first as a simple chain. Then mark the one or two steps where an agent's flexibility would genuinely help — and where a human must approve.

## Key Takeaways

- Simple workflows solve most problems; add agents where flexibility pays off
- Sub-agents isolate context and parallelise work, at a higher token cost
- Put human approval in front of irreversible actions`,
          estimatedMinutes: 14,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "What does 'context engineering' focus on?",
            options: [
              "Choosing the largest available model",
              "Curating everything the model sees at each step: instructions, tools, retrieved data and history",
              "Writing longer system prompts",
              "Fine-tuning a model on company data"
            ],
            correctAnswer: 1,
            explanation: "Context engineering is about deciding what goes into the context window at each step so the model stays focused and effective."
          },
          {
            id: "q4-2",
            question: "How do Agent Skills avoid filling the context window when many are installed?",
            options: [
              "They are compressed with zip",
              "Only each skill's name and description load at first; full instructions load when relevant",
              "Agents can only install one skill",
              "Skills run on a separate model"
            ],
            correctAnswer: 1,
            explanation: "This progressive disclosure means skills stay cheap until a task actually needs them."
          },
          {
            id: "q4-3",
            question: "Which statement best describes the relationship between MCP and Agent Skills?",
            options: [
              "They are competing standards; you must pick one",
              "MCP provides access to systems and actions; skills provide repeatable procedures that can use those tools",
              "Skills replace the need for tools",
              "MCP is only for coding agents"
            ],
            correctAnswer: 1,
            explanation: "MCP gives agents capabilities; skills give them know-how. A skill's steps often call tools that MCP servers provide."
          },
          {
            id: "q4-4",
            question: "What is a key trade-off of orchestrator/sub-agent designs?",
            options: [
              "They can't run in parallel",
              "They use more tokens and are harder to debug, though they isolate context",
              "They require fine-tuned models",
              "They can't use tools"
            ],
            correctAnswer: 1,
            explanation: "Sub-agents parallelise work and keep exploration out of the main context, but they cost more tokens and add debugging complexity."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Shipping Agents to Production",
      description: "Make agents safe, measurable and maintainable once real users depend on them",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Permissions, Guardrails and Approvals",
          type: "article",
          content: `# Permissions, Guardrails and Approvals

An agent's worst day is defined by what it's *allowed* to do. Design that first.

## Least Privilege, Applied to Agents

- Give each agent only the tools its job requires
- Scope credentials to the minimum (read-only where possible, specific folders, specific projects)
- Run agents with the **user's** permissions, not a super-admin service account
- Use separate agents for separate jobs rather than one agent with every tool

## Layered Guardrails

No single check is enough. Combine layers:

| Layer | Example |
|---|---|
| Input checks | Block obviously out-of-scope or abusive requests |
| Tool-level limits | Max refund $100; email only to company domains |
| Approval gates | Human confirms before send, pay, delete, publish |
| Output checks | Scan responses for secrets or personal data before showing them |
| Sandboxing | Run code and browsing in isolated environments without access to production secrets |

## Designing Good Approval Requests

An approval prompt that says "Allow tool call? Y/N" trains people to click yes. A good one shows:

- **What** will happen, in plain language ("Send this email to 340 customers")
- **The exact content or parameters**
- **Why** the agent wants to do it
- **What can't be undone**

## Budget and Rate Limits

Agents can burn money fast when they loop. Set:

- Maximum steps per task
- Maximum tokens or cost per task and per user per day
- Timeouts on every tool call
- Alerts when spending spikes

## Failing Safely

When something goes wrong, the agent should stop and report, not improvise. Write that into its instructions and enforce it in code: after repeated tool failures, end the task and summarise what happened for a human.

> **Try it:** For an agent you'd like to build, list every tool and classify each as auto-approve, approve-once-per-session, or always-approve. Then write one hard limit that lives in code.

## Key Takeaways

- Least privilege: minimal tools, scoped credentials, the user's own permissions
- Layer guardrails — input, tool limits, approvals, output checks, sandboxing
- Cap steps, cost and time, and make failure a clean stop`,
          estimatedMinutes: 13,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Evaluating and Monitoring Agents",
          type: "article",
          content: `# Evaluating and Monitoring Agents

"It worked when I tried it" is not a quality bar. Agents need systematic evaluation before launch and observability after.

## What to Measure

| Metric | Question it answers |
|---|---|
| Task success rate | Did it achieve the goal? |
| Correct tool use | Did it pick the right tools with valid arguments? |
| Steps and cost per task | Is it efficient, or wandering? |
| Escalation rate | How often did it (rightly) ask a human? |
| Safety violations | Did it ever attempt a forbidden action? |
| User satisfaction | Did people find it helpful? |

## Build an Evaluation Set

1. Collect **20–50 realistic tasks**, including tricky and adversarial ones
2. Define what success looks like for each (an expected answer, a final state to check, or a rubric)
3. Run the agent on every task after **every change** — prompt, tool, model or skill
4. Track scores over time so you notice regressions

Check **final outcomes** where you can (was the ticket actually updated?) rather than only grading the text the agent wrote.

## Trace Everything

Each agent run should produce a trace: every model call, tool call, input, output, duration and cost, linked together. Traces let you answer "why did it do that?" in minutes instead of hours. Many observability tools support this out of the box, and emerging OpenTelemetry conventions for generative AI make traces portable between them.

## Watch Production Signals

- Spikes in steps, cost or latency
- Rising tool error rates (often a sign an API changed)
- Increasing human escalations or negative feedback
- New kinds of requests your eval set doesn't cover — add them

Agents are non-deterministic: the same input can produce different paths. Run important evals several times and look at the rates, not single results.

> **Try it:** Write five evaluation tasks for the support-desk server you built in Chapter 3, including one where the order doesn't exist and one where the user tries to get a refund the agent shouldn't give.

## Key Takeaways

- Measure task success, tool correctness, cost and safety
- Keep an eval set and re-run it after every change
- Trace every run and watch production signals for drift`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Capstone: Designing a Customer Support Agent",
          type: "article",
          content: `# Capstone: Designing a Customer Support Agent

Let's pull everything together into one production-ready design you can adapt for your own project.

## The Brief

An online store wants an agent that answers order questions, processes simple returns and hands complex cases to humans — available around the clock.

## 1. Workflow or Agent?

Order lookups follow a fixed path, but customers phrase requests endlessly and cases combine (a late order that also needs a return). **Decision:** a single agent with a small set of task-shaped tools, plus human escalation.

## 2. Tools (via an MCP Server)

| Tool | Type | Controls |
|---|---|---|
| get_order_overview(order_id or email) | Read | Only the signed-in customer's orders |
| search_help_center(query) | Read | Returns the top 3 articles |
| create_return(order_id, items, reason) | Write | Within 30 days only; idempotency key |
| issue_refund(order_id, amount) | Write | Max $50 automatic; above that requires human approval |
| escalate_to_human(summary, priority) | Write | Always allowed |

## 3. A Skill for the Process

A \`returns-handling\` skill describes the policy steps: verify eligibility, explain options, confirm with the customer before creating the return, and always send the return label link.

## 4. Context Plan

- System instructions: role, tone, when to escalate, things never to do
- Load the customer's order overview at the start (just in time, scoped to them)
- Retrieve help articles only when policy questions come up
- Summarise long conversations instead of carrying every turn

## 5. Guardrails

- Customer data access scoped to the authenticated customer
- Help-center content and customer messages treated as untrusted input
- No outbound tools except the ones listed — no general web or email access
- Step cap of 15, per-conversation cost cap, timeouts on every tool

## 6. Evaluation and Launch

- 50 eval conversations: happy paths, edge cases, angry customers, refund-abuse attempts
- Shadow mode first: the agent drafts, humans send
- Then gradual rollout with traces, weekly review of escalations, and the eval set growing from real cases

## Your Turn

Use this six-part template — *decision, tools, skill, context, guardrails, evaluation* — for an agent in your own domain. That document is the best possible next step after this course, and a strong portfolio piece.

## Key Takeaways

- Real agents are mostly careful design: tools, context, guardrails and evals
- Start in shadow mode and expand autonomy as evidence accumulates
- The six-part template works for almost any agent project`,
          estimatedMinutes: 15,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "Which is the best application of least privilege to an agent?",
            options: [
              "Give it an admin account so it never gets blocked",
              "Give it only the tools and narrowly scoped credentials its job requires, acting with the user's permissions",
              "Let the model decide which permissions it needs",
              "Share one service account across all agents"
            ],
            correctAnswer: 1,
            explanation: "Minimal tools, scoped credentials and the user's own permissions limit the damage a confused or manipulated agent can do."
          },
          {
            id: "q5-2",
            question: "What makes a good human approval request?",
            options: [
              "A simple 'Allow? Y/N' prompt",
              "Showing what will happen, the exact parameters, why, and what can't be undone",
              "Approving all tool calls automatically after the first one",
              "Asking only for read-only tools"
            ],
            correctAnswer: 1,
            explanation: "Clear, specific approval prompts help people make real decisions instead of clicking 'yes' by habit."
          },
          {
            id: "q5-3",
            question: "Why should important agent evaluations be run multiple times?",
            options: [
              "To use up API credits",
              "Agents are non-deterministic, so rates across runs are more reliable than a single result",
              "The first run is always wrong",
              "Evaluation tools require it"
            ],
            correctAnswer: 1,
            explanation: "The same input can lead to different paths. Looking at success rates across several runs gives a truer picture."
          },
          {
            id: "q5-4",
            question: "What is 'shadow mode' when launching an agent?",
            options: [
              "Running the agent without logging",
              "The agent drafts actions or replies, but humans review and send them",
              "Hiding the agent from users",
              "Running the agent only at night"
            ],
            correctAnswer: 1,
            explanation: "Shadow mode lets you measure real-world quality safely before giving the agent autonomy."
          }
        ]
      }
    }
  ]
});
