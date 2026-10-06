/**
 * Netlify Function — ai
 *
 * Server-side AI tasks that used to run in the browser with an exposed key.
 * Requires a verified Firebase user (Authorization: Bearer <ID token>).
 *
 * POST /.netlify/functions/ai
 * Body: { task: 'questionnaire' | 'curriculum' | 'quiz', ...params }
 *
 *  questionnaire  { courseTitle, topics[] }
 *                 → { questions: [{ id, category, question, options: [{ value, label }], required }] }
 *  curriculum     { courseTitle, topics[], profile: { experienceLevel, goals, learningStyle,
 *                   timeCommitment, previousKnowledge } }
 *                 → { modules: [...], totalDuration, difficultyProgression }
 *  quiz           { courseTitle, chapterTitle, chapterSummary, previousScores[] }
 *                 → { questions: [{ id, question, options[4], correctAnswer, explanation }] }
 */

const {
  HttpError, requireUser, rateLimit, parseBody, clip, callOpenAIJson, withHandler,
} = require('../lib/server.js');

const SYSTEM = 'You are an expert instructional designer for iVersity, an AI education platform. Always reply with a single valid JSON object and nothing else.';

const list = (value, maxItems, maxLen) =>
  (Array.isArray(value) ? value : []).slice(0, maxItems).map(v => clip(v, maxLen));

function questionnairePrompt({ courseTitle, topics }) {
  return `Create an onboarding questionnaire for a student enrolling in "${courseTitle}".
Course topics: ${topics.join(', ') || 'general AI'}

Write exactly 5 multiple-choice questions, in this order and with these ids:
q1 (knowledge): their current knowledge level of this subject
q2 (goals): what they most want to get out of the course
q3 (style): how they prefer to learn
q4 (commitment): hours per week they can commit — option values must be numbers like "2", "5", "10"
q5 (experience): related tools or topics they have used before

Each question has 3-4 options. JSON shape:
{ "questions": [ { "id": "q1", "category": "knowledge", "question": "…", "options": [ { "value": "short_slug", "label": "Readable option" } ], "required": true } ] }`;
}

function curriculumPrompt({ courseTitle, topics, profile }) {
  return `Design a personalized weekly study plan for "${courseTitle}".
Course topics: ${topics.join(', ') || 'general AI'}

Student profile:
- Experience level: ${profile.experienceLevel}
- Goals: ${profile.goals}
- Preferred learning style: ${profile.learningStyle}
- Time commitment: ${profile.timeCommitment} hours/week
- Previous knowledge: ${profile.previousKnowledge}

Create 4-8 weekly modules that start at the student's level and progress in difficulty.
JSON shape:
{ "modules": [ { "week": 1, "title": "…", "description": "…", "objectives": ["…"], "estimatedHours": 4, "difficulty": "beginner|intermediate|advanced", "topics": ["…"] } ],
  "totalDuration": "6 weeks", "difficultyProgression": "beginner to intermediate" }`;
}

function quizPrompt({ courseTitle, chapterTitle, chapterSummary, previousScores }) {
  const avg = previousScores.length
    ? Math.round(previousScores.reduce((a, b) => a + b, 0) / previousScores.length)
    : null;
  const difficulty = avg === null ? 'intermediate' : avg >= 80 ? 'advanced' : avg >= 60 ? 'intermediate' : 'beginner';

  return `Write a 5-question multiple-choice quiz for the chapter "${chapterTitle}" of the course "${courseTitle}".
Chapter content: ${chapterSummary || 'Not provided — use the chapter title.'}
Student's average quiz score so far: ${avg === null ? 'no quizzes yet' : `${avg}%`}. Target difficulty: ${difficulty}.

Rules: exactly 4 plausible options per question; "correctAnswer" is the 0-based index of the right option;
explanations are 1-2 friendly sentences.
JSON shape:
{ "questions": [ { "id": "q1", "question": "…", "options": ["…","…","…","…"], "correctAnswer": 0, "explanation": "…" } ] }`;
}

// Normalise model output so the UI can trust the shape
function validQuizQuestions(questions) {
  return (Array.isArray(questions) ? questions : [])
    .filter(q => q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2
      && Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < q.options.length)
    .map((q, i) => ({
      id: `q${i + 1}`,
      question: q.question,
      options: q.options.map(String),
      correctAnswer: q.correctAnswer,
      explanation: String(q.explanation || ''),
    }));
}

exports.handler = withHandler(async (event) => {
  const user = await requireUser(event);
  rateLimit(`ai:${user.uid}`, { limit: 10, windowMs: 60_000 });

  const body = parseBody(event);
  const courseTitle = clip(body.courseTitle, 200) || 'this course';
  const topics = list(body.topics, 20, 120);

  switch (body.task) {
    case 'questionnaire': {
      const result = await callOpenAIJson(
        [{ role: 'system', content: SYSTEM }, { role: 'user', content: questionnairePrompt({ courseTitle, topics }) }],
        { temperature: 0.6, max_tokens: 1200 }
      );
      const questions = (result.questions || []).filter(q => q?.id && q?.question && Array.isArray(q.options));
      if (questions.length === 0) throw new HttpError(502, 'Could not generate a questionnaire.');
      return { questions };
    }

    case 'curriculum': {
      const p = body.profile || {};
      const profile = {
        experienceLevel: clip(p.experienceLevel, 100) || 'beginner',
        goals: clip(p.goals, 200) || 'general learning',
        learningStyle: clip(p.learningStyle, 100) || 'mixed',
        timeCommitment: clip(p.timeCommitment, 20) || '5',
        previousKnowledge: clip(p.previousKnowledge, 200) || 'none',
      };
      const result = await callOpenAIJson(
        [{ role: 'system', content: SYSTEM }, { role: 'user', content: curriculumPrompt({ courseTitle, topics, profile }) }],
        { temperature: 0.6, max_tokens: 2000 }
      );
      if (!Array.isArray(result.modules)) throw new HttpError(502, 'Could not generate a curriculum.');
      return result;
    }

    case 'quiz': {
      const result = await callOpenAIJson(
        [{
          role: 'system', content: SYSTEM,
        }, {
          role: 'user',
          content: quizPrompt({
            courseTitle,
            chapterTitle: clip(body.chapterTitle, 200) || 'this chapter',
            chapterSummary: clip(body.chapterSummary, 4000),
            previousScores: (Array.isArray(body.previousScores) ? body.previousScores : [])
              .map(Number).filter(Number.isFinite).slice(-10),
          }),
        }],
        { temperature: 0.7, max_tokens: 1500 }
      );
      const questions = validQuizQuestions(result.questions);
      if (questions.length === 0) throw new HttpError(502, 'Could not generate a quiz.');
      return { questions };
    }

    default:
      throw new HttpError(400, 'Unknown task');
  }
});
