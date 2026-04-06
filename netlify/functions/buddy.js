/**
 * Netlify Function — buddy
 *
 * Proxies OpenAI chat completions for the Virtual Buddy.
 * The OPENAI_API_KEY env var lives only here on the server —
 * it is never bundled into the client JS.
 *
 * POST /.netlify/functions/buddy
 * Body: {
 *   userMessage:         string
 *   conversationHistory: { role: 'user'|'assistant', content: string }[]
 *   studentContext:      { courseName, currentChapter, currentLesson,
 *                          currentLessonContent, progressPercentage }
 *   retrievedContext:    string   (TF-IDF RAG result computed client-side)
 * }
 */

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── CORS headers ─────────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ── System prompt ─────────────────────────────────────────────────────────────
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

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  try {
    const {
      userMessage,
      conversationHistory = [],
      studentContext = {},
      retrievedContext = '',
    } = JSON.parse(event.body || '{}');

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return {
        statusCode: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'userMessage is required' }),
      };
    }

    const systemPrompt = buildSystemPrompt(studentContext, retrievedContext);

    // Keep last 10 turns of conversation history
    const historyMessages = conversationHistory
      .slice(-10)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: String(msg.content),
      }));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: userMessage.trim() },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.85,
      max_tokens: 600,
      top_p: 0.95,
    });

    const reply = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: reply }),
    };
  } catch (err) {
    console.error('[buddy function] error:', err?.message || err);
    return {
      statusCode: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err?.message || 'Internal server error' }),
    };
  }
};
