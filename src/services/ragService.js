/**
 * RAG Service — Retrieval-Augmented Generation for the Virtual Buddy
 *
 * Architecture:
 *  1. KNOWLEDGE BASE  — site FAQs + all published course content (chunked)
 *  2. RETRIEVAL       — TF-IDF keyword scoring (fast, no extra API calls)
 *  3. CONTEXT FORMAT  — top-K chunks formatted for the Gemini prompt
 */

// ─────────────────────────────────────────────────────────────────────────────
// Site-level FAQ chunks (hardcoded — always available)
// ─────────────────────────────────────────────────────────────────────────────
const SITE_KNOWLEDGE = [
  {
    id: 'faq-platform',
    type: 'faq',
    source: 'About iVersity',
    text: `iVersity is an AI-powered Learning Management System (LMS). It offers structured courses on Artificial Intelligence, Machine Learning, Prompt Engineering, LangChain, and RAG (Retrieval-Augmented Generation). Each course has chapters, lessons, chapter quizzes, and a final exam. Students earn XP points, level up, collect badges, and receive a certificate upon passing the final exam with 70% or higher.`,
  },
  {
    id: 'faq-enrollment',
    type: 'faq',
    source: 'Enrollment & Access',
    text: `To enroll in a course on iVersity, visit the Browse Courses page, click on a course, and press "Enroll Now". Courses with structured content (chapters and lessons) allow direct enrollment. You can start learning immediately after enrolling. Your progress is saved automatically. You can enroll in multiple courses at the same time.`,
  },
  {
    id: 'faq-ai-features',
    type: 'faq',
    source: 'AI Features',
    text: `iVersity has several AI-powered features: (1) Virtual Buddy — an AI assistant you can ask any question about your course. (2) Adaptive Quizzes — quizzes that adjust difficulty based on your past quiz scores. (3) Personalized Curriculum — AI generates a custom learning plan when you first enroll. (4) Final Exam Evaluation — AI grades your final exam and provides detailed feedback.`,
  },
  {
    id: 'faq-progress',
    type: 'faq',
    source: 'Progress & Completion',
    text: `Your course progress is tracked automatically. Each lesson you complete earns +10 XP. Completing a chapter quiz earns 25–50 XP depending on your score. A perfect quiz score earns the "Quiz Master" badge. Finishing 7 days in a row earns the "Week Warrior" badge. Complete all lessons and pass the final exam (70%+) to earn your certificate.`,
  },
  {
    id: 'faq-gamification',
    type: 'faq',
    source: 'Gamification & Badges',
    text: `iVersity uses gamification to keep you motivated. You earn XP (experience points) for every action: +10 XP per lesson, +30–50 XP per quiz based on score, +50 XP for streak milestones. Your level = floor(totalXP / 100) + 1. Badges available: First Lesson, Quiz Master (100% quiz), Week Warrior (7-day streak), Streak 7, Assignment Ace, and Helper.`,
  },
  {
    id: 'faq-course-room',
    type: 'faq',
    source: 'Course Room',
    text: `The Course Room is where you study. It has 4 tabs: (1) Content — lesson slides with navigation. (2) Notes — take personal notes linked to each lesson. (3) Tasks — a to-do list for your study goals. (4) Progress — your XP, level, and badges. Use arrow keys to navigate between slides. Click "Mark Complete" after finishing a lesson, then "Take Quiz" at the end of each chapter.`,
  },
  {
    id: 'faq-buddy',
    type: 'faq',
    source: 'Virtual Buddy',
    text: `The Virtual Buddy is your AI study assistant available in every course room. Click the "Ask Buddy" button in the top right of the Course Room to open it. You can ask it anything — explain concepts, quiz you on topics, help you understand code examples, or answer questions about your course content. Your chat history is saved per course.`,
  },
  {
    id: 'faq-quiz',
    type: 'faq',
    source: 'Quizzes & Exams',
    text: `Each chapter ends with a quiz. The quiz uses questions written by course instructors. A perfect score (100%) earns the Quiz Master badge and maximum XP. You can retake quizzes. The final exam at the end of a course is evaluated by AI — it gives you a score, topic breakdown, strengths, areas to improve, and determines certificate eligibility (minimum 70% to pass).`,
  },
  {
    id: 'faq-certificates',
    type: 'faq',
    source: 'Certificates',
    text: `iVersity issues certificates upon successfully completing a course. To earn a certificate: complete all lessons, pass the chapter quizzes, and pass the final exam with a score of 70% or higher. Certificates can be downloaded from the Certificates page in your student dashboard. They show your name, course title, completion date, and score.`,
  },
  {
    id: 'faq-courses-available',
    type: 'faq',
    source: 'Available Courses',
    text: `iVersity currently offers 5 courses: (1) "AI & LLMs: A Beginner's Foundation" — beginner level, 4 weeks. (2) "Mastering Prompt Engineering" — intermediate, 8 weeks. (3) "Building AI-Powered Applications with APIs" — intermediate, 6 weeks. (4) "Retrieval-Augmented Generation (RAG) & Vector Databases" — intermediate, 5 weeks. (5) "LangChain & Agents: Orchestrating AI Workflows" — intermediate, 6 weeks. All courses are in the AI & Machine Learning category.`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Content cleaner — strips markdown for cleaner chunk text
// ─────────────────────────────────────────────────────────────────────────────
function cleanContent(text) {
  return text
    .replace(/```[\s\S]*?```/g, '[code example]')  // code blocks → placeholder
    .replace(/^#{1,6}\s+/gm, '')                   // markdown headings
    .replace(/\*\*(.*?)\*\*/g, '$1')               // bold
    .replace(/\*(.*?)\*/g, '$1')                   // italic
    .replace(/`(.*?)`/g, '$1')                     // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')       // links
    .replace(/\n{3,}/g, '\n\n')                    // excess blank lines
    .trim()
    .slice(0, 700);
}

// ─────────────────────────────────────────────────────────────────────────────
// Build knowledge base chunks from published courses
// ─────────────────────────────────────────────────────────────────────────────
export function buildKnowledgeBase(courses = []) {
  const chunks = [...SITE_KNOWLEDGE];

  for (const course of courses) {
    // 1 — Course overview chunk
    chunks.push({
      id: `course-${course.id}`,
      type: 'course',
      source: course.title,
      text: [
        `Course: ${course.title}`,
        `Level: ${course.level} | Duration: ${course.duration} weeks | Category: ${course.category}`,
        `Description: ${course.description}`,
        course.topics?.length ? `Topics covered: ${course.topics.join(', ')}` : '',
        course.objectives?.length ? `Learning objectives: ${course.objectives.join('. ')}` : '',
        course.prerequisites?.length ? `Prerequisites: ${course.prerequisites.join(', ')}` : '',
      ].filter(Boolean).join('\n'),
    });

    for (const chapter of course.chapters || []) {
      const lessonList = chapter.lessons?.map(l => `"${l.title}" (${l.estimatedMinutes || '?'} min)`).join(', ') || '';

      // 2 — Chapter chunk
      chunks.push({
        id: `chapter-${course.id}-${chapter.id}`,
        type: 'chapter',
        source: `${course.title} › ${chapter.title}`,
        text: [
          `Course: ${course.title}`,
          `Chapter ${chapter.order}: ${chapter.title}`,
          chapter.description ? `Description: ${chapter.description}` : '',
          lessonList ? `Lessons: ${lessonList}` : '',
        ].filter(Boolean).join('\n'),
      });

      // 3 — One chunk per lesson
      for (const lesson of chapter.lessons || []) {
        const contentPreview = lesson.content ? cleanContent(lesson.content) : '';
        chunks.push({
          id: `lesson-${course.id}-${chapter.id}-${lesson.id}`,
          type: 'lesson',
          source: `${course.title} › ${chapter.title} › ${lesson.title}`,
          text: [
            `Course: ${course.title}`,
            `Chapter: ${chapter.title}`,
            `Lesson: ${lesson.title} (${lesson.type}, ${lesson.estimatedMinutes || '?'} min)`,
            contentPreview ? `Content summary: ${contentPreview}` : '',
          ].filter(Boolean).join('\n'),
        });
      }
    }
  }

  return chunks;
}

// ─────────────────────────────────────────────────────────────────────────────
// TF-IDF keyword retrieval
// ─────────────────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','can','i','me',
  'my','we','our','you','your','he','she','it','they','them','its','this','that',
  'these','those','and','or','but','in','on','at','to','for','of','with','about',
  'what','how','when','where','who','which','why','please','tell','explain',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));
}

function scoreChunk(queryTokens, chunkText) {
  const lower = chunkText.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    const matches = lower.match(new RegExp(`\\b${token}`, 'g'));
    if (matches) {
      // TF-like score: reward first match more than repeats
      score += 1 + Math.log(matches.length);
    }
  }
  return score;
}

/**
 * Retrieve the top-K most relevant chunks for a given query.
 * @param {string} query
 * @param {Array}  chunks  — result of buildKnowledgeBase()
 * @param {number} topK
 * @returns {string}  formatted context block ready to inject into a prompt
 */
export function retrieveContext(query, chunks, topK = 5) {
  if (!chunks || chunks.length === 0) return '';

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    // Fall back to site FAQ chunks
    return chunks
      .filter(c => c.type === 'faq')
      .slice(0, 3)
      .map(c => `[${c.source}]\n${c.text}`)
      .join('\n\n---\n\n');
  }

  const scored = chunks.map(chunk => ({
    chunk,
    score: scoreChunk(queryTokens, chunk.text),
  }));

  scored.sort((a, b) => b.score - a.score);

  const topChunks = scored
    .filter(s => s.score > 0)
    .slice(0, topK)
    .map(s => s.chunk);

  if (topChunks.length === 0) {
    // No match — return general site knowledge so buddy isn't helpless
    return chunks
      .filter(c => c.type === 'faq')
      .slice(0, 3)
      .map(c => `[${c.source}]\n${c.text}`)
      .join('\n\n---\n\n');
  }

  return topChunks
    .map(c => `[${c.source}]\n${c.text}`)
    .join('\n\n---\n\n');
}
