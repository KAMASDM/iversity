/**
 * Virtual Buddy client.
 *
 * The OpenAI call happens inside the Netlify Function at
 * /.netlify/functions/buddy so the API key never reaches the browser.
 *
 * This module:
 *  1. Runs TF-IDF RAG retrieval client-side (fast, no API needed)
 *  2. POSTs the retrieved context + message to the Netlify Function
 *  3. Returns the tutor's reply (and an optional quiz)
 */
import { retrieveContext } from './ragService.js';
import { callFunction } from './apiClient.js';

export async function getVirtualBuddyResponse(
  userMessage,
  conversationHistory = [],
  studentContext = {},
  knowledgeChunks = []
) {
  // RAG retrieval happens here in the browser — no API key needed
  const retrievedContext = retrieveContext(userMessage, knowledgeChunks, 8);

  const data = await callFunction('buddy', {
    userMessage,
    conversationHistory: conversationHistory
      .slice(-10)
      .map(({ role, content }) => ({ role, content })),
    studentContext: {
      courseName:           studentContext.courseName           || null,
      currentChapter:       studentContext.currentChapter       || null,
      currentLesson:        studentContext.currentLesson        || null,
      currentLessonContent: studentContext.currentLessonContent || null,
      progressPercentage:   studentContext.progressPercentage   ?? 0,
    },
    retrievedContext,
  }, { timeoutMs: 20000 });

  return { response: data.response, quiz: data.quiz || null };
}
