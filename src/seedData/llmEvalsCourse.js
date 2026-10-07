import { balanceAnswers } from './balanceAnswers.js';

export const llmEvalsCourse = balanceAnswers({
  title: "LLM Evaluation & Observability: Measuring What Matters",
  description: "The difference between an AI demo and an AI product is evaluation. Learn to build eval datasets, design metrics and LLM-as-judge graders, evaluate RAG systems and agents, and monitor quality in production — so you can ship changes with confidence instead of crossed fingers.",
  category: "AI & Machine Learning",
  level: "intermediate",
  duration: 5,
  topics: [
    "Why vibe checks fail",
    "Error analysis and failure taxonomies",
    "Building evaluation datasets",
    "Code-based checks and LLM-as-judge",
    "Evaluating RAG pipelines",
    "Evaluating agents and tool use",
    "Tracing and production observability",
    "Online evaluation and continuous improvement"
  ],
  objectives: [
    "Explain why systematic evaluation is essential for LLM products",
    "Run error analysis on real outputs to discover what actually goes wrong",
    "Build and maintain an evaluation dataset that reflects real usage",
    "Design reliable graders using code checks and calibrated LLM-as-judge",
    "Evaluate retrieval and generation separately in RAG systems, and evaluate agent trajectories",
    "Set up tracing, dashboards and feedback loops for production AI systems"
  ],
  prerequisites: [
    "Has built or used an LLM-powered feature",
    "Basic Python is helpful for the code examples",
    "Recommended: 'Retrieval-Augmented Generation (RAG) & Vector Databases'"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "Why Evaluation Is the Real Work",
      description: "Move from vibe checks to evidence, starting with looking at your data",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "The Vibe-Check Trap",
          type: "article",
          content: `# The Vibe-Check Trap

Most AI features are tested the same way: someone tries a few prompts, the answers look good, and it ships. This is the **vibe check** — and it's why so many AI products feel great in demos and disappointing in production.

## Why Vibe Checks Fail

- **Tiny samples.** Five hand-picked prompts can't represent thousands of real users.
- **Selection bias.** We test what we expect users to ask, not what they actually ask.
- **Non-determinism.** The same prompt can produce different answers on different runs.
- **Silent regressions.** A prompt tweak that fixes one case quietly breaks three others.
- **Model changes.** Swapping or upgrading a model shifts behaviour in ways nobody notices until users complain.

## What Evaluation Gives You

| Without evals | With evals |
|---|---|
| "It seems better" | "Accuracy rose from 81% to 89% on 300 cases" |
| Fear of changing prompts | Confidence to iterate quickly |
| Model upgrades are risky guesses | Model swaps are measured decisions |
| Users find the bugs | You find them first |

Teams that build strong evaluation habits iterate *faster*, not slower, because every change gets a quick, objective verdict.

## The Evaluation Flywheel

1. **Look at real outputs** and find failures
2. **Name the failure types** and measure how often they happen
3. **Build checks** that detect them automatically
4. **Make changes** to prompts, retrieval, tools or models
5. **Re-run the evals** to confirm improvement without regressions
6. **Monitor production** for new failure types — and feed them back into step 1

## Three Levels of Evaluation

- **Unit-style checks** — fast, cheap assertions run on every change (is it valid JSON? does it cite a source?)
- **Model and human grading** — judging quality on a representative dataset
- **Production monitoring and A/B tests** — measuring real user outcomes

You need all three, at different frequencies.

> **Try it:** Think of an AI feature you use or have built. Write down three ways it could fail that a quick demo would never reveal.

## Key Takeaways

- Vibe checks miss most real-world failures
- Evals turn "seems better" into measured improvement — and speed up iteration
- Evaluation is a flywheel: observe, name, check, change, re-run, monitor`,
          estimatedMinutes: 11,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "Error Analysis: Look at Your Data",
          type: "article",
          content: `# Error Analysis: Look at Your Data

The single most valuable evaluation activity isn't a metric or a tool. It's reading your outputs, carefully, in bulk.

## Why Start Here

Generic metrics like "helpfulness" or "toxicity" might not match *your* problems at all. Your real failures are specific: the bot quotes last year's pricing, ignores the customer's country, or recommends a product that's out of stock. You only discover those by looking.

## The Process

1. **Collect 50–100 real traces** — inputs, retrieved context, tool calls and outputs. If you have no users yet, generate realistic test inputs.
2. **Read each one and write a short note** on anything wrong. Be specific: "Answered about shipping, but user asked about returns."
3. **Group the notes into categories** — your failure taxonomy.
4. **Count** each category to see what matters most.

## An Example Taxonomy

For a customer support assistant after reviewing 100 conversations:

| Failure category | Count |
|---|---|
| Cites outdated policy | 14 |
| Misses part of a multi-part question | 11 |
| Doesn't escalate an angry customer | 6 |
| Wrong tone for the brand | 4 |
| Hallucinated order details | 3 |

Now you know where to focus: outdated policy is a retrieval/content problem, not a prompt problem. A generic "helpfulness score" would never have told you that.

## Tips From Practitioners

- **Have a domain expert do it.** The person who knows what "good" looks like should read the traces — often a product manager or subject-matter expert, not only engineers.
- **Read the first failure in each trace.** Later problems often cascade from it.
- **Keep going until new categories stop appearing.** That's a sign you've seen the main patterns.
- **Repeat regularly.** New features and new users bring new failure modes.

## Make It Easy

A simple spreadsheet works. So does a lightweight internal page that shows one trace at a time with "pass / fail / note" buttons. Removing friction from reviewing is one of the highest-return tools you can build.

> **Try it:** Pull 30 outputs from an AI feature (or generate them). Annotate each in one sentence, then group them into no more than six categories. Which category is biggest?

## Key Takeaways

- Error analysis — reading real outputs — is the foundation of good evals
- Build a failure taxonomy from your own data instead of starting from generic metrics
- Domain experts should review; repeat whenever the product or users change`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Building an Evaluation Dataset",
          type: "article",
          content: `# Building an Evaluation Dataset

An eval dataset is a collection of test inputs — and sometimes expected outputs — that represents the situations your system must handle. It's the foundation for every automated check.

## What Goes in Each Example

\`\`\`json
{
  "id": "returns-017",
  "input": "I bought shoes 45 days ago, can I still return them?",
  "context": {"customer_country": "UK", "order_age_days": 45},
  "expected": "Explains the 30-day window has passed and offers the exchange/credit option",
  "tags": ["returns", "edge-case", "policy"]
}
\`\`\`

You won't always have a single correct answer. Often the "expected" field is a **description of what a good answer must include or avoid**, which a grader checks.

## Where Examples Come From

| Source | Strength | Watch out for |
|---|---|---|
| Real production traffic | Realistic | Privacy — remove personal data |
| Failures found in error analysis | Targets known weaknesses | Overfitting to past bugs only |
| Domain experts | Captures tricky edge cases | Time-consuming |
| Synthetic generation with an LLM | Fast coverage of variations | Can be bland or unrealistic — review it |

## Synthetic Data Done Right

Don't just ask "generate 100 customer questions". Define **dimensions** and combine them:

- *Intent:* returns, shipping, billing, product question
- *Persona:* first-time buyer, frustrated repeat customer, business buyer
- *Difficulty:* simple, multi-part, ambiguous, out-of-scope

Generate inputs for combinations, then have a human review them. This produces far more diverse and realistic data.

## Size and Balance

- Start with **30–100 examples** — enough to spot real differences
- Cover common cases **and** edge cases, adversarial inputs and out-of-scope requests
- Tag examples so you can see scores by category, not just one average

## Keep It Alive

- Add every production failure you fix as a new example (a regression test)
- Version the dataset alongside your code
- Hold back a portion you don't look at while tuning, so you don't overfit

> **Try it:** Define three dimensions for an AI feature you know, with three or four values each. Write five test inputs that combine them in interesting ways.

## Key Takeaways

- An eval dataset represents the situations your system must handle
- Mix real, expert-written and carefully designed synthetic examples
- Tag, version and grow the dataset with every failure you fix`,
          estimatedMinutes: 13,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "Why do 'vibe checks' fail as an evaluation method?",
            options: [
              "They take too long",
              "Small, hand-picked samples miss real-world failures and silent regressions",
              "They require expensive tools",
              "Models refuse to answer test prompts"
            ],
            correctAnswer: 1,
            explanation: "A few prompts that look fine can't represent real usage, and they won't reveal regressions caused by later changes."
          },
          {
            id: "q1-2",
            question: "What is the main output of error analysis?",
            options: [
              "A single accuracy score",
              "A failure taxonomy — categories of real problems and how often each occurs",
              "A fine-tuned model",
              "A new system prompt"
            ],
            correctAnswer: 1,
            explanation: "Reading and categorising real outputs reveals your specific failure modes and their relative importance."
          },
          {
            id: "q1-3",
            question: "What's the best way to make synthetic test data diverse and realistic?",
            options: [
              "Ask an LLM for '100 questions' in one go",
              "Define dimensions such as intent, persona and difficulty, generate combinations, then review them",
              "Copy examples from other companies",
              "Use only the easiest cases"
            ],
            correctAnswer: 1,
            explanation: "Combining defined dimensions produces structured variety; human review catches unrealistic examples."
          },
          {
            id: "q1-4",
            question: "What should you do with a production failure after fixing it?",
            options: [
              "Delete the logs",
              "Add it to the eval dataset as a regression test",
              "Retrain the model",
              "Nothing — it's fixed"
            ],
            correctAnswer: 1,
            explanation: "Adding fixed failures to the dataset ensures future changes don't silently reintroduce them."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Designing Metrics and Graders",
      description: "Turn quality into numbers with code checks, LLM judges and human review",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Code-Based Checks: Fast, Cheap and Reliable",
          type: "article",
          content: `# Code-Based Checks: Fast, Cheap and Reliable

Before reaching for an AI judge, ask: *can I check this with plain code?* Often you can — and code checks are fast, free and perfectly consistent.

## What Code Can Check

| Check | Example |
|---|---|
| Format | Output parses as JSON matching a schema |
| Required content | Answer includes a citation, a link, or the customer's order number |
| Forbidden content | No competitor names, no internal URLs, no email addresses |
| Length | Summary under 100 words |
| Exact match | Classification label equals the expected label |
| Tool use | The agent called \`get_order\` before answering an order question |
| Execution | Generated SQL runs; generated code passes unit tests |

## A Simple Example

\`\`\`python
import json

def check_triage(output: str, example: dict) -> dict:
    results = {}
    try:
        data = json.loads(output)
        results["valid_json"] = True
    except json.JSONDecodeError:
        return {"valid_json": False}

    results["has_fields"] = {"category", "urgency", "summary"} <= data.keys()
    results["correct_category"] = data.get("category") == example["expected_category"]
    results["urgency_in_range"] = data.get("urgency") in range(1, 6)
    return results
\`\`\`

Run this over your whole dataset and you instantly know your JSON validity rate and classification accuracy.

## Classification Metrics

For tasks with labels (routing, triage, moderation), go beyond plain accuracy:

- **Precision** — of the items flagged "urgent", how many really were?
- **Recall** — of the truly urgent items, how many did we catch?
- **Confusion matrix** — which categories get mixed up with which?

If missing an urgent ticket is costly, optimise for recall. If false alarms waste staff time, watch precision.

## Assertions in CI

Treat the fastest checks like unit tests: run them automatically on every prompt or code change, and fail the build if they drop below a threshold. This catches obvious regressions within minutes.

> **Try it:** For an AI feature you know, list five properties of a good output. Mark which ones plain code could check. You'll probably find at least two.

## Key Takeaways

- Use code checks wherever possible: format, required/forbidden content, labels, tool use, execution
- Use precision, recall and confusion matrices for classification tasks
- Run fast checks on every change, like unit tests`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "LLM-as-Judge, Done Properly",
          type: "article",
          content: `# LLM-as-Judge, Done Properly

Some qualities — faithfulness, tone, completeness — can't be checked with code. An **LLM judge** can grade them at scale, *if* you build and validate it carefully.

## Prefer Binary, Specific Judgements

Vague scales produce vague results. Compare:

- ❌ "Rate helpfulness from 1 to 10."
- ✅ "Does the answer address **every** question the customer asked? Answer PASS or FAIL, then explain."

Binary pass/fail on one specific criterion is easier for both models and humans to apply consistently. Build one judge per failure category from your error analysis.

## Anatomy of a Judge Prompt

\`\`\`text
You are evaluating a customer support reply.

Criterion: The reply must not state any policy that contradicts the
POLICY text below.

POLICY:
{policy}

CUSTOMER MESSAGE:
{input}

REPLY:
{output}

First explain your reasoning in 2-3 sentences, then give a final
verdict of PASS or FAIL on its own line.
\`\`\`

Good judge prompts include the criterion, the reference material the judge needs, a few labelled examples of PASS and FAIL, and a request for reasoning before the verdict.

## Validate the Judge Against Humans

A judge is itself a model that can be wrong. Before trusting it:

1. Have a domain expert label 50–100 outputs PASS/FAIL
2. Run the judge on the same outputs
3. Measure agreement — how often does it catch real failures, and how often does it raise false alarms?
4. Refine the prompt or examples where they disagree, and re-measure on fresh examples

Only once agreement is high should the judge run unattended.

## Known Biases

| Bias | Mitigation |
|---|---|
| Prefers longer answers | Judge specific criteria, not overall quality |
| Prefers its own model family's style | Use a different model as judge where practical |
| Position bias in A/B comparisons | Swap the order and average the results |
| Leniency | Include clear FAIL examples in the prompt |

> **Try it:** Pick one failure category from your error analysis. Write a binary judge prompt for it, including one PASS and one FAIL example.

## Key Takeaways

- Use LLM judges for qualities code can't check
- Make them binary and specific — one criterion per judge
- Validate against expert labels before trusting them, and watch for known biases`,
          estimatedMinutes: 14,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Human Review and Running Experiments",
          type: "article",
          content: `# Human Review and Running Experiments

Automated graders scale; humans set the standard. And every change you make should be an experiment you can measure.

## Where Humans Stay Essential

- **Defining "good"** — writing rubrics and labelling examples
- **Validating judges** — the ground truth for LLM-as-judge
- **High-stakes domains** — medical, legal, financial outputs need expert sign-off
- **Spot checks** — regularly reading a sample even when automated scores look fine

## Making Human Review Efficient

- Show reviewers everything they need in one view: input, context, output
- Use binary decisions plus an optional note
- Randomise samples so reviewers don't only see easy cases
- Track agreement between reviewers; if two experts disagree often, your criteria need sharpening

## Comparing Versions: The Experiment Mindset

Every prompt edit, model swap or retrieval change is a hypothesis. Test it like one:

1. Fix the dataset and graders
2. Run **version A** (current) and **version B** (candidate)
3. Compare scores overall **and by tag** — B might win on average but lose badly on one category
4. Check cost and latency alongside quality
5. Decide, and record what you changed and why

## Reading Results Honestly

- **Small differences on small datasets are often noise.** On 50 examples, a 2-point change may mean nothing. Re-run, enlarge the dataset, or look at which specific examples flipped.
- **Run non-deterministic systems several times** and compare averages.
- **Look at the diffs** — the examples that changed from pass to fail — not just the totals.

## Pairwise Comparisons

When absolute scores are hard to define, ask "which is better, A or B?" Humans and judges are both more consistent at comparisons than at absolute ratings. Swap positions to cancel out order bias.

> **Try it:** Choose a prompt you use regularly. Write two versions, run both on ten varied inputs, and grade each pair blind ("which is better?"). Did your intuition about the better version hold up?

## Key Takeaways

- Humans define quality, validate judges and review high-stakes outputs
- Treat every change as an A/B experiment on a fixed dataset
- Beware noise: look at per-category results and at which examples flipped`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "Which quality is best checked with plain code rather than an LLM judge?",
            options: [
              "Whether the tone feels empathetic",
              "Whether the output is valid JSON matching a schema",
              "Whether the explanation is persuasive",
              "Whether the answer is creative"
            ],
            correctAnswer: 1,
            explanation: "Format checks are deterministic, instant and free with code. Save LLM judges for qualities code can't assess."
          },
          {
            id: "q2-2",
            question: "Why are binary pass/fail judgements usually better than 1–10 scales for LLM judges?",
            options: [
              "They use fewer tokens",
              "They are more consistent and easier to validate against human labels",
              "Models can't count to ten",
              "Scales are banned in evaluation"
            ],
            correctAnswer: 1,
            explanation: "A single, specific pass/fail criterion is applied more consistently by both models and humans."
          },
          {
            id: "q2-3",
            question: "Before trusting an LLM judge, what should you do?",
            options: [
              "Use the biggest available model",
              "Measure its agreement with expert human labels on a sample",
              "Run it once to see if it works",
              "Ask it whether it is accurate"
            ],
            correctAnswer: 1,
            explanation: "Judges can be wrong. Agreement with expert labels is the evidence that they measure what you care about."
          },
          {
            id: "q2-4",
            question: "Version B scores 2 points higher than A on a 50-example dataset. What's the right interpretation?",
            options: [
              "B is definitely better; ship it",
              "It may be noise — check per-category results, which examples flipped, and re-run if needed",
              "A is better because it's older",
              "The dataset is broken"
            ],
            correctAnswer: 1,
            explanation: "Small differences on small datasets can be random. Look deeper before deciding."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Evaluating RAG Systems",
      description: "Measure retrieval and generation separately to find where quality breaks",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Evaluating Retrieval",
          type: "article",
          content: `# Evaluating Retrieval

A RAG system can only answer well if it retrieves the right information. Evaluating retrieval on its own tells you whether problems start there.

## Why Separate Retrieval From Generation

When a RAG answer is wrong, there are two very different causes:

1. **The right information wasn't retrieved** → fix chunking, embeddings, search or the content itself
2. **It was retrieved, but the model misused it** → fix the prompt or the model

If you only grade final answers, you can't tell which. So measure each stage.

## Building a Retrieval Test Set

For each test question, record which documents or chunks **should** be retrieved:

\`\`\`json
{
  "question": "What is the parental leave policy for part-time staff?",
  "relevant_docs": ["hr-policy-parental-leave", "hr-policy-part-time"]
}
\`\`\`

You can build this by having experts tag the right sources, or by generating questions *from* specific chunks (so you know which chunk answers each one).

## Core Retrieval Metrics

| Metric | Question it answers |
|---|---|
| **Recall@k** | Of the relevant documents, how many appear in the top k results? |
| **Precision@k** | Of the top k results, how many are relevant? |
| **MRR (Mean Reciprocal Rank)** | How high does the first relevant result appear, on average? |
| **Hit rate** | In what percentage of questions is at least one relevant document in the top k? |

For RAG, **recall@k** usually matters most: if the answer isn't in the context, the model can't use it. Precision matters too, because irrelevant chunks distract the model and cost tokens.

## What to Tune

- **Chunk size and overlap**
- **Embedding model**
- **Hybrid search** (keyword + semantic) for names, codes and jargon
- **Re-ranking** the top results with a stronger model
- **Metadata filters** (date, department, product)
- **Query rewriting** for vague or conversational questions

Change one at a time and re-run the retrieval metrics.

> **Try it:** Write ten questions about a document collection you know, and for each, note which document should answer it. That's a retrieval test set you can use to compare search settings.

## Key Takeaways

- Evaluate retrieval separately from generation to locate problems
- Recall@k is critical for RAG; precision and MRR matter too
- Tune chunking, embeddings, hybrid search and re-ranking one change at a time`,
          estimatedMinutes: 13,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Evaluating Generation: Faithfulness and Relevance",
          type: "article",
          content: `# Evaluating Generation: Faithfulness and Relevance

Once the right context is retrieved, the model must use it correctly. Three questions cover most of what matters.

## The Three Core Questions

| Dimension | Question | Failure looks like |
|---|---|---|
| **Faithfulness (groundedness)** | Is every claim supported by the retrieved context? | Plausible details that aren't in the sources — hallucination |
| **Answer relevance** | Does it actually answer the question asked? | Accurate but off-topic or incomplete |
| **Context use** | Did it use the relevant parts of the context? | Ignores the one chunk that held the answer |

## Measuring Faithfulness

A practical approach with an LLM judge:

1. Break the answer into individual claims
2. For each claim, ask: is this supported by the provided context? (yes / no)
3. Faithfulness = supported claims ÷ total claims

Any unsupported claim in a high-stakes domain is a failure worth investigating, even if the overall score is high.

## Checking Citations

If your system cites sources, verify that:

- Cited documents were actually retrieved
- The cited passage really supports the sentence it's attached to
- Important claims aren't left uncited

Citation checks catch a subtle failure: answers that *look* grounded because they have citations, but where the citation doesn't say what the answer claims.

## The "I Don't Know" Test

Include questions whose answers are **not** in your knowledge base. A good RAG system says it doesn't know or escalates; a weak one invents an answer. Track this rate explicitly — it's one of the strongest trust signals for users.

## Putting It Together

For each test question, record:

- Retrieval: recall@k, precision@k
- Generation: faithfulness, relevance, correct "don't know" behaviour
- Overall: did the user get a correct, useful answer?

Now when quality drops, you can see *which stage* broke.

> **Try it:** Take one answer from a RAG tool you use. Split it into claims and check each against its sources. How many claims were fully supported?

## Key Takeaways

- Faithfulness, relevance and context use are the core generation metrics
- Measure faithfulness claim by claim, and verify citations actually support claims
- Test unanswerable questions — saying "I don't know" is a feature`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Evaluating Agents and Tool Use",
          type: "article",
          content: `# Evaluating Agents and Tool Use

Agents take many steps, call tools and change things in the world. Evaluating them means looking at both the destination and the journey.

## Outcome vs. Trajectory

- **Outcome evaluation** — did the agent achieve the goal? Was the ticket updated, the bug fixed, the meeting booked correctly?
- **Trajectory evaluation** — was the path reasonable? Right tools, sensible order, no dangerous or wasteful steps?

Start with outcomes: they're what users care about. Add trajectory checks for safety, cost and debugging.

## Checking Outcomes by State

Where possible, check the **resulting state** rather than the agent's description of it:

\`\`\`python
def eval_refund_task(env, transcript):
    order = env.db.get_order("ORD-1001")
    return {
        "refund_issued": order.refund_amount == 25.00,
        "customer_notified": env.outbox.sent_to("ana@example.com"),
        "no_extra_refunds": env.db.count_refunds() == 1,
    }
\`\`\`

Agents sometimes *say* they did something they didn't. State checks catch that.

## Trajectory Metrics

| Metric | Why it matters |
|---|---|
| Tool selection accuracy | Picked the right tool for each step |
| Argument validity | Called tools with correct, well-formed inputs |
| Steps per task | Efficiency; loops show up here |
| Forbidden actions attempted | Safety — should be zero |
| Escalations | Asked a human when it should (and only then) |
| Cost and latency per task | Viability at scale |

## Test Environments

Run agents against **sandboxed copies** of your systems — a test database, mock email, fake payment API — so evaluation can be repeated freely without real side effects. Reset the environment between runs.

## Handle Non-Determinism

Agents may solve the same task by different valid paths. So:

- Don't require an exact sequence of tool calls unless order truly matters
- Run each task several times and report a **success rate**
- Distinguish "succeeded every time" from "succeeded sometimes"; the latter needs attention

> **Try it:** Design an eval for an agent task like "reschedule my 3 p.m. meeting to tomorrow". Write two outcome checks against the calendar state and one trajectory check.

## Key Takeaways

- Evaluate outcomes first, ideally by checking real resulting state
- Add trajectory checks for tool use, efficiency, safety and cost
- Use sandboxed environments and success rates across repeated runs`,
          estimatedMinutes: 14,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "Why evaluate retrieval separately from generation in a RAG system?",
            options: [
              "Retrieval is more expensive",
              "It reveals whether a wrong answer came from missing context or from the model misusing good context",
              "Generation can't be evaluated",
              "It is required by vector databases"
            ],
            correctAnswer: 1,
            explanation: "The two failure causes need completely different fixes, so you need to know which stage broke."
          },
          {
            id: "q3-2",
            question: "What does recall@k measure?",
            options: [
              "How fast retrieval is",
              "Of all relevant documents, how many appear in the top k results",
              "How many tokens the answer uses",
              "How often users click citations"
            ],
            correctAnswer: 1,
            explanation: "Recall@k tells you whether the information needed for the answer actually reached the model."
          },
          {
            id: "q3-3",
            question: "How is faithfulness typically measured?",
            options: [
              "By counting words in the answer",
              "By splitting the answer into claims and checking each against the retrieved context",
              "By asking the user to rate it",
              "By comparing to Wikipedia"
            ],
            correctAnswer: 1,
            explanation: "Claim-level checking shows exactly which statements are grounded and which are hallucinated."
          },
          {
            id: "q3-4",
            question: "What's the most reliable way to check whether an agent completed a task?",
            options: [
              "Trust the agent's final message",
              "Check the resulting state of the system, such as the database or outbox",
              "Count its tool calls",
              "Measure response length"
            ],
            correctAnswer: 1,
            explanation: "Agents can claim success incorrectly. Inspecting the actual end state is objective."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Production Observability",
      description: "See inside live AI systems with tracing, monitoring and feedback",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Tracing LLM Applications",
          type: "article",
          content: `# Tracing LLM Applications

When a user reports a bad answer, can you see exactly what happened? Tracing makes the answer "yes, in under a minute".

## What a Trace Captures

A **trace** records one request end to end, broken into **spans** — one per step:

\`\`\`
Trace: "Where is my order?"  (2.8s, $0.004)
├─ span: retrieve_customer        120ms
├─ span: llm.chat (plan)          900ms   1,240 in / 85 out tokens
├─ span: tool.get_order_status    210ms   {"order_id": "ORD-1001"}
├─ span: llm.chat (answer)        1.4s    1,610 in / 120 out tokens
└─ span: output_guardrail         40ms    passed
\`\`\`

For each span, record inputs, outputs, model and parameters, token counts, latency, cost and errors.

## Why Tracing Matters

- **Debugging** — see the exact prompt, context and tool results behind a bad answer
- **Error analysis** — traces are the raw material for the reviews in Chapter 1
- **Cost control** — find the steps that burn the most tokens
- **Latency** — find the slow span
- **Building datasets** — turn interesting traces into eval examples with one click

## Standards Help

Many observability platforms (open-source and commercial) support LLM tracing, and the **OpenTelemetry** project defines semantic conventions for generative-AI spans. Instrumenting with an open standard keeps you free to switch tools later and lets AI traces sit alongside your existing application monitoring.

## Privacy and Retention

Traces can contain personal and sensitive data. Decide up front:

- Which fields to redact or hash (emails, phone numbers, payment details)
- Who can view traces
- How long to keep them
- Whether users have consented to their conversations being reviewed

## Link Traces to Feedback

Attach a trace ID to every response. When a user clicks thumbs-down or files a complaint, you can jump straight to the exact trace.

> **Try it:** Sketch the spans for an AI feature you know. For each, list the two or three attributes you'd most want to see when debugging.

## Key Takeaways

- Traces record every step of a request with inputs, outputs, tokens, latency and cost
- Use them for debugging, error analysis, cost and latency work, and building datasets
- Prefer open standards such as OpenTelemetry, and handle sensitive data deliberately`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Monitoring, Online Evals and Drift",
          type: "article",
          content: `# Monitoring, Online Evals and Drift

Launch is when you start learning what real users need. Monitoring tells you when quality changes and why.

## Operational Metrics

Track these like any production service:

- Latency (median and 95th percentile)
- Error and timeout rates, including tool failures
- Token usage and cost per request, per user and per feature
- Rate-limit hits and retries

## Quality Metrics in Production

You usually can't grade every live response by hand, so combine:

| Signal | Example |
|---|---|
| **Online evals** | Run your code checks and validated judges on a sample of live traffic |
| **Explicit feedback** | Thumbs up/down, ratings, "report a problem" |
| **Implicit feedback** | Users rephrasing the same question, copying answers, abandoning, escalating to a human |
| **Business outcomes** | Ticket resolution rate, conversion, time saved |

Implicit signals are often more honest than ratings — few users click thumbs-down, but many rephrase when an answer misses.

## Drift: When Things Change Underneath You

Quality can shift even when your code doesn't:

- **Input drift** — users start asking about a new product or in a new language
- **Content drift** — your knowledge base goes out of date
- **Model drift** — the provider updates a model version, or you switch models
- **Tool drift** — an API you call changes its response format

Pin model versions where you can, and re-run your offline evals whenever any of these change.

## Alerting Without Noise

Alert on things that need action:

- Sudden cost or latency spikes
- Online eval pass rate dropping below a threshold
- Tool error rate jumping (often an API change)
- Spike in negative feedback or escalations

Review dashboards weekly for slower trends.

## Close the Loop

Monitoring is only useful if it feeds back into improvement:

**Production signals → error analysis → new eval examples → fix → offline evals → deploy → monitor**

> **Try it:** For an AI feature you know, choose one operational metric, one quality metric and one implicit feedback signal you'd put on a dashboard.

## Key Takeaways

- Monitor operations (latency, errors, cost) and quality (online evals, feedback)
- Implicit signals like rephrasing are often more telling than ratings
- Watch for input, content, model and tool drift — and close the loop back into evals`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Guardrails and Safe Rollouts",
          type: "article",
          content: `# Guardrails and Safe Rollouts

Evaluation tells you how good a system is on average. Guardrails and careful rollouts protect users from the cases where it isn't.

## Runtime Guardrails

Checks that run on **every** request, in real time:

| Stage | Example guardrail |
|---|---|
| Input | Block prompt-injection patterns, out-of-scope requests, or personal data you shouldn't process |
| Retrieval | Filter documents the user isn't allowed to see |
| Output | Validate schema, scan for secrets or personal data, check for banned claims |
| Action | Require approval before high-impact tool calls |

When a guardrail triggers, fail gracefully: a helpful fallback message or a human handoff, not a blank error.

## Evals vs. Guardrails

- **Evals** run offline (or on samples) to measure and improve quality
- **Guardrails** run inline to block specific bad outcomes as they happen

Many checks can serve both roles: a JSON-schema check is an eval metric during development and a guardrail in production. Keep guardrails fast — they add latency to every request.

## Rolling Out Changes Safely

Never switch 100% of traffic to a new prompt or model at once:

1. **Offline evals** must pass, with no regression by category
2. **Shadow mode** — run the new version alongside the old one and compare outputs without showing them to users
3. **Canary** — send a small percentage of traffic to the new version and watch metrics
4. **Gradual ramp-up** — increase traffic as metrics hold
5. **Instant rollback** — keep the old version ready to restore with one switch

## Version Everything

Record which prompt version, model version, retrieval settings and tool versions served each request. Without this, you can't explain why behaviour changed — or roll back precisely.

## Prompt and Config Management

Treat prompts like code: store them in version control, review changes, and link each version to its eval results. A prompt edit is a deployment.

> **Try it:** Write a rollout plan for switching an AI feature to a newer model: what offline evals must pass, what percentage starts in canary, which metrics decide whether to ramp up, and how you'd roll back.

## Key Takeaways

- Guardrails block bad outcomes in real time; evals measure and improve quality
- Roll out with shadow mode, canaries, gradual ramps and instant rollback
- Version prompts, models and settings so every behaviour change is explainable`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "What does a trace in an LLM application record?",
            options: [
              "Only the final answer",
              "Every step of a request — inputs, outputs, tokens, latency, cost and errors per span",
              "The user's browser history",
              "Only failed requests"
            ],
            correctAnswer: 1,
            explanation: "End-to-end traces broken into spans make it possible to see exactly what happened in any request."
          },
          {
            id: "q4-2",
            question: "Which is an example of an implicit feedback signal?",
            options: [
              "A thumbs-down click",
              "A user rephrasing the same question right after an answer",
              "A written complaint",
              "A five-star rating"
            ],
            correctAnswer: 1,
            explanation: "Rephrasing suggests the answer missed, even though the user never explicitly rated it."
          },
          {
            id: "q4-3",
            question: "Your provider updates the model behind an alias, and answers change. What kind of drift is this?",
            options: [
              "Input drift",
              "Model drift",
              "Content drift",
              "User drift"
            ],
            correctAnswer: 1,
            explanation: "Model drift comes from changes to the model itself. Pin versions where possible and re-run evals after changes."
          },
          {
            id: "q4-4",
            question: "What is a canary release for an AI change?",
            options: [
              "Testing only on internal staff forever",
              "Sending a small percentage of live traffic to the new version and watching metrics before expanding",
              "Releasing at night",
              "Switching all users at once"
            ],
            correctAnswer: 1,
            explanation: "Canaries limit the blast radius of a bad change while gathering real-world evidence."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Building an Evaluation Culture",
      description: "Make evaluation a team habit, choose tools wisely and put it all into practice",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Evals in the Development Workflow",
          type: "article",
          content: `# Evals in the Development Workflow

Evaluation works best when it's woven into everyday development, not saved for a pre-launch scramble.

## Evals as Tests

Mirror the familiar testing pyramid:

| Layer | Runs | Contains |
|---|---|---|
| Fast checks | Every commit, in CI | Code assertions on a small, stable dataset |
| Full offline eval | Every prompt, model or retrieval change | Full dataset with code checks and validated judges |
| Human review | Weekly or before major releases | Sampled outputs reviewed by experts |
| Production monitoring | Continuously | Online evals, feedback, business metrics |

## Set Thresholds and Gates

- Define minimum pass rates per category ("policy accuracy ≥ 95%")
- Block merges that drop a critical category, even if the average improves
- Record eval results with every change, so history is visible

## Eval-Driven Development

Borrowing from test-driven development:

1. Find a failure in production or error analysis
2. Add examples that capture it to the dataset — they fail today
3. Change the prompt, retrieval or tools
4. Confirm the new examples pass **and** nothing else regressed

This keeps every improvement anchored to evidence.

## Cost-Aware Evaluation

Full eval runs with LLM judges cost money and time. Keep it sustainable:

- Use code checks wherever possible
- Use a smaller, cheaper judge model when it agrees well with experts
- Run the full suite on meaningful changes, a smaller subset on every commit
- Cache outputs for unchanged components

## Who Owns Evals?

Evaluation isn't only an engineering task. The best results come when:

- **Domain experts** define quality and label examples
- **Product managers** decide which failure categories matter most
- **Engineers** build the datasets, graders and pipelines

> **Try it:** Draft your eval "pyramid": what runs on every commit, what runs on every prompt change, what humans review, and what you monitor.

## Key Takeaways

- Integrate evals at every stage: CI, prompt changes, human review and production
- Gate changes on per-category thresholds, not just the average
- Make evaluation a shared responsibility of experts, product and engineering`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Choosing Tools Without Getting Locked In",
          type: "article",
          content: `# Choosing Tools Without Getting Locked In

There's a crowded market of evaluation and observability platforms. Choose based on your workflow — and remember that the most important asset is your data, not the tool.

## What You Actually Need

| Capability | Why |
|---|---|
| Tracing | See every step of real requests |
| Dataset management | Store, version and tag eval examples; turn traces into examples |
| Running experiments | Compare versions side by side on the same dataset |
| Custom graders | Plug in your own code checks and judges |
| Annotation interface | Let experts review and label efficiently |
| Online evaluation | Run graders on sampled live traffic |
| Dashboards and alerts | Watch trends and get notified of problems |

## Build vs. Buy

**Start simple:** a spreadsheet for error analysis, a Python script for running evals, and logs with trace IDs can take you surprisingly far.

**Adopt a platform when:**

- Several people need to review and label
- You run experiments frequently
- You need production tracing across many services

Both open-source and commercial options exist, and many integrate with OpenTelemetry.

## Questions to Ask Vendors

- Can I export all my traces, datasets and labels in an open format?
- Does it support OpenTelemetry or other open standards?
- Can I write custom graders in my own code?
- Where is data stored, and how is sensitive data handled?
- What does it cost at our expected trace volume?

## Avoid These Traps

- **Off-the-shelf metrics as your main measure** — generic "helpfulness" scores rarely match your real failure modes. Use them as a starting point at most.
- **Dashboards nobody reads** — every chart should map to a decision or an alert.
- **Tool before process** — buying a platform doesn't replace doing error analysis.

## Your Data Is the Moat

Your failure taxonomy, labelled examples and validated judges represent hard-won knowledge about your product. Keep them portable and version-controlled. They'll outlive any tool choice.

> **Try it:** List the capabilities above in order of how much your team needs them today. Could the top three be covered with a script and a spreadsheet for now?

## Key Takeaways

- Choose tools for tracing, datasets, experiments, custom graders and annotation
- Start simple; adopt a platform when collaboration and volume demand it
- Keep your data portable — your datasets and graders are the real asset`,
          estimatedMinutes: 11,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Capstone: An Evaluation Plan for a Real Product",
          type: "article",
          content: `# Capstone: An Evaluation Plan for a Real Product

Let's apply the whole course to one product: an AI assistant that answers employees' HR policy questions.

## 1. Error Analysis

An HR expert reviews 100 test conversations and finds:

| Category | Count |
|---|---|
| Uses a policy from the wrong country | 12 |
| Outdated policy (pre-2026 version) | 9 |
| Answers questions it should escalate (disputes, medical) | 7 |
| Incomplete answer to multi-part questions | 6 |
| Unsupported claims (hallucination) | 3 |

## 2. Dataset

- 150 examples covering common questions, each tagged by country, topic and difficulty
- 20 questions with no answer in the policies (expect "I don't know" or escalation)
- 15 sensitive topics that must always escalate
- Every future production failure added as a regression example

## 3. Graders

| Check | Type |
|---|---|
| Retrieved policy matches employee's country | Code (metadata check) |
| Retrieved policy is the current version | Code |
| Must-escalate topics escalated | Code (tool-call check) |
| Faithful to retrieved policy | LLM judge, validated against HR labels |
| Answers all parts of the question | LLM judge, validated |

## 4. Retrieval Evaluation

Recall@5 measured per country. The fix for the top failure turns out to be a **metadata filter on country** — a retrieval change, not a prompt change.

## 5. Rollout

- Offline evals gate every change (country accuracy ≥ 98%, escalation ≥ 100% on sensitive topics)
- Shadow mode for two weeks with HR staff reviewing answers
- 10% canary, then gradual ramp with monitoring

## 6. Production Monitoring

- Traces with personal data redacted
- Online faithfulness judge on 10% of traffic
- Implicit signals: rephrasing rate and handoffs to HR
- Weekly review of thumbs-down conversations, feeding new examples back into the dataset

## Your Turn

Use these six sections — **error analysis, dataset, graders, retrieval, rollout, monitoring** — to write an evaluation plan for an AI feature in your own work. It's the most valuable artefact you can take from this course.

## Key Takeaways

- Good evaluation starts with error analysis and ends with a closed feedback loop
- Mix code checks and validated judges, and evaluate retrieval separately
- Gate changes on the categories that matter most, and keep learning from production`,
          estimatedMinutes: 13,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "Why gate changes on per-category thresholds rather than only the average score?",
            options: [
              "Averages are hard to compute",
              "A change can raise the average while badly breaking a critical category",
              "Categories are required by law",
              "It makes evals run faster"
            ],
            correctAnswer: 1,
            explanation: "Averages hide regressions. Per-category gates protect the behaviours that matter most."
          },
          {
            id: "q5-2",
            question: "In eval-driven development, what's the first step after discovering a new failure?",
            options: [
              "Switch models",
              "Add examples capturing the failure to the dataset so they fail today",
              "Delete the failing examples",
              "Increase the temperature"
            ],
            correctAnswer: 1,
            explanation: "Capturing the failure first means you can prove the fix works and prevent it from coming back."
          },
          {
            id: "q5-3",
            question: "What should you prioritise when choosing an evaluation platform?",
            options: [
              "The largest number of built-in generic metrics",
              "Portability of your traces, datasets and labels, plus support for custom graders",
              "The most colourful dashboards",
              "Whichever is newest"
            ],
            correctAnswer: 1,
            explanation: "Your datasets and graders are the long-term asset. Portability and custom graders keep them yours."
          },
          {
            id: "q5-4",
            question: "In the HR assistant capstone, how was the biggest failure category fixed?",
            options: [
              "A longer system prompt",
              "A metadata filter on country in retrieval",
              "Switching to a larger model",
              "Removing the feature"
            ],
            correctAnswer: 1,
            explanation: "Error analysis and retrieval metrics showed it was a retrieval problem, so a retrieval fix solved it."
          }
        ]
      }
    }
  ]
});
