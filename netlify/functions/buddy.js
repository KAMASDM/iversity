/**
 * Netlify Function — buddy
 *
 * Proxies OpenAI chat completions for the Virtual Buddy.
 * Requires a verified Firebase user (Authorization: Bearer <ID token>).
 *
 * POST /.netlify/functions/buddy
 * Body: {
 *   userMessage:         string
 *   conversationHistory: { role: 'user'|'assistant', content: string }[]
 *   studentContext:      { courseName, currentChapter, currentLesson,
 *                          currentLessonContent, progressPercentage }
 *   retrievedContext:    string   (TF-IDF RAG result computed client-side)
 * }
 *
 * Response:
 *   { response: string, quiz?: { questions: Question[] } }
 *   Question: { id, question, options: string[4], correct: number, explanation }
 */

const {
  HttpError, requireUser, rateLimit, parseBody, clip, callOpenAI, callOpenAIJson, withHandler,
} = require('../lib/server.js');

// ── Quiz intent detection ────────────────────────────────────────────────────
function isQuizRequest(message) {
  return /quiz|test me|ask me|multiple.?choice|practice question|check my understanding|questions on|questions about/i.test(message);
}

// ── Tutor system prompt ──────────────────────────────────────────────────────
function buildSystemPrompt(studentContext, retrievedContext) {
  const lessonBlock = studentContext.currentLessonContent
    ? `\n== CURRENT LESSON (what the student is studying right now) ==\n${studentContext.currentLessonContent}\n`
    : '';

  return `You are Buddy — a warm, sharp, and genuinely helpful AI tutor at iVersity, an AI-powered education platform. You talk like a real human tutor who actually cares about the student, not like a chatbot reading from a script.

Your personality:
- Conversational and natural. Use phrases like "Great question!", "So here's the thing...", "Think of it this way...", "Honestly, this trips a lot of people up at first."
- Explain ideas with real-world analogies and concrete examples, not just textbook definitions.
- Encourage without being over-the-top ("That's a solid way to think about it" — not "Excellent job!!!").
- When a student is confused, break things down patiently — one piece at a time.
- Keep answers focused and digestible. Short paragraphs, natural line breaks.
- You can be slightly playful, but always stay on-task.
- NEVER say "As an AI language model", "I apologize", or anything that sounds robotic.

== COURSE KNOWLEDGE BASE (ground your answers here) ==
${retrievedContext || 'No specific content retrieved. Use your general knowledge about AI, ML, and this platform.'}
${lessonBlock}
== STUDENT CONTEXT ==
- Course: ${studentContext.courseName || 'General AI Learning'}
- Current chapter: ${studentContext.currentChapter || 'Not specified'}
- Current lesson: ${studentContext.currentLesson || 'Not specified'}
- Progress: ${studentContext.progressPercentage || 0}% through the course

== RESPONSE RULES ==
- Max 4 short, natural paragraphs. No walls of text.
- End with either a quick check-in ("Does that make sense? Happy to dig deeper!") or a concrete next step.
- Plain conversational text only — no markdown symbols like **, ##, or ---.
- If the question relates to the current lesson, connect your answer directly to it.
- If the question is outside the course content, still help — you know a lot about AI.`;
}

// ── Quiz system prompt ────────────────────────────────────────────────────────
function buildQuizPrompt(studentContext, retrievedContext) {
  const topic = studentContext.currentLesson
    ? `the lesson "${studentContext.currentLesson}"${studentContext.currentChapter ? ` (${studentContext.currentChapter})` : ''}`
    : studentContext.courseName
    ? `the course "${studentContext.courseName}"`
    : 'AI and machine learning fundamentals';

  return `You are Buddy, an AI tutor at iVersity. Generate a 4-question multiple-choice quiz on ${topic}.

Use this course content to write accurate, relevant questions:
${retrievedContext || 'Use your general knowledge about AI and machine learning.'}

Return ONLY a valid JSON object — no markdown, no code fences, no extra text:
{
  "intro": "A short, encouraging message (1 sentence) telling the student their quiz is ready — be natural and friendly, mention the topic",
  "questions": [
    {
      "id": 1,
      "question": "Clear, specific question text?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct": 0,
      "explanation": "1-2 sentence explanation of why the correct answer is right, written like a tutor talking to a student"
    }
  ]
}

Rules:
- Exactly 4 questions, each with exactly 4 options
- "correct" is the 0-based index of the correct option
- Questions must be grounded in the course content provided
- Vary difficulty: 2 straightforward, 1 application-based, 1 slightly tricky
- Explanations must be conversational ("The reason this is right is..." or "Think of it this way...")
- All wrong options must be plausible — no trick answers or obviously silly distractors`;
}

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = withHandler(async (event) => {
  const user = await requireUser(event);
  rateLimit(`buddy:${user.uid}`, { limit: 20, windowMs: 60_000 });

  const body = parseBody(event);
  const userMessage = clip(body.userMessage, 2000).trim();
  if (!userMessage) throw new HttpError(400, 'userMessage is required');

  const ctx = body.studentContext || {};
  const studentContext = {
    courseName: clip(ctx.courseName, 200),
    currentChapter: clip(ctx.currentChapter, 200),
    currentLesson: clip(ctx.currentLesson, 200),
    currentLessonContent: clip(ctx.currentLessonContent, 2000),
    progressPercentage: Number(ctx.progressPercentage) || 0,
  };
  const retrievedContext = clip(body.retrievedContext, 12000);

  // ── Quiz mode ───────────────────────────────────────────────────────────────
  if (isQuizRequest(userMessage)) {
    const quizData = await callOpenAIJson(
      [
        { role: 'system', content: buildQuizPrompt(studentContext, retrievedContext) },
        { role: 'user', content: userMessage },
      ],
      { temperature: 0.7, max_tokens: 1500 }
    );
    return {
      response: quizData.intro || "Here's your quiz — give it your best shot! 🎯",
      quiz: { questions: Array.isArray(quizData.questions) ? quizData.questions : [] },
    };
  }

  // ── Normal tutor mode ───────────────────────────────────────────────────────
  const history = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
  const historyMessages = history
    .slice(-10)
    .map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: clip(msg.content, 2000) }));

  const reply = await callOpenAI(
    [
      { role: 'system', content: buildSystemPrompt(studentContext, retrievedContext) },
      ...historyMessages,
      { role: 'user', content: userMessage },
    ],
    { temperature: 0.85, max_tokens: 600, top_p: 0.95 }
  );

  return { response: reply };
});
