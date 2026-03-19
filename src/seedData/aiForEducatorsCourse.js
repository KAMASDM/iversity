export const aiForEducatorsCourse = {
  title: "AI for Teachers & Educators: Teach Smarter, Not Harder",
  description: "A practical guide for school teachers, university professors, and corporate trainers on using AI to plan lessons, personalise learning, automate assessment, and future-proof their classrooms.",
  category: "AI for Professionals",
  level: "beginner",
  duration: 5,
  topics: [
    "Why AI matters for education",
    "AI tools landscape for educators",
    "Lesson planning and curriculum design with AI",
    "Creating differentiated learning materials",
    "AI-generated quizzes, rubrics, and assessments",
    "Giving personalised written feedback at scale",
    "Adaptive learning and AI tutoring tools",
    "Academic integrity and AI policies",
    "Teaching students about AI responsibly",
    "The future classroom"
  ],
  objectives: [
    "Understand how AI is transforming education across all levels",
    "Use AI tools to plan lessons and design curriculum in minutes",
    "Create differentiated materials for diverse learner needs",
    "Generate quizzes, rubrics, and written feedback with AI",
    "Set up AI tutoring tools that support your students",
    "Build and communicate a clear classroom AI policy"
  ],
  prerequisites: [
    "No technical knowledge required",
    "Basic computer literacy (email, Google Docs, web browsing)",
    "An eagerness to modernise your teaching practice"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "AI in Education: The Big Picture",
      description: "Understand how AI is reshaping teaching and why educators should embrace it rather than fear it",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Why Every Educator Needs to Understand AI",
          type: "article",
          content: `# Why Every Educator Needs to Understand AI

AI is not coming for teachers' jobs. It is coming for the parts of the job that drain your energy — the repetitive admin, the generic content, the one-size-fits-all approach. What it cannot replace is you: your relationships with students, your judgement, your ability to inspire.

## The Reality Check

A 2024 survey by the RAND Corporation found that 80% of teachers feel overwhelmed by administrative tasks that eat into teaching time. AI tools can cut that burden dramatically — freeing you to do the work that only a human teacher can do.

## What AI Can Do For Educators Right Now

- **Generate lesson plans** in seconds based on a topic, grade level, and duration
- **Differentiate materials** for struggling learners and advanced students simultaneously
- **Create quizzes and assessments** aligned to learning objectives
- **Provide written feedback** on student work at a level of detail that would take hours manually
- **Explain complex concepts** in multiple ways, adjusting reading level on demand
- **Translate content** so ELL (English Language Learner) students aren't left behind

## What AI Cannot Do

- Build trust with a struggling student
- Read the room when a lesson isn't landing
- Provide the mentorship that changes a life
- Make ethical judgements about what a student truly needs

## The Risk of Not Engaging

Educators who ignore AI face a growing disadvantage:
- Students are already using it (often without guidance)
- Colleagues who embrace it will have more time and better outcomes
- Your ability to prepare students for an AI-shaped world depends on understanding that world yourself

## A Frame That Helps

Think of AI as a **very capable teaching assistant** who never tires, never complains, and can draft anything you ask — but still needs your professional expertise to check, refine, and contextualise every output.

You are always the teacher. AI is the tool.`,
          estimatedMinutes: 15,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "The AI Tools Landscape for Educators",
          type: "article",
          content: `# The AI Tools Landscape for Educators

The range of AI tools available to teachers can feel overwhelming. This lesson gives you a clear map.

## Tier 1: General-Purpose AI Assistants

These are the workhorses — versatile tools that can handle almost any task you throw at them.

| Tool | Best For | Cost |
|------|----------|------|
| ChatGPT (GPT-4o) | Lesson plans, explanations, feedback drafts | Free / $20/mo |
| Claude (Anthropic) | Long document analysis, nuanced writing | Free / $20/mo |
| Google Gemini | Integrated with Google Workspace | Free |
| Microsoft Copilot | Integrated with Office 365 | Free with M365 |

**Recommendation**: Start with ChatGPT or Google Gemini. They have the most educator-focused prompts shared online and generous free tiers.

## Tier 2: Education-Specific AI Platforms

Built specifically for teachers with pre-built templates and classroom management features.

- **MagicSchool AI** — 60+ educator tools: lesson plans, rubrics, IEP support, differentiation
- **Khanmigo (Khan Academy)** — AI tutor for students + planning tools for teachers
- **Diffit** — Reads any article or concept and auto-generates differentiated versions
- **QuestionWell** — Generates questions from any source material (videos, PDFs, URLs)
- **Curipod** — Creates interactive lessons with polls, word clouds, and AI-generated slides

## Tier 3: Assessment & Feedback Tools

- **Gradescope** — AI-assisted grading for assignments and exams
- **Turnitin** — AI writing detection alongside plagiarism detection
- **Formative** — Real-time assessment with AI question generation

## Tier 4: Student-Facing AI Tutors

- **Khanmigo** — Socratic AI tutor that asks questions rather than giving answers
- **Duolingo Max** — AI-powered language practice
- **Photomath / Mathway** — Step-by-step maths problem solving

## The Golden Rule

You don't need every tool. Pick **one general AI assistant** and **one education-specific tool**, master them, then expand.`,
          estimatedMinutes: 20,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Setting Up Your Free AI Teaching Toolkit",
          type: "article",
          content: `# Setting Up Your Free AI Teaching Toolkit

You can build a powerful AI toolkit for zero cost. Here is exactly how to do it.

## Step 1: Create Your ChatGPT Account

1. Go to chat.openai.com
2. Sign up with Google or email
3. The free tier gives you access to GPT-4o (with usage limits)
4. Bookmark it — you'll use it daily

**Your first prompt to try:**
\`\`\`
You are an experienced educator helping me plan lessons.
My subject: [your subject]
My grade/level: [e.g., Year 8 / Grade 10 / University undergrad]
I want to teach: [topic]
Duration: [e.g., 60-minute class]

Please generate a complete lesson plan with learning objectives, activities, and a brief assessment idea.
\`\`\`

## Step 2: Set Up MagicSchool AI (Free)

1. Go to magicschool.ai
2. Create a free teacher account
3. Explore the tool menu — you'll find over 60 pre-built tools

Recommended tools to try first:
- **Lesson Plan Generator**
- **Differentiation Assistant** (same content, 3 reading levels)
- **Rubric Generator**

## Step 3: Create a "Teaching Context" Prompt Template

Save this in a notes app and paste it at the start of AI conversations:

\`\`\`
Context about my teaching:
- Subject: [e.g., Biology]
- Level: [e.g., GCSE Year 11 / 10th grade / University Year 2]
- Class size: [e.g., 28 students]
- Mix: [e.g., mixed ability, 4 ELL students, 2 students with IEPs]
- School system: [e.g., UK national curriculum / US Common Core / IB]

Use this context for everything I ask in this conversation.
\`\`\`

Providing this context once means every output is automatically tailored to your situation.

## Step 4: Build a Prompt Library

Create a simple document (Google Doc or Notion page) with your most useful prompts. Good starting prompts:

- "Generate 10 discussion questions for [topic] at [level]"
- "Explain [concept] in 3 different ways: simple analogy, technical definition, real-world example"
- "Write a 5-question multiple choice quiz on [topic] with answer key and explanations"
- "Create a differentiated version of this passage for a student reading 2 years below grade level: [paste text]"

## Step 5: Make It a Habit

The teachers who get the most from AI spend **15 minutes a day** experimenting. Block that time in your calendar for the first two weeks.`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "What is the most accurate description of AI's role in education?",
            options: [
              "AI will replace most teachers within 10 years",
              "AI handles repetitive tasks so teachers can focus on relationships and judgement",
              "AI is only useful for university-level teaching",
              "AI is too unreliable to use in any educational context"
            ],
            correctAnswer: 1,
            explanation: "AI excels at administrative and repetitive tasks, freeing educators to focus on the human elements of teaching that AI cannot replicate."
          },
          {
            id: "q1-2",
            question: "Which type of tool is MagicSchool AI?",
            options: [
              "A general-purpose AI assistant",
              "A student-facing AI tutor",
              "An education-specific AI platform with pre-built teacher tools",
              "An AI plagiarism detector"
            ],
            correctAnswer: 2,
            explanation: "MagicSchool AI is purpose-built for educators with 60+ tools including lesson plan generators, rubric builders, and differentiation assistants."
          },
          {
            id: "q1-3",
            question: "What is the recommended first step when using an AI assistant for lesson planning?",
            options: [
              "Ask the AI to teach the lesson itself",
              "Provide context about your subject, level, class size and mix",
              "Use the AI only for grading, not planning",
              "Ask the AI to replace your existing curriculum"
            ],
            correctAnswer: 1,
            explanation: "Providing your teaching context upfront (subject, level, class profile) ensures all AI outputs are relevant and tailored to your specific situation."
          },
          {
            id: "q1-4",
            question: "Which of the following is something AI currently CANNOT do?",
            options: [
              "Generate differentiated content at multiple reading levels",
              "Create quiz questions aligned to learning objectives",
              "Build genuine trust and mentorship relationships with students",
              "Translate teaching materials for ELL students"
            ],
            correctAnswer: 2,
            explanation: "Building genuine human relationships, trust, and mentorship is uniquely human — it is the core of what makes great teaching irreplaceable."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Lesson Planning & Curriculum Design with AI",
      description: "Use AI to create complete lesson plans, unit plans, and differentiated materials in a fraction of the time",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Generating Complete Lesson Plans with AI",
          type: "article",
          content: `# Generating Complete Lesson Plans with AI

A lesson plan that used to take 45–90 minutes can now take 10. Here is how to do it well.

## The Anatomy of a Good AI Lesson Plan Prompt

The more specific your prompt, the better the output. Use this structure:

\`\`\`
Create a complete lesson plan with the following details:

Subject: [e.g., History]
Topic: [e.g., Causes of World War 1]
Grade/Level: [e.g., Year 10 / Grade 9]
Duration: [e.g., 75 minutes]
Learning Objectives: [e.g., Students will be able to identify and explain 3 main causes]
Prior Knowledge: [e.g., Students have studied WW1 outcomes but not causes]
Special Requirements: [e.g., 2 ELL students, no access to devices, must include group activity]

Format the plan with: Objectives, Starter Activity, Main Teaching, Student Activity, Assessment Check, and Plenary.
\`\`\`

## Example Output You Should Expect

A good AI lesson plan will include:
- **Clear, measurable objectives** ("Students will be able to..." not "Students will understand...")
- **Time allocations** for each segment
- **Differentiation notes** for different learner needs
- **Discussion questions** that promote critical thinking
- **A formative assessment** activity built in

## Editing: The Essential Step

AI lesson plans are first drafts, not final products. Always:

1. **Check curriculum alignment** — does it match your standards or syllabus?
2. **Adjust pacing** — the AI doesn't know your class's actual speed
3. **Add your voice** — insert your preferred teaching approaches
4. **Verify accuracy** — especially for science, history, and current events content

## Power Move: Unit Plans

You can generate an entire unit plan in one prompt:

\`\`\`
Create a 4-week unit plan for teaching [topic] to [level].
Include: weekly themes, key learning objectives for each week, suggested activities, and one summative assessment.
\`\`\`

Then ask for individual lesson plans for each week.

## Time Saved

Teachers using AI for lesson planning report saving **3–5 hours per week** on planning. That time goes back to students.`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "Creating Differentiated Learning Materials",
          type: "article",
          content: `# Creating Differentiated Learning Materials

Differentiation is one of the most important — and most time-consuming — aspects of teaching. AI makes it fast.

## What Differentiation Means

Differentiated instruction means providing the **same core content** in different forms to meet the needs of:
- Students working below grade level
- Students at grade level
- Advanced or gifted students
- English Language Learners (ELL)
- Students with learning differences (dyslexia, ADHD, etc.)

Traditionally, creating 3 versions of anything triples your workload. With AI, it takes 2 extra minutes.

## Text Differentiation: The Core Skill

Start with any passage of text and ask:

\`\`\`
Here is an explanation of photosynthesis written at a Year 8 level:
[paste text]

Please rewrite this at three levels:
1. A simplified version for students reading 2+ years below grade level (short sentences, basic vocabulary, concrete examples)
2. A standard version (same as original, with any improvements)
3. An enriched version for advanced students with technical vocabulary and more complex analysis

Keep the core scientific facts identical in all three versions.
\`\`\`

## Scaffold Differentiation

For activities and tasks:

\`\`\`
I am giving students this essay question: "[question]"

Create 3 versions of a writing scaffold:
- Version A: Heavy scaffold (sentence starters, paragraph structure fully outlined, key vocabulary provided)
- Version B: Moderate scaffold (paragraph prompts only)
- Version C: Minimal scaffold (just the question with success criteria)
\`\`\`

## Visual and Alternative Formats

\`\`\`
Convert this explanation into:
1. A graphic organiser / concept map outline
2. A numbered step-by-step process students can follow
3. A "key vocabulary" box with 6 essential terms and simple definitions
\`\`\`

## Using Diffit.me for Instant Differentiation

The tool diffit.me can take **any article, video transcript, or concept** and automatically generate:
- A simplified reading passage
- Vocabulary list
- Comprehension questions
- Discussion questions

Paste a URL or describe a topic and it does the rest in under 30 seconds.`,
          estimatedMinutes: 22,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Designing Rubrics and Grading Criteria with AI",
          type: "article",
          content: `# Designing Rubrics and Grading Criteria with AI

Clear rubrics protect you legally, improve student outcomes, and save hours of justifying grades. AI makes building them effortless.

## The Best Rubric Prompt

\`\`\`
Create a detailed rubric for the following assessment:

Assessment type: [e.g., persuasive essay / science lab report / oral presentation]
Subject: [e.g., English / Chemistry]
Grade level: [e.g., Grade 11 / A-level]
Total marks: [e.g., 40 marks]
Criteria to assess: [e.g., argument quality, evidence use, structure, language, conclusion]

Format as a table with 4 performance levels: Excellent, Proficient, Developing, Beginning.
Include mark allocation for each criterion and level.
\`\`\`

## Example: Essay Rubric Output

| Criterion (10 pts each) | Excellent (9-10) | Proficient (7-8) | Developing (5-6) | Beginning (0-4) |
|---|---|---|---|---|
| Argument Quality | Clear, compelling thesis; all claims well-supported | Solid thesis; most claims supported | Thesis present but inconsistent support | No clear thesis or argument |
| Evidence Use | Strong, varied, accurately cited evidence | Adequate evidence, mostly cited | Some relevant evidence, limited citations | Little or irrelevant evidence |

## Single-Point Rubrics (For Speed)

If a full rubric feels like overkill, try asking for a **single-point rubric**:

\`\`\`
Create a single-point rubric for [assessment]. 
For each criterion, describe only what "meeting the standard" looks like.
Leave space beside each criterion for teachers to note what is missing or exceptional.
\`\`\`

Single-point rubrics are faster to create, easier for students to read, and research shows they are equally effective.

## Student-Facing Checklists

Turn any rubric into a student self-assessment checklist:

\`\`\`
Convert this rubric into a student self-assessment checklist.
Each item should be a "I can..." statement in student-friendly language.
Add a confidence rating scale (1–5) beside each item.
\`\`\`

## The Process

1. Generate rubric with AI
2. Review against your learning objectives
3. Adjust weightings to match your priorities
4. Share a draft with a colleague before first use
5. Gather student feedback after first use and refine`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "What is the most important step AFTER generating a lesson plan with AI?",
            options: [
              "Publish it directly to students without changes",
              "Edit and review it against your curriculum standards and class context",
              "Ask students to evaluate it before you review it",
              "Submit it to administration as-is"
            ],
            correctAnswer: 1,
            explanation: "AI lesson plans are first drafts. You must always check curriculum alignment, adjust pacing, verify accuracy, and add your professional judgement."
          },
          {
            id: "q2-2",
            question: "When creating differentiated materials, what should remain the SAME across all versions?",
            options: [
              "The reading level and vocabulary",
              "The length of the text",
              "The core facts, concepts and learning objectives",
              "The scaffold and structure provided"
            ],
            correctAnswer: 2,
            explanation: "Differentiation adapts the presentation (reading level, scaffold, format) while keeping the core content, facts and learning objectives consistent across all versions."
          },
          {
            id: "q2-3",
            question: "What is a key advantage of a single-point rubric over a full rubric?",
            options: [
              "It is more detailed and provides more marking guidance",
              "It is faster to create and easier for students to read while being equally effective",
              "It automatically marks student work",
              "It replaces the need for any feedback on student work"
            ],
            correctAnswer: 1,
            explanation: "Single-point rubrics describe only what 'meeting the standard' looks like, making them quicker to build and more comprehensible to students with no loss in assessment quality."
          },
          {
            id: "q2-4",
            question: "How much time do teachers typically report saving per week by using AI for lesson planning?",
            options: [
              "Less than 30 minutes",
              "1–2 hours",
              "3–5 hours",
              "More than 10 hours"
            ],
            correctAnswer: 2,
            explanation: "Research and teacher surveys consistently report 3–5 hours per week saved through AI-assisted lesson planning, time that can be reinvested in students."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "AI for Assessment and Feedback",
      description: "Automate quiz creation, generate personalised written feedback, and analyse student performance data",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Auto-generating Quizzes, Tests, and Practice Questions",
          type: "article",
          content: `# Auto-generating Quizzes, Tests, and Practice Questions

Creating a 20-question quiz aligned to learning objectives used to take an hour. AI reduces that to minutes.

## The Core Quiz Prompt

\`\`\`
Create a quiz on [topic] for [grade level].

Requirements:
- 10 multiple choice questions with 4 options each
- Mark the correct answer for each
- Include a brief explanation for why each correct answer is right
- Align questions to these learning objectives: [list objectives]
- Difficulty: [easy / mixed / challenging]
\`\`\`

## Question Type Variety

AI can generate many question types on demand:

**Multiple Choice:**
\`\`\`
Generate 5 multiple choice questions testing recall about [topic].
\`\`\`

**Short Answer:**
\`\`\`
Generate 5 short answer questions that require students to apply [concept].
Each question should be answerable in 2–3 sentences.
\`\`\`

**True/False with Justification:**
\`\`\`
Generate 8 true/false statements about [topic].
For each, write the correct answer and a one-sentence explanation.
\`\`\`

**Scenario-Based Questions:**
\`\`\`
Create 3 scenario-based questions where students must apply [concept] to a real-world situation.
\`\`\`

## Using Source Material

You can paste existing content and ask AI to generate questions from it:

\`\`\`
Read the following chapter summary and generate:
- 5 recall questions (knowledge level)
- 3 application questions (analysis level)
- 2 evaluation questions (critical thinking level)

[paste your text]
\`\`\`

This ensures questions are directly aligned to what you have taught.

## Tools That Make This Even Easier

- **QuestionWell** (questionwell.org) — paste any URL, PDF or text and get instant questions
- **Quizizz AI** — generates interactive quizzes with gamification built in
- **Kahoot! AI** — creates game-format questions from any topic
- **Google Forms + AI** — use Gemini in Google Workspace to auto-populate forms

## Building a Question Bank

Over time, export and save AI-generated questions into a question bank document organised by topic. This becomes an invaluable resource for future years.`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Using AI to Give Personalised Written Feedback",
          type: "article",
          content: `# Using AI to Give Personalised Written Feedback

Written feedback is the single most impactful thing a teacher can give a student — and the most time-consuming. AI helps you give more of it, better.

## The Problem It Solves

In a class of 30, giving meaningful written feedback on every piece of work can take 5–8 hours per assignment. AI can draft feedback that you then personalise, cutting that time by 60–70%.

## The Feedback Generation Approach

### Method 1: Feedback on Student Work

\`\`\`
You are an expert [subject] teacher at [level].
Below is a student's [essay/lab report/solution].

Using the following rubric criteria:
[paste rubric]

Write personalised, constructive feedback that:
- Identifies 2 specific strengths with evidence from the work
- Identifies 2 specific areas for improvement with actionable suggestions
- Ends with one encouraging sentence about their progress
- Length: approximately 150 words
- Tone: supportive and professional

Student work:
[paste student work]
\`\`\`

### Method 2: Feedback Templates by Grade Band

\`\`\`
Create a set of 6 feedback templates for [assignment type] at [level].
Create templates for students scoring in each band: Distinction, Merit, Pass, Near Miss, Fail.
Each template should have 2–3 fill-in-the-blank gaps where I can insert specific references to the student's actual work.
\`\`\`

This gives you a template to customise rather than writing from scratch each time.

## What You Must Always Do

**Never** paste a student's full name into a third-party AI tool — check your school's data privacy policy. Options:
- Use initials
- Refer to "the student"
- Use your school's approved AI tools with proper data handling

## Feedback on Common Errors

\`\`\`
I have marked 25 essays on [topic]. The most common errors are:
1. [error 1]
2. [error 2]
3. [error 3]

Write a one-page "Whole-Class Feedback" document that addresses these errors with:
- An explanation of what the mistake is
- Why it matters
- An example of the mistake
- A corrected example
- A practice task to fix it
\`\`\`

Whole-class feedback documents save enormous time compared to writing the same corrections on 25 individual papers.`,
          estimatedMinutes: 22,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Analysing Student Performance Data with AI",
          type: "article",
          content: `# Analysing Student Performance Data with AI

Once you have assessment data, AI can help you read it quickly and take targeted action.

## What AI Can Do With Your Data

- Identify which students are below, at, and above target
- Spot which questions or concepts most students got wrong
- Suggest intervention strategies for struggling students
- Draft reports or progress summaries

## Item Analysis: Finding Where Students Struggle

After any quiz or test, paste your results into an AI:

\`\`\`
Here are the results of a 10-question quiz for my class of 28 students.
Each row is a student (anonymised), each column is a question (Q1–Q10).
1 = correct, 0 = incorrect.

[paste data as a table or list]

Please:
1. Identify which questions had the lowest success rate
2. Suggest what misconceptions these results might indicate
3. Recommend 2–3 teaching strategies to address the most common gaps
\`\`\`

## Tracking Progress Over Time

\`\`\`
Here are scores for 5 students across 4 assessments this term:
[paste data]

Identify:
- Which students are improving, plateauing, or declining?
- Which students may need additional support?
- What patterns do you notice in the data?
\`\`\`

## Writing Progress Reports

\`\`\`
Write a school progress report comment for a student with these characteristics:
- Subject: [subject]
- Current grade: [e.g., B / 68%]
- Strengths: [e.g., strong analytical skills, participates actively]
- Areas to improve: [e.g., essay structure, time management under exam conditions]
- Recent progress: [e.g., improved significantly from C to B this term]
- Tone: positive, encouraging, professional
- Length: 80–100 words
\`\`\`

Run this prompt for each student (30 reports in 20 minutes instead of 2–3 hours).

## Important: Professional Responsibility

AI-generated reports and analysis must always be:
- Reviewed by you before sending to parents
- Based on accurate data you provide
- Checked for bias or inaccurate generalisations
- Personalised with details only you know

The data analysis is an aid to your professional judgement — not a replacement for it.`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "What is the primary benefit of 'whole-class feedback' documents compared to individual written feedback?",
            options: [
              "They are more personalised for each student",
              "They address common errors once for everyone, saving significant time",
              "They replace the need for any individual feedback",
              "They are required by most school systems"
            ],
            correctAnswer: 1,
            explanation: "Whole-class feedback addresses the most common errors across an entire class in one document, eliminating the need to write the same correction on 25 individual papers."
          },
          {
            id: "q3-2",
            question: "When pasting student work into an AI tool for feedback generation, you should:",
            options: [
              "Include the student's full name for accurate personalisation",
              "Avoid checking your school's data privacy policy as AI tools are all GDPR compliant",
              "Use initials or anonymise the work to comply with data privacy policies",
              "Only use the tool for students who have given verbal permission"
            ],
            correctAnswer: 2,
            explanation: "Student data privacy is a legal requirement. Always anonymise work or use your school's approved AI tools with proper data handling agreements before sharing student information."
          },
          {
            id: "q3-3",
            question: "What is 'item analysis' in the context of assessment data?",
            options: [
              "Counting how many items are in a student's pencil case",
              "Identifying which specific questions had the lowest success rate across the class",
              "Analysing the quality of questions before giving the test",
              "Checking if assessment items are aligned to curriculum standards"
            ],
            correctAnswer: 1,
            explanation: "Item analysis examines performance on each individual question to identify which concepts most students struggled with, helping teachers target their reteaching."
          },
          {
            id: "q3-4",
            question: "Approximately how much time can AI save when generating written progress reports?",
            options: [
              "About 5 minutes total",
              "The same amount of time — AI doesn't help with reports",
              "30 reports in about 20 minutes instead of 2–3 hours",
              "50% longer because you need to review every word"
            ],
            correctAnswer: 2,
            explanation: "AI can draft 30 individualised progress report comments in approximately 20 minutes when given the right prompts, compared to 2–3 hours of manual writing."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Personalising Learning with AI",
      description: "Set up adaptive tools and AI tutors that give every student a personalised learning experience",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Understanding Learner Profiles and Adaptive Learning",
          type: "article",
          content: `# Understanding Learner Profiles and Adaptive Learning

No two students learn the same way at the same pace. AI finally makes truly personalised learning achievable at classroom scale.

## What Adaptive Learning Means

Adaptive learning systems adjust:
- **Difficulty** — harder questions when a student masters a concept, easier when they struggle
- **Content format** — more visual explanations for visual learners, more text for readers
- **Pacing** — slower and more practice for students who need it
- **Topic sequencing** — addressing gaps before advancing

## Building a Learner Profile with AI

Start by creating a simple learner profile prompt for each student group:

\`\`\`
I teach a class of 28 students at [level].
I have identified 3 learner groups:

Group A (6 students): Working significantly below grade level. Struggle with reading extended text. Respond well to visual examples and practical activities.

Group B (18 students): At grade level. Generally motivated. Learn well through discussion and independent practice.

Group C (4 students): Advanced. Need extension challenges. Can handle abstract concepts.

For teaching [topic], suggest:
- A differentiated activity for each group
- A way to bring all three groups together at the end of the lesson
- Two extension tasks for Group C
\`\`\`

## Using Khan Academy's Khanmigo

Khanmigo is the most widely available AI tutor for students. Here's how to use it effectively:

**What it does:**
- Asks Socratic questions instead of giving answers directly
- Adjusts to the student's pace and understanding
- Covers maths, science, humanities, and test prep
- Tracks where students are struggling

**As a teacher:**
- Assign specific Khan Academy exercises linked to your current topic
- Use the teacher dashboard to see which students need support
- Direct struggling students to Khanmigo for extra explanation

## The Personalisation Promise

Research from Stanford and McKinsey suggests that personalised learning can:
- Improve learning outcomes by 15–30% for struggling students
- Increase student engagement and time-on-task
- Reduce the achievement gap between top and bottom quartiles

AI makes this achievable without requiring 30 different lesson plans.`,
          estimatedMinutes: 20,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "AI Tutoring Tools for Your Students",
          type: "article",
          content: `# AI Tutoring Tools for Your Students

AI tutors are most effective as supplements to your teaching — not replacements. Here is how to deploy them strategically.

## Principles for Using AI Tutors in Class

1. **Socratic over prescriptive**: The best AI tutors (like Khanmigo) ask questions rather than give answers
2. **Monitored, not unsupervised**: Check what your students are asking AI and what responses they're getting
3. **Targeted**: Assign AI tutoring for specific gaps, not general "free explore" time
4. **Discussed**: Talk with students about what they learned from the AI tutor

## Tool Roundup for Different Contexts

### For K-12 Maths
- **Khan Academy + Khanmigo** — free, Socratic approach, excellent tracking
- **Photomath** — scan a maths problem, get step-by-step solution (risk: can remove productive struggle)
- **IXL** — adaptive maths and literacy practice with detailed analytics

### For Reading and Writing
- **CommonLit** — AI-powered reading comprehension at levelled complexity
- **Writable** — AI writing feedback tool for students (linked to Google Classroom)
- **Grammarly** — grammar and writing style suggestions (useful from Year 7+)

### For Language Learning
- **Duolingo Max** — AI-powered conversation practice with immediate feedback
- **Speak** — AI conversation partner for speaking practice

### For Science and STEM
- **Wolfram Alpha** — step-by-step solutions for maths, physics, chemistry
- **Labster** — virtual science labs with AI guidance

## Setting Appropriate Expectations with Students

Before deploying any AI tutoring tool, have a class conversation:

- AI tutors help you **think through** problems, not just give you the answer
- Using AI to do your work for you robs you of the learning
- The goal is to **understand** the material, not to have the AI understand it for you
- Ask: "Did I actually learn this, or did I just get the AI to tell me the answer?"

## The Magic Question

Train students to ask their AI tutor: **"Don't give me the answer — ask me a question that helps me figure it out myself."**

This one instruction transforms AI from a cheat sheet into a genuine learning tool.`,
          estimatedMinutes: 22,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "AI for Special Educational Needs and Inclusion",
          type: "article",
          content: `# AI for Special Educational Needs and Inclusion

AI may be the most transformative technology for inclusive education we have ever seen. It is not perfect — but it dramatically expands what's possible.

## Text-to-Speech and Reading Support

For students with dyslexia, visual impairment, or reading difficulties:

- **Microsoft Immersive Reader** (free in Edge, Teams, Word) — adjustable text size, spacing, syllable breakdown, read-aloud
- **Natural Reader** — converts any text to natural speech
- **Speechify** — reads any document, article, or textbook aloud

**Teacher action**: Make sure your materials are accessible formats (not scanned PDFs) so these tools can read them.

## Speech-to-Text for Writing Support

For students with motor difficulties, dysgraphia, or those who think faster than they can type:

- **Google Voice Typing** (free in Google Docs) — highly accurate
- **Otter.ai** — transcribes speech in real time
- **Microsoft Dictate** (free in Word) — reliable for extended writing

## AI for IEP and Support Plan Writing

\`\`\`
Help me write an IEP goal for a student with the following profile:
- Age: 14
- Diagnosis: Dyslexia and ADHD
- Current performance: 2 grade levels below in reading, on grade level in maths
- Behaviour: Difficulty sustaining focus for more than 10 minutes

Write:
1. One SMART reading goal for the next 12 weeks
2. One SMART focus/attention goal
3. Two accommodations strategies for classroom teachers
\`\`\`

## Translation and ELL Support

For English Language Learner students:

\`\`\`
Translate the following instructions into [language] and simplify the English version simultaneously. 
Keep both versions on the same page so the student can compare:
[paste instructions]
\`\`\`

## Creating Accessible Materials

\`\`\`
Rewrite the following passage so it is accessible for a student with severe dyslexia:
- Short sentences (max 12 words)
- Simple, common vocabulary
- Active voice only
- No metaphors or idioms
- Add a glossary of 5 key terms at the end
\`\`\`

## The Equity Argument

The students who benefit most from AI tools are often those schools have historically underserved. For the first time, a student with a learning disability, an ELL student from a refugee background, or a student in a remote rural school has access to patient, 24/7 learning support. That is genuinely transformative.`,
          estimatedMinutes: 22,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "What makes Khanmigo different from a standard search engine for student learning?",
            options: [
              "It provides instant correct answers to maximise efficiency",
              "It uses a Socratic approach — asking questions to guide students to discover answers themselves",
              "It only works for advanced students in secondary school",
              "It replaces the need for teachers to explain concepts at all"
            ],
            correctAnswer: 1,
            explanation: "Khanmigo uses a Socratic approach, asking guiding questions rather than providing direct answers, which promotes deeper learning and critical thinking."
          },
          {
            id: "q4-2",
            question: "What is the 'magic question' students should learn to ask AI tutoring tools?",
            options: [
              "What is the answer to this question?",
              "Can you do my homework for me?",
              "Don't give me the answer — ask me a question that helps me figure it out myself",
              "What topic should I study next?"
            ],
            correctAnswer: 2,
            explanation: "Asking the AI not to give the answer but to ask a guiding question transforms AI from a shortcut into a genuine learning tool that builds understanding."
          },
          {
            id: "q4-3",
            question: "Which free tool is built into Microsoft Edge and Word to support students with dyslexia?",
            options: [
              "Otter.ai",
              "Speechify",
              "Microsoft Immersive Reader",
              "Natural Reader"
            ],
            correctAnswer: 2,
            explanation: "Microsoft Immersive Reader is built into Edge, Teams, and Word, offering adjustable text, read-aloud, syllable breakdown, and other supports — all at no cost."
          },
          {
            id: "q4-4",
            question: "When using AI to write IEP goals, what framework should the goals follow?",
            options: [
              "FAST (Fluid, Achievable, Standardised, Timed)",
              "SMART (Specific, Measurable, Achievable, Relevant, Time-bound)",
              "CLEAR (Collaborative, Limited, Engaging, Appropriate, Realistic)",
              "BLOOM (Behavioural, Lofty, Observed, Objective, Measurable)"
            ],
            correctAnswer: 1,
            explanation: "IEP goals should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound, ensuring they can be tracked and evaluated effectively."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "AI Ethics, Academic Integrity & the Future Classroom",
      description: "Build a clear AI policy, teach students to use AI responsibly, and prepare for what comes next",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Academic Integrity in the Age of AI",
          type: "article",
          content: `# Academic Integrity in the Age of AI

AI has fundamentally changed what counts as cheating — and what counts as good preparation for the real world. Every educator needs a clear, principled position.

## The Old Lines Have Moved

Pre-AI, academic integrity was relatively clear: don't copy someone else's work. AI has created a spectrum:

- **Clearly fine**: Using AI to research, get ideas, check grammar
- **Contextual**: Using AI to generate an outline you then fully rewrite
- **Questionable**: Submitting AI-generated text with light edits as your own
- **Clearly dishonest**: Submitting unedited AI output claiming it as original work

The problem is that different schools, subjects, and age groups will reasonably draw the line in different places.

## Building Your Classroom AI Policy

A good AI policy should answer:

1. **What** — Which tasks can/cannot involve AI assistance?
2. **When** — Are there AI-free assessments? When is AI allowed?
3. **How** — Must students disclose AI use? How?
4. **Why** — What is the educational purpose behind these rules?

**Template for classroom AI policy:**
\`\`\`
In our [subject] class:
✅ You MAY use AI for: brainstorming, research, checking grammar, getting explanations
✅ You MAY use AI-generated outlines if you write all content yourself
❌ You may NOT submit AI-generated text as your own writing
❌ You may NOT use AI on [specific assessments]
📣 If you use AI, you must note how in a brief disclosure at the end
\`\`\`

## Detection: What Works and What Doesn't

**AI detection tools** (Turnitin AI, GPTZero, Copyleaks) have significant limitations:
- False positive rates of 5–15% — real student writing is sometimes flagged
- Easily bypassed by students who know how to "humanise" AI text
- Not reliable enough to be the sole basis for an academic integrity case

**What actually works:**
- Process-based assessments (show your drafts, annotated sources)
- Oral defences or in-class explanations of submitted work
- Assessments personalised to your specific class context (AI can't know your class discussions)
- Building a culture where students want to learn, not just pass

## The Conversation to Have

The most effective academic integrity intervention is an honest conversation:

*"I'm not trying to catch you. I'm trying to prepare you. In 5 years, every job will have AI tools available. The competitive advantage goes to people who can think critically, write persuasively, and solve novel problems. If AI does that for you now, you miss the practice your brain needs. So let's talk about how we use AI as a learning partner — not as a shortcut past the learning."*`,
          estimatedMinutes: 22,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Teaching Students About AI Responsibly",
          type: "article",
          content: `# Teaching Students About AI Responsibly

Regardless of your subject, you have an opportunity — and arguably a duty — to help students become intelligent consumers and users of AI.

## The Core Literacies Every Student Needs

### 1. Verification Literacy
AI makes things up. Students must never trust AI at face value.
- **Practice**: Give students an AI-generated paragraph with 3 deliberate errors. Ask them to find and correct them.
- **Rule**: Every factual claim from an AI needs a verification source.

### 2. Prompt Literacy
The quality of AI output depends entirely on the quality of input.
- **Practice**: Give all students the same bad prompt and a good prompt. Compare outputs.
- **Lesson**: Show how specificity, context, and format instructions change everything.

### 3. Bias Literacy
AI reflects the biases in its training data.
- **Practice**: Ask an AI to describe a "typical nurse" and then a "typical CEO". Discuss the outputs.
- **Discussion**: Who created this AI? What data was it trained on? Whose perspective is centred?

### 4. Privacy Literacy
What you put into AI doesn't stay private.
- **Rule**: Never put personal information, medical details, or others' private information into public AI tools.
- **Discuss**: Where does your data go when you use these tools?

## A Cross-Curricular AI Lesson (60 mins)

**Objective**: Students understand AI capabilities, limitations and ethical issues.

**Activity 1 (15 min)**: Each student asks an AI a question about a topic they know well. Rate the accuracy.

**Activity 2 (15 min)**: Ask the AI the same question with a biased framing. What changes?

**Activity 3 (15 min)**: Find one thing the AI said that is verifiably wrong. How could it mislead someone?

**Discussion (15 min)**: Where is it unsafe to rely on AI? Where can it genuinely help?

## Teaching the Attribution Question

When a student used AI assistance, how should they acknowledge it?

**Template for student disclosure:**
\`\`\`
AI Assistance Disclosure:
I used [ChatGPT / Gemini / other] on [date] to [describe what you used it for: e.g., generate initial ideas / check grammar / explain concept X].
The ideas, analysis, and writing in this submission are my own. AI was used as a tool, not as the author.
\`\`\`

Teaching students to write these disclosures honestly is practice for the professional world they are entering.`,
          estimatedMinutes: 22,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "The Future Classroom: Preparing Students for an AI World",
          type: "article",
          content: `# The Future Classroom: Preparing Students for an AI World

The students in your classroom today will spend most of their careers working alongside AI. The question is not whether to prepare them — but how.

## The Skills That Will Still Matter

McKinsey's research on future of work skills consistently identifies:
- **Critical thinking** — evaluating information, recognising manipulation
- **Complex communication** — nuanced writing, persuasion, empathy
- **Creative problem solving** — novel situations AI cannot anticipate
- **Ethical reasoning** — navigating complex human dilemmas
- **Collaboration** — working effectively in teams with different strengths

Interestingly, these are also the skills that great teaching has always developed. AI hasn't changed what good education aims for — it has made those aims more urgent.

## The Shift from Knowing to Doing

In an AI world, the advantage goes to people who can:
- **Frame** the right questions (prompt well)
- **Judge** the quality of answers (critically evaluate)
- **Apply** knowledge to novel situations (transfer learning)
- **Communicate** insights persuasively (human connection)

Memorising facts matters less. Doing things with knowledge matters more.

This is good news for progressive educators — it validates everything you have argued about project-based learning, critical thinking, and deep understanding over rote recall.

## Redesigning Assessments for the AI Era

Assessments that AI cannot easily complete:
- Analyse **this specific class discussion** we had on Tuesday
- Write a reflection on your **personal experience** with this topic
- Create a solution to a **local community problem** you have researched
- Defend your argument in an **oral examination**
- Demonstrate this skill in **observable practice**

The shift is from "demonstrate you know this information" to "demonstrate you can do something meaningful with it."

## Your Role in the Transition

You are not just teaching [your subject]. You are modelling:
- How thoughtful professionals engage with powerful tools
- How to think critically about AI's outputs
- How to remain curious with technology, not passive
- How human judgement and values guide technology's use

That is, arguably, the most important thing you can teach right now.

## Your Next Steps

1. Choose one AI tool to use consistently for the next 30 days
2. Try one AI-generated lesson plan this week
3. Have one honest conversation with your class about AI
4. Connect with colleagues who are experimenting — share what works
5. Stay curious: the tools will keep changing, but the principles won't`,
          estimatedMinutes: 20,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "What is the most significant limitation of AI detection tools like GPTZero and Turnitin AI?",
            options: [
              "They are expensive and most schools can't afford them",
              "They only work on essays, not other assignment types",
              "False positive rates of 5–15% can incorrectly flag genuine student work",
              "They immediately share flagged work with school administrators"
            ],
            correctAnswer: 2,
            explanation: "AI detection tools have significant false positive rates, meaning they can incorrectly accuse genuine students of using AI. This makes them unreliable as the sole basis for academic integrity cases."
          },
          {
            id: "q5-2",
            question: "Which type of assessment is MOST resistant to AI completion?",
            options: [
              "A 2,000-word analytical essay submitted online",
              "A multiple choice exam taken at home",
              "An oral defence where students explain their reasoning in person",
              "A research report on a publicly available topic"
            ],
            correctAnswer: 2,
            explanation: "Oral defences require students to explain their understanding in real time, demonstrating genuine comprehension that AI cannot replicate on their behalf."
          },
          {
            id: "q5-3",
            question: "According to McKinsey's research, which skill will REMAIN highly valuable for students in an AI-driven workplace?",
            options: [
              "Fast memorisation of factual information",
              "Accurate manual calculation and data entry",
              "Critical thinking, ethical reasoning and complex communication",
              "Typing speed and keyboard shortcuts"
            ],
            correctAnswer: 2,
            explanation: "McKinsey consistently identifies critical thinking, complex communication, ethical reasoning and creative problem-solving as high-value human skills that AI augments rather than replaces."
          },
          {
            id: "q5-4",
            question: "What does 'verification literacy' mean in the context of AI education?",
            options: [
              "The ability to create an account on AI platforms",
              "Knowing how to cite AI tools in academic work",
              "The skill of always checking AI-generated facts against reliable sources",
              "Understanding how AI tools are verified and certified safe"
            ],
            correctAnswer: 2,
            explanation: "Verification literacy is the critical skill of never accepting AI outputs at face value, always checking factual claims against authoritative sources before acting on or submitting them."
          }
        ]
      }
    }
  ]
};
