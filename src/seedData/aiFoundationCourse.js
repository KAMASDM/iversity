export const aiFoundationCourse = {
  title: "AI & LLMs: A Beginner's Foundation",
  description: "Start from zero and build a solid understanding of Artificial Intelligence and Large Language Models. No coding required — learn how AI thinks, how LLMs work, and how to use them confidently.",
  category: "AI & Machine Learning",
  level: "beginner",
  duration: 4,
  topics: [
    "What is Artificial Intelligence?",
    "Machine Learning vs Deep Learning",
    "How Neural Networks Work",
    "Understanding Language Models",
    "Tokens, Context Windows, and Embeddings",
    "Prompting Basics",
    "The AI Tool Landscape",
    "Practical AI Workflows"
  ],
  objectives: [
    "Understand the difference between AI, machine learning, and deep learning",
    "Explain how large language models process and generate text",
    "Use key AI terminology confidently: tokens, context window, temperature, embeddings",
    "Identify the right AI tool for different tasks",
    "Build simple but effective prompts from scratch",
    "Recognise the limitations and risks of current AI systems"
  ],
  prerequisites: [
    "No technical knowledge required",
    "Curiosity about AI is all you need",
    "Basic computer literacy (using apps, browsing the web)"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "What Is Artificial Intelligence?",
      description: "Separate hype from reality and build a clear picture of what AI actually is",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "AI, Machine Learning, and Deep Learning — What's the Difference?",
          type: "article",
          content: `# AI, Machine Learning, and Deep Learning

These terms are often used interchangeably, but they mean different things. Think of them as nested circles.

## Artificial Intelligence (Outermost Circle)

AI is the broadest concept: any technique that enables machines to mimic human-like intelligence.

Examples:
- A chess program that beats grandmasters
- A spam filter in your email
- A navigation app that reroutes you around traffic

The first AI programs (1950s–1980s) were rule-based — programmers wrote explicit IF/THEN rules. They worked well for narrow tasks but broke down when the world got complicated.

## Machine Learning (Middle Circle)

Machine learning is a subset of AI where systems **learn from data** instead of following hand-coded rules.

Instead of:
\`\`\`
IF email contains "free money" THEN mark as spam
\`\`\`

A machine learning model looks at millions of emails labelled "spam" or "not spam" and learns the patterns itself.

Key insight: **You don't program the logic — you provide examples, and the system finds the patterns.**

### Common ML types:
- **Supervised learning** – learn from labelled examples (spam/not spam)
- **Unsupervised learning** – find hidden patterns in unlabelled data (customer segments)
- **Reinforcement learning** – learn by trial and error with rewards (game-playing AI)

## Deep Learning (Innermost Circle)

Deep learning is a subset of machine learning that uses **artificial neural networks** with many layers ("deep" networks).

It became practical in the 2010s when:
1. Enough data became available
2. GPUs made training affordable
3. Key algorithmic discoveries clicked into place

Deep learning powers: image recognition, speech recognition, translation, and — most importantly for us — **language models**.

## The Key Takeaway

\`\`\`
AI > Machine Learning > Deep Learning > Large Language Models
\`\`\`

Every LLM (like GPT-4, Claude, or Gemini) is:
- An AI system ✓
- Built using machine learning ✓
- Specifically using deep learning ✓
- Trained on text to understand and generate language ✓`,
          estimatedMinutes: 15,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "How Neural Networks Learn",
          type: "article",
          content: `# How Neural Networks Learn

You don't need to be a mathematician to understand this. Let's use a simple analogy.

## The Brain Analogy (And Its Limits)

Neural networks are loosely inspired by the brain. Like neurons in your brain, artificial neurons:
- Receive inputs
- Process them
- Pass signals forward

But don't take the analogy too far. Artificial neural networks are mathematical functions — they're not conscious, they don't "understand" in any human sense.

## The Basic Building Block: A Neuron

A single artificial neuron does this:
1. Takes several numbers as input
2. Multiplies each by a "weight" (how important is this input?)
3. Adds them together
4. Applies an "activation function" to decide whether to fire

## Layers of Neurons

- **Input layer** — receives raw data (e.g., pixels of an image, words in a sentence)
- **Hidden layers** — process and transform features (the "thinking" happens here)
- **Output layer** — produces the final prediction

"Deep" learning just means there are many hidden layers.

## How Learning Happens: The Training Loop

Training a neural network is an iterative process:

1. **Forward pass** — feed data through the network, get a prediction
2. **Measure error** — compare prediction to the correct answer using a "loss function"
3. **Backpropagation** — calculate how much each weight contributed to the error
4. **Update weights** — adjust weights slightly to reduce error (using "gradient descent")
5. **Repeat millions of times**

After enough iterations, the weights settle into values that produce accurate predictions.

## What "Training" Really Means

When we say a model was "trained on the internet," it means:
- The model was shown billions of examples of text
- For each example, it tried to predict what came next
- It adjusted its weights based on how wrong it was
- After trillions of such adjustments, the weights encode vast knowledge

The final product — a set of numbers (weights) — is the model.

## Key Numbers

- GPT-3 had 175 billion parameters (weights)
- GPT-4 is estimated to have ~1 trillion
- These parameters are what get downloaded when you install an "AI model"

## Why This Matters for You

Understanding this helps you:
- Know why AI sometimes gets things wrong (imperfect training)
- Understand why newer models are better (more data, better training)
- Appreciate why AI can be confidently wrong (it's pattern-matching, not reasoning)`,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "A Brief History of AI",
          type: "article",
          content: `# A Brief History of AI

Understanding where AI came from helps you understand where it's going.

## 1950s–1970s: The Optimistic Dawn

- **1950** — Alan Turing proposes the "Turing Test" in his paper "Computing Machinery and Intelligence"
- **1956** — The term "Artificial Intelligence" is coined at the Dartmouth Conference
- **1957** — Frank Rosenblatt creates the Perceptron, an early neural network
- Researchers believed human-level AI was "20 years away"... repeatedly

## 1970s–1980s: First AI Winter

Progress stalled. Computers were too slow, data was too scarce, and rule-based systems couldn't handle real-world complexity. Funding dried up.

## 1980s–1990s: Expert Systems Boom

"Expert systems" encoded human knowledge as thousands of rules:
- MYCIN diagnosed bacterial infections
- DENDRAL identified chemical compounds

These worked well in narrow domains but couldn't generalise. Second AI winter followed.

## 1990s–2000s: The Machine Learning Era

- **1997** — Deep Blue beats chess champion Garry Kasparov
- **1998** — Yann LeCun's convolutional neural networks enable digit recognition
- Statistical methods and ML start powering spam filters, recommendation engines, search

## 2010s: The Deep Learning Revolution

- **2012** — AlexNet crushes image recognition benchmarks, sparking the deep learning era
- **2014** — GANs (Generative Adversarial Networks) enable AI-generated images
- **2016** — AlphaGo beats world Go champion — previously thought impossible
- **2017** — The Transformer architecture is published ("Attention Is All You Need")

## 2018–2023: The LLM Era Begins

- **2018** — BERT and GPT-1 show transformers can understand language
- **2020** — GPT-3 (175B parameters) shocks the world with its capabilities
- **2022** — ChatGPT launches, reaches 100M users in 2 months (fastest ever)
- **2023** — GPT-4, Claude 2, Gemini Pro — AI goes mainstream

## 2024–Present: The Agentic Era

- Models reason, use tools, and complete multi-step tasks autonomously
- Multimodal models understand text, images, audio, and video
- AI embedded in nearly every software product

## The Lesson

AI progress has not been linear — it's had waves of excitement and disappointment. The current wave is real and different because:
1. Transformers fundamentally changed what's possible
2. Scale (data + compute) unlocked emergent capabilities
3. Commercial investment is unprecedented

But hype is still real. Critical thinking remains essential.`,
          estimatedMinutes: 15,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "Which of the following is the correct relationship between AI, ML, and Deep Learning?",
            options: [
              "They are all the same thing",
              "Deep Learning contains Machine Learning which contains AI",
              "AI contains Machine Learning which contains Deep Learning",
              "Machine Learning is a newer replacement for AI"
            ],
            correctAnswer: 2,
            explanation: "AI is the broadest concept. Machine Learning is a subset of AI that learns from data. Deep Learning is a subset of ML using multi-layer neural networks."
          },
          {
            id: "q1-2",
            question: "What makes 'deep' learning 'deep'?",
            options: [
              "It thinks more deeply than traditional AI",
              "It uses many layers of neural networks",
              "It requires deep understanding of mathematics",
              "It processes very large files"
            ],
            correctAnswer: 1,
            explanation: "Deep learning uses neural networks with many hidden layers — the 'depth' refers to these multiple layers of processing."
          },
          {
            id: "q1-3",
            question: "How does a neural network 'learn'?",
            options: [
              "A programmer writes all the rules manually",
              "It memorizes every training example exactly",
              "It repeatedly adjusts weights to minimize prediction errors",
              "It downloads knowledge from the internet in real time"
            ],
            correctAnswer: 2,
            explanation: "Training is a loop: make a prediction, measure error, backpropagate gradients, and update weights — repeated millions of times until the model performs well."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "How Large Language Models Work",
      description: "Understand the magic behind ChatGPT, Claude, and Gemini",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "The Transformer: The Architecture That Changed Everything",
          type: "article",
          content: `# The Transformer Architecture

In 2017, Google researchers published a paper titled "Attention Is All You Need." It introduced the Transformer — the architecture behind every major LLM today.

## The Problem It Solved

Before Transformers, language models processed text word by word, left to right (like reading). This was slow and struggled with long-range dependencies.

Example: In "The trophy didn't fit in the suitcase because **it** was too big" — what does "it" refer to? Humans easily say the trophy, but older models struggled because "trophy" was many words back.

## The Key Innovation: Attention

The Transformer processes **all words simultaneously** and uses "attention" to figure out which words are most relevant to each other.

For each word, attention asks: "Given the context of this word, how much should I focus on every other word in the sentence?"

This creates a matrix of relationships. "It" attends strongly to "trophy" and moderately to "suitcase" and "fit" — solving the reference problem.

## The Architecture at a Glance

A Transformer consists of:
1. **Tokenizer** — splits text into tokens (subword units)
2. **Embedding layer** — converts tokens to numeric vectors
3. **Multiple Transformer blocks** — each contains:
   - Multi-head attention
   - Feed-forward neural network
   - Layer normalisation
4. **Output head** — predicts probabilities for the next token

## Why This Matters

- Transformers scale beautifully — more layers + more data = better performance
- They can be parallelised on GPUs, making training fast
- The same architecture works for text, images, code, and more

## The Pre-training Objective

GPT-style models are trained with a simple task: **predict the next token**.

Given "The cat sat on the ____", predict "mat".

Do this billions of times on internet-scale text, and the model learns grammar, facts, reasoning patterns, and world knowledge — all implicitly.

## Fine-tuning and RLHF

Pre-trained models are then fine-tuned:
1. **Supervised fine-tuning (SFT)** — trained on high-quality instruction-following examples
2. **RLHF** — human raters provide feedback, and the model is trained to produce responses humans prefer

This is what turns a raw language model into a helpful assistant.`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "Tokens, Context Windows, and Temperature",
          type: "article",
          content: `# Tokens, Context Windows, and Temperature

These three concepts govern how LLMs process and generate text. Understanding them makes you a far better user.

## Tokens: The Unit of Language

LLMs don't read words — they read tokens.

A token is roughly 3–4 characters or about ¾ of a word in English.

Examples:
- "Hello" → 1 token
- "Artificial" → 2 tokens: "Artific" + "ial"
- "ChatGPT is amazing" → 4 tokens
- 1000 words ≈ 750 tokens

Why tokens matter:
- **Cost**: APIs charge per token (input + output)
- **Limits**: Models have a maximum number of tokens they can handle at once
- **Speed**: More tokens = slower responses

## The Context Window

The context window is the total number of tokens a model can "see" at once — both your input AND its output.

| Model | Context Window |
|-------|----------------|
| GPT-3.5 | 4,096 tokens (~3,000 words) |
| GPT-4 | 128,000 tokens (~96,000 words) |
| Claude 3 Opus | 200,000 tokens (~150,000 words) |
| Gemini 1.5 Pro | 1,000,000 tokens (~750,000 words) |

Think of the context window as the model's "working memory". Everything outside the window is forgotten.

### Practical implications:
- In a long conversation, older messages may be dropped
- Very large documents may need to be processed in chunks
- More context = more expensive but potentially more accurate

## Temperature: Controlling Creativity

Temperature (0 to 2 in most APIs) controls how random the model's outputs are.

**Temperature = 0 (Deterministic)**
- Always picks the most probable next token
- Consistent, predictable, factual
- Best for: coding, data extraction, classification

**Temperature = 0.7 (Balanced)**
- Some variety with coherence maintained
- Best for: writing, analysis, conversation

**Temperature = 1.5–2 (Creative/Wild)**
- Explores less probable tokens
- Creative but can be incoherent
- Best for: brainstorming, poetry, experimental outputs

## Top-P (Nucleus Sampling)

A more nuanced alternative to temperature:
- Instead of controlling randomness, it limits which tokens are considered
- Top-p = 0.9 means: only consider tokens that make up the top 90% of probability mass
- Using both temperature and top-p is common

## The Practical Takeaway

When using any AI tool or API:
- **Long document?** Check the context window
- **Need facts?** Use low temperature
- **Need creativity?** Raise temperature
- **High API bills?** Monitor token usage`,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Embeddings and How AI Understands Meaning",
          type: "article",
          content: `# Embeddings: How AI Understands Meaning

Embeddings are one of the most powerful — and underappreciated — concepts in AI. They're how machines represent meaning as numbers.

## The Problem: Computers Only Know Numbers

Text is messy. Computers need numbers. The naive approach: give each word a number.

"cat" = 1, "dog" = 2, "kitten" = 3...

Problem: This doesn't capture any semantic relationship. "cat" (1) and "kitten" (3) are closer in meaning than "cat" (1) and "dog" (2), but the numbers suggest the opposite.

## The Solution: High-Dimensional Vectors

An embedding represents a word (or sentence, or document) as a **vector** — a list of hundreds or thousands of numbers.

"cat" → [0.21, -0.45, 0.83, 0.12, -0.67, ...]  (1536 numbers in OpenAI's model)

The numbers are learned during training. Words that appear in similar contexts get similar vectors.

## The Magic: Geometry = Meaning

In embedding space, **meaning becomes geometry**.

Famous example:
\`\`\`
king - man + woman ≈ queen
\`\`\`

The vector for "king" minus "man" plus "woman" lands near "queen". The model has learned that"royalty" and "gender" are separate dimensions.

Other relationships:
- "Paris" is to "France" as "Berlin" is to "Germany"
- "big" is to "bigger" as "fast" is to "faster"

## Measuring Similarity

Two embeddings are "close" if they're close in vector space — measured by **cosine similarity**.

This powers:
- Semantic search (find documents *meaning* similar things, not just same words)
- Recommendation systems
- Duplicate detection
- Retrieval-Augmented Generation (RAG)

## Practical Uses You'll Encounter

**Semantic search**: Search "cheap flights" and find results for "affordable airfare" — different words, similar meaning.

**Clustering**: Group 10,000 customer feedback messages into themes automatically.

**RAG systems**: Convert your documents into embeddings, then find the most relevant chunks for any query — more on this in the RAG course.

## The Big Picture

Embeddings are the "language" AI uses internally. When an LLM "reads" your prompt:
1. Each token becomes an embedding vector
2. Attention layers mix and transform these vectors
3. The final output vector is decoded back into tokens (words)

Everything the model knows is encoded in the geometry of a very high-dimensional space.`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "What is a 'token' in the context of LLMs?",
            options: [
              "A security password for accessing AI",
              "A subword unit that LLMs use to process text",
              "A complete sentence fed to the model",
              "A single character in the input"
            ],
            correctAnswer: 1,
            explanation: "Tokens are subword units (roughly 3–4 characters or ¾ of a word) that LLMs use to process and generate text. All costs and limits are measured in tokens."
          },
          {
            id: "q2-2",
            question: "What does a higher temperature setting do to an LLM's outputs?",
            options: [
              "Makes the model respond faster",
              "Uses more tokens per response",
              "Makes outputs more random and creative",
              "Makes the model more accurate"
            ],
            correctAnswer: 2,
            explanation: "Temperature controls randomness. Higher values lead to more varied, creative outputs; lower values produce more predictable, factual responses."
          },
          {
            id: "q2-3",
            question: "What is the 'context window'?",
            options: [
              "The visual interface of the chat application",
              "The maximum total tokens a model can process at once",
              "The number of previous conversations a model remembers",
              "The speed at which a model generates tokens"
            ],
            correctAnswer: 1,
            explanation: "The context window is the total number of tokens (input + output) a model can handle at once. Information outside this window is effectively forgotten."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Talking to AI: Prompting Fundamentals",
      description: "Learn how to communicate effectively with AI tools",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Why Good Prompts Matter",
          type: "article",
          content: `# Why Good Prompts Matter

The same AI model can give you a terrible or brilliant answer — depending on how you ask.

## The Quality-Input-Quality-Output Principle

AI models are not mind readers. They generate the most probable continuation of your input. If your input is vague, you'll get a vague response.

**Bad prompt:**
"Tell me about marketing"

**Good prompt:**
"Explain the three most cost-effective digital marketing channels for a B2B software company with a $5,000 monthly budget, targeting IT managers in mid-sized companies."

The second prompt gives the model:
- A specific domain (digital marketing)
- A constraint (cost-effective, $5k budget)
- A business type (B2B software)
- A target audience (IT managers, mid-sized companies)

## The Five Elements of a Strong Prompt

1. **Role** — Tell the AI who it is
   \`\`\`
   You are an expert UX designer with 10 years of experience.
   \`\`\`

2. **Context** — Provide relevant background
   \`\`\`
   I'm redesigning the onboarding flow for a fintech app targeting retirees.
   \`\`\`

3. **Task** — State clearly what you want
   \`\`\`
   Review these five onboarding screens and identify usability issues.
   \`\`\`

4. **Format** — Specify how you want the answer
   \`\`\`
   Return a numbered list with each issue, its severity (High/Medium/Low), and a suggested fix.
   \`\`\`

5. **Constraints** — Define limits
   \`\`\`
   Focus on accessibility and cognitive load. Keep each item under 50 words.
   \`\`\`

## Iteration Is Normal

No prompt is perfect on the first try. Think of prompting as a conversation:
1. Write your initial prompt
2. Review the response
3. Identify what's missing or wrong
4. Refine and try again

The best way to learn prompting is to experiment. The stakes are low — just try things.

## Common Beginner Mistakes

- **Too vague**: "Help me with my business" → be specific about what kind of help
- **Too long**: Overwhelming the model with irrelevant context
- **No format specified**: Getting a wall of text when you wanted bullet points
- **Single attempt**: Not iterating when the first response isn't quite right`,
          estimatedMinutes: 15,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Prompt Patterns Every Beginner Should Know",
          type: "article",
          content: `# Prompt Patterns Every Beginner Should Know

These templates cover 90% of everyday AI use cases.

## 1. The Explainer

\`\`\`
Explain [TOPIC] to a [AUDIENCE] in [LENGTH].
\`\`\`

Example:
\`\`\`
Explain how compound interest works to a 15-year-old in 3 short paragraphs.
\`\`\`

## 2. The Transformer

\`\`\`
Transform this [INPUT TYPE] into a [OUTPUT TYPE].

[Your content]
\`\`\`

Example:
\`\`\`
Transform this rough meeting transcript into a concise summary with action items.

[Paste transcript]
\`\`\`

## 3. The Critic

\`\`\`
Review the following [CONTENT] and provide feedback on [SPECIFIC ASPECTS].

[Your content]
\`\`\`

Example:
\`\`\`
Review the following email draft and provide feedback on tone, clarity, and call-to-action. Suggest a revised version.

[Paste email]
\`\`\`

## 4. The Comparator

\`\`\`
Compare [OPTION A] and [OPTION B] in terms of [CRITERIA].
Format as a table.
\`\`\`

## 5. The Step-by-Step Guide

\`\`\`
Give me a step-by-step guide to [TASK] for someone who [CONTEXT/LEVEL].
Include: what tools are needed, common mistakes to avoid, and expected time for each step.
\`\`\`

## 6. The Brainstormer

\`\`\`
Generate [NUMBER] ideas for [TOPIC].
Context: [Relevant background]
Requirements: [Any constraints]
\`\`\`

## 7. The Summariser

\`\`\`
Summarise the following in [NUMBER] bullet points.
Focus on [KEY ASPECTS].

[Content to summarise]
\`\`\`

## Stacking Patterns

You can combine patterns:
\`\`\`
You are an experienced product manager (Role).
I'm launching a productivity app for freelancers (Context).
Brainstorm 10 feature ideas (Task).
Then compare the top 3 in terms of development effort and user impact (Comparator).
Present as a table, then a 2-sentence recommendation (Format).
\`\`\``,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "What AI Can and Cannot Do",
          type: "article",
          content: `# What AI Can and Cannot Do

Calibrating your expectations is as important as learning prompting techniques.

## What Current LLMs Are Very Good At

### Language Tasks
- Summarising long documents
- Rewriting text in different styles or tones
- Grammar and spell checking
- Translation between languages
- Explaining complex topics simply

### Creative Tasks
- Brainstorming and ideation
- Writing first drafts
- Generating variations of copy
- Storytelling and creative writing

### Reasoning Tasks
- Solving logic puzzles
- Step-by-step math (with modern models)
- Code writing and debugging
- Analysing arguments

### Knowledge Tasks
- Answering factual questions (within training data)
- Summarising research
- Explaining how things work

## What LLMs Struggle With

### Real-Time Information
Most models have a training cutoff date. They don't know about events after that date unless connected to search tools.

### Precise Calculations
LLMs process numbers as tokens, not values. They can make arithmetic errors. Always verify important calculations.

### Long-Term Memory
By default, LLMs have no memory between conversations. Each chat starts fresh.

### Fully Reliable Factual Claims
LLMs can confidently generate false information ("hallucinations"). This happens because they're pattern-matching, not actually looking things up.

### Private or Internal Information
The model knows nothing about your company, your files, your emails — unless you paste them in.

## The Hallucination Problem

Hallucinations are the most dangerous limitation:
- The model invents plausible-sounding but false citations
- Generates fake statistics or studies
- States incorrect facts with full confidence

**Rule of thumb**: Never trust AI for important facts without verification. Always cross-reference with reliable sources.

## The Right Mental Model

Think of an LLM as an extraordinarily well-read assistant who:
- Has read most of the internet (up to a cutoff date)
- Can write, summarise, translate, and reason fluently
- Sometimes confidently misremembers things
- Has no common sense about anything beyond text
- Gets better the clearer your instructions are`,
          estimatedMinutes: 15,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "What is a 'hallucination' in AI?",
            options: [
              "When the AI refuses to answer a question",
              "When the AI generates confidently wrong or fabricated information",
              "When the AI takes too long to respond",
              "When the AI repeats the same answer twice"
            ],
            correctAnswer: 1,
            explanation: "Hallucinations occur when an LLM generates plausible-sounding but factually incorrect information. It's a fundamental limitation of pattern-matching systems."
          },
          {
            id: "q3-2",
            question: "Which of the following is NOT something current LLMs struggle with?",
            options: [
              "Knowing about events after their training cutoff",
              "Remembering conversations between sessions",
              "Rewriting text in a different tone",
              "Providing precise real-time stock prices"
            ],
            correctAnswer: 2,
            explanation: "LLMs are very good at language transformation tasks like rewriting text. They struggle with real-time information, long-term memory, and reliable factual recall."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "The AI Landscape: Models, Tools & Choosing Wisely",
      description: "Navigate the AI ecosystem and pick the right tool for each job",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "The Major AI Models Compared",
          type: "article",
          content: `# The Major AI Models Compared

The AI space moves fast. Here's a practical guide to the main players as of 2025.

## OpenAI (GPT Series)

**GPT-4o** — Flagship multimodal model
- Understands text, images, audio, and can generate images
- 128K context window
- Best for: complex reasoning, coding, visual analysis
- Access: ChatGPT Plus, API

**GPT-4o mini** — Lighter, cheaper version
- Faster and more affordable
- Best for: everyday tasks, high-volume applications
- Access: ChatGPT Free, API

**o1 / o3** — Reasoning-focused models
- "Thinks before answering" via chain-of-thought
- Best for: math, science, complex reasoning
- Slower but more accurate on hard problems

## Anthropic (Claude Series)

**Claude 3.5 Sonnet** — Often rated highest for writing
- 200K context window (can process entire books)
- Best for: long documents, analysis, nuanced writing
- Known for being more cautious/ethical

**Claude 3 Haiku** — Fast and cheap Claude
- Best for: quick tasks, real-time applications

## Google (Gemini Series)

**Gemini 1.5 Pro** — Biggest context window
- Up to 1 million tokens (can process hours of video)
- Natively multimodal
- Best for: very long documents, video analysis

**Gemini 1.5 Flash** — Speed-optimised
- Best for: real-time, high-volume tasks

## Open Source Models

**Llama 3 (Meta)** — Best open-source option
- Can run locally on a powerful laptop
- No API costs, full privacy
- Best for: privacy-sensitive applications, customisation

**Mistral** — European open-source alternative
- Excellent performance for its size

## How to Choose

| Need | Recommended |
|------|-------------|
| Best writing quality | Claude 3.5 Sonnet |
| Complex reasoning | GPT-4o / o1 |
| Very long documents | Gemini 1.5 Pro |
| Cheap and fast | GPT-4o mini / Gemini Flash |
| Privacy / local | Llama 3 |
| Image generation | DALL-E 3 / Midjourney |`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "AI Tools for Different Use Cases",
          type: "article",
          content: `# AI Tools for Different Use Cases

Beyond the base models, there's a rich ecosystem of specialised tools.

## Writing and Content

- **ChatGPT / Claude** — General-purpose writing assistant
- **Jasper** — Marketing-focused AI writing
- **Copy.ai** — Social media and ad copy
- **Grammarly** — Grammar, tone, and style improvement

## Image Generation

- **Midjourney** — Highest quality, artistic style
- **DALL-E 3** — Integrated in ChatGPT, good at following prompts
- **Stable Diffusion** — Open-source, runs locally
- **Ideogram** — Excellent at text in images

## Coding

- **GitHub Copilot** — Code completion in your IDE
- **Cursor** — AI-first code editor
- **Replit AI** — AI-assisted coding in the browser
- **ChatGPT / Claude** — Debugging and code explanation

## Research and Analysis

- **Perplexity AI** — Search engine + AI (cites sources)
- **NotebookLM (Google)** — AI over your documents
- **Elicit** — AI research assistant for academic papers

## Audio and Video

- **Whisper (OpenAI)** — Speech-to-text transcription
- **ElevenLabs** — AI voice cloning and text-to-speech
- **Runway / Pika** — AI video generation and editing
- **Suno / Udio** — AI music generation

## Productivity and Automation

- **Notion AI** — AI inside your workspace
- **Zapier AI** — AI-powered automation between apps
- **Make (Integromat)** — Visual AI workflow builder

## Specialised

- **Harvey** — AI for legal work
- **Abridge** — Medical documentation AI
- **Otter.ai** — Meeting transcription and summarisation

## The Decision Framework

Ask these questions:
1. Is this a one-off task or a workflow I'll repeat? (one-off → ChatGPT, workflow → build or use specialised tool)
2. Is the data sensitive? (yes → local model or check privacy policy)
3. Do I need citations? (yes → Perplexity, NotebookLM)
4. Is quality or cost more important? (quality → best model, cost → mini/flash)`,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Building Your Personal AI Workflow",
          type: "article",
          content: `# Building Your Personal AI Workflow

Knowing AI tools is one thing — using them consistently and well is another.

## The AI Integration Framework

### Step 1: Audit Your Weekly Tasks
List the 10 most time-consuming repetitive tasks you do each week:
- Writing emails?
- Summarising reports?
- Researching topics?
- Drafting presentations?

For each, ask: "Could AI do 80% of this in 10% of the time?"

### Step 2: Start Small
Don't try to AI-enable everything at once.
Pick ONE high-value, low-risk task and master it first.

Good starting points:
- Email drafts (low stakes, high frequency)
- Meeting summaries (immediate time savings)
- First drafts of reports (easy to edit, hard to start)

### Step 3: Create Your Prompt Library
Save prompts that work well. Organise by category:
\`\`\`
/prompts
  /writing
    email-reply.md
    blog-outline.md
  /analysis
    data-summary.md
    competitor-analysis.md
  /coding
    code-review.md
    debug-help.md
\`\`\`

### Step 4: Establish Quality Checks
AI outputs need human review. Build this into your workflow:
- **Factual content**: Always verify key claims
- **Client-facing content**: Always read before sending
- **Code**: Always test before deploying
- **Analysis**: Validate reasoning, check for bias

### Step 5: Stay Current (Without Overwhelm)
AI moves fast. A sustainable approach:
- Follow 2–3 trusted AI newsletters (e.g., The Rundown, TLDR AI)
- Spend 20 minutes/week exploring one new AI feature or tool
- Share findings with your team or community

## A Sample Daily AI Workflow

**Morning (10 min):**
- Paste today's priority list into ChatGPT and ask: "What should I focus on first and why?"

**During work:**
- Use AI for any task where you'd normally stare at a blank page
- Paste long documents into Claude for summaries before reading

**End of day (5 min):**
- Paste your drafted emails into AI for a tone check before sending

## The Human-AI Partnership

The most effective AI users treat AI as a:
- First-draft machine (never the final output)
- Research accelerator (not the source of truth)
- Thinking partner (challenge your ideas, find holes)
- Time multiplier (compress hours into minutes)

You remain responsible for accuracy, judgment, and ethics.`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "Which model is best suited for processing a 500-page document in a single prompt?",
            options: [
              "GPT-4o mini",
              "Claude 3 Haiku",
              "Gemini 1.5 Pro (1M token context)",
              "Stable Diffusion"
            ],
            correctAnswer: 2,
            explanation: "Gemini 1.5 Pro has up to 1 million token context window, making it ideal for very long documents that would exceed other models' limits."
          },
          {
            id: "q4-2",
            question: "When is it most important to verify AI-generated content?",
            options: [
              "Only for very long outputs",
              "Always, but especially for factual claims, client-facing content, and code",
              "Only when using free models",
              "Only when asking about technical topics"
            ],
            correctAnswer: 1,
            explanation: "AI can hallucinate in any context. Verification is always important but is especially critical for facts, public-facing content, and code that will be deployed."
          },
          {
            id: "q4-3",
            question: "What is the best first step when building an AI workflow?",
            options: [
              "Replace all your tools with AI immediately",
              "Audit your tasks and pick ONE high-value, low-risk task to start",
              "Build a custom AI model",
              "Subscribe to every AI tool available"
            ],
            correctAnswer: 1,
            explanation: "Start small: identify your most time-consuming tasks, pick one to AI-enable first, master it, then expand. Trying to do everything at once leads to poor adoption."
          }
        ]
      }
    }
  ]
};
