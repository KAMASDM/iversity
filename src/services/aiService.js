/**
 * AI features (questionnaire, personalised curriculum, adaptive quizzes, final exam).
 * All model calls run server-side in Netlify Functions — no API keys in the browser.
 */
import { callFunction } from './apiClient.js';

// Used when the AI service is unavailable so enrollment never blocks on it
export const FALLBACK_QUESTIONNAIRE = {
  questions: [
    {
      id: 'q1', category: 'knowledge', required: true,
      question: 'How familiar are you with this subject today?',
      options: [
        { value: 'beginner', label: "Brand new — I'm starting from scratch" },
        { value: 'some', label: "I've read or watched a bit about it" },
        { value: 'intermediate', label: 'I use it occasionally at work or in projects' },
        { value: 'advanced', label: "I'm comfortable and want to go deeper" },
      ],
    },
    {
      id: 'q2', category: 'goals', required: true,
      question: 'What do you most want from this course?',
      options: [
        { value: 'career', label: 'Skills for my current job or a new role' },
        { value: 'project', label: 'Build a specific project' },
        { value: 'understanding', label: 'A solid conceptual understanding' },
        { value: 'curiosity', label: "I'm curious and exploring" },
      ],
    },
    {
      id: 'q3', category: 'style', required: true,
      question: 'How do you learn best?',
      options: [
        { value: 'reading', label: 'Reading and taking notes' },
        { value: 'visual', label: 'Diagrams, slides and videos' },
        { value: 'hands-on', label: 'Hands-on practice and examples' },
        { value: 'mixed', label: 'A mix of everything' },
      ],
    },
    {
      id: 'q4', category: 'commitment', required: true,
      question: 'How many hours per week can you study?',
      options: [
        { value: '2', label: '1–2 hours' },
        { value: '5', label: '3–5 hours' },
        { value: '10', label: '6–10 hours' },
        { value: '15', label: 'More than 10 hours' },
      ],
    },
    {
      id: 'q5', category: 'experience', required: true,
      question: 'Have you used AI tools like ChatGPT or Claude before?',
      options: [
        { value: 'none', label: 'Not yet' },
        { value: 'casual', label: 'A few times' },
        { value: 'regular', label: 'Regularly' },
        { value: 'builder', label: "I've built things with AI APIs" },
      ],
    },
  ],
};

export async function generateCourseQuestionnaire(course) {
  return callFunction('ai', {
    task: 'questionnaire',
    courseTitle: course.title,
    topics: course.topics || [],
  });
}

export async function generatePersonalizedCurriculum(course, profile) {
  return callFunction('ai', {
    task: 'curriculum',
    courseTitle: course.title,
    topics: course.topics || [],
    profile,
  }, { timeoutMs: 40000 });
}

export async function generateAdaptiveQuiz(course, chapter, previousQuizResults = []) {
  const chapterSummary = [
    chapter.description,
    ...(chapter.lessons || []).map(l => `${l.title}: ${(l.content || '').slice(0, 600)}`),
  ].filter(Boolean).join('\n');

  return callFunction('ai', {
    task: 'quiz',
    courseTitle: course.title,
    chapterTitle: chapter.title,
    chapterSummary,
    previousScores: previousQuizResults.map(r => r.score),
  }, { timeoutMs: 40000 });
}

export const startFinalExam = (enrollmentId) =>
  callFunction('final-exam', { action: 'start', enrollmentId });

export const submitFinalExam = (enrollmentId, attempt, answers) =>
  callFunction('final-exam', { action: 'submit', enrollmentId, attempt, answers });
