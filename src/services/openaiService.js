/**
 * OpenAI Service — Virtual Buddy
 *
 * The actual OpenAI call happens inside the Netlify Function at
 * /.netlify/functions/buddy so the API key never reaches the browser.
 *
 * This module:
 *  1. Runs TF-IDF RAG retrieval client-side (fast, no API needed)
 *  2. POSTs the retrieved context + message to the Netlify Function
 *  3. Returns the tutor's reply
 */
import { retrieveContext } from './ragService.js';

const BUDDY_ENDPOINT = '/.netlify/functions/buddy';

export async function getVirtualBuddyResponse(
  userMessage,
  conversationHistory = [],
  studentContext = {},
  knowledgeChunks = []
) {
  // RAG retrieval happens here in the browser — no API key needed
  const retrievedContext = retrieveContext(userMessage, knowledgeChunks, 8);

  const res = await fetch(BUDDY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage,
      conversationHistory: conversationHistory.slice(-10),
      studentContext: {
        courseName:           studentContext.courseName           || null,
        currentChapter:       studentContext.currentChapter       || null,
        currentLesson:        studentContext.currentLesson        || null,
        currentLessonContent: studentContext.currentLessonContent || null,
        progressPercentage:   studentContext.progressPercentage   ?? 0,
      },
      retrievedContext,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Buddy function returned HTTP ${res.status}`);
  }

  const data = await res.json();
  // Return both the text response and optional quiz object
  return { response: data.response, quiz: data.quiz || null };
}
