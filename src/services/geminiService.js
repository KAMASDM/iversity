import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Model configurations for different use cases
const MODELS = {
  QUESTIONNAIRE: 'gemini-pro',
  CURRICULUM: 'gemini-pro',
  QUIZ: 'gemini-pro',
  BUDDY: 'gemini-pro',
  EXAM: 'gemini-pro',
};

// Cache to store recent responses and reduce API calls
const responseCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to generate cache key
const generateCacheKey = (prompt, context) => {
  return `${prompt.substring(0, 50)}_${JSON.stringify(context).substring(0, 50)}`;
};

// Helper function to check cache
const getCachedResponse = (key) => {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  responseCache.delete(key);
  return null;
};

// Generate personalized curriculum based on questionnaire responses
export const generatePersonalizedCurriculum = async (
  courseId,
  studentProfile,
  questionnaireResponses
) => {
  try {
    const cacheKey = generateCacheKey('curriculum', { courseId, studentProfile });
    const cached = getCachedResponse(cacheKey);
    if (cached) return cached;

    const model = genAI.getGenerativeModel({ model: MODELS.CURRICULUM });

    const prompt = `
You are an expert AI curriculum designer for an AI learning platform.
Generate a personalized learning curriculum based on the following:

Student Profile:
- Experience Level: ${questionnaireResponses.experienceLevel}
- Learning Goals: ${questionnaireResponses.goals}
- Preferred Learning Style: ${questionnaireResponses.learningStyle}
- Time Commitment: ${questionnaireResponses.timeCommitment} hours/week
- Previous Knowledge: ${questionnaireResponses.previousKnowledge}

Create a structured curriculum with:
1. Weekly modules (6-8 weeks)
2. Learning objectives for each module
3. Recommended resources
4. Progressive difficulty level
5. Estimated time for each module

Return the response in JSON format with the following structure:
{
  "modules": [
    {
      "week": 1,
      "title": "Module Title",
      "description": "Module description",
      "objectives": ["objective1", "objective2"],
      "estimatedHours": 5,
      "difficulty": "beginner|intermediate|advanced",
      "topics": ["topic1", "topic2"]
    }
  ],
  "totalDuration": "6 weeks",
  "difficultyProgression": "beginner to advanced"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response to extract JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const curriculum = JSON.parse(text);

    // Cache the response
    responseCache.set(cacheKey, {
      data: curriculum,
      timestamp: Date.now(),
    });

    return curriculum;
  } catch (error) {
    console.error('Error generating curriculum:', error);
    throw new Error('Failed to generate personalized curriculum');
  }
};

// Generate adaptive quiz based on student's progress
export const generateAdaptiveQuiz = async (
  moduleId,
  studentProgress,
  previousQuizResults
) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODELS.QUIZ });

    const averageScore = previousQuizResults.length > 0
      ? previousQuizResults.reduce((sum, result) => sum + result.score, 0) / previousQuizResults.length
      : 50;

    const difficulty = averageScore >= 80 ? 'advanced' :
                      averageScore >= 60 ? 'intermediate' : 'beginner';

    const prompt = `
Generate an adaptive quiz for an AI learning module.

Module: ${moduleId}
Student's Average Score: ${averageScore}%
Recommended Difficulty: ${difficulty}
Previous Quiz Performance: ${JSON.stringify(previousQuizResults.slice(-3))}

Generate 5-7 multiple-choice questions that:
1. Match the ${difficulty} difficulty level
2. Build upon concepts the student struggled with
3. Include practical application questions
4. Progressively increase in complexity

Return in JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "difficulty": "beginner|intermediate|advanced",
      "topic": "topic name"
    }
  ],
  "estimatedTime": 10,
  "passingScore": 70
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const quiz = JSON.parse(text);

    return quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate adaptive quiz');
  }
};

// Virtual Buddy - AI Assistant for students
export const getVirtualBuddyResponse = async (
  userMessage,
  conversationHistory,
  studentContext
) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODELS.BUDDY });

    const prompt = `
You are "Buddy", a friendly and knowledgeable AI learning assistant for an AI education platform.

Student Context:
- Current Module: ${studentContext.currentModule}
- Progress: ${studentContext.progressPercentage}%
- Recent Topics: ${studentContext.recentTopics?.join(', ')}
- Struggling With: ${studentContext.strugglingTopics?.join(', ')}

Conversation History:
${conversationHistory.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Student Message: ${userMessage}

Provide a helpful, encouraging response that:
1. Directly addresses the student's question
2. Offers practical examples when relevant
3. Suggests next steps or resources
4. Maintains an encouraging and supportive tone
5. Keeps responses concise (2-3 paragraphs max)

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error getting buddy response:', error);
    throw new Error('Failed to get response from Virtual Buddy');
  }
};

// Evaluate final exam using Gemini
export const evaluateExam = async (
  examAnswers,
  courseContent,
  studentProfile
) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODELS.EXAM });

    const prompt = `
Evaluate this final exam submission for an AI course.

Student Profile:
- Learning Path: ${studentProfile.learningPath}
- Modules Completed: ${studentProfile.completedModules}
- Average Quiz Score: ${studentProfile.averageQuizScore}%

Exam Answers:
${JSON.stringify(examAnswers, null, 2)}

Course Learning Objectives:
${courseContent.objectives.join('\n')}

Provide a comprehensive evaluation with:
1. Overall score (0-100)
2. Performance breakdown by topic
3. Strengths demonstrated
4. Areas for improvement
5. Certification recommendation (pass/fail - minimum 70%)

Return in JSON format:
{
  "overallScore": 85,
  "passed": true,
  "topicScores": {
    "topic1": 90,
    "topic2": 80
  },
  "strengths": ["strength1", "strength2"],
  "improvements": ["area1", "area2"],
  "feedback": "Detailed feedback text",
  "certificationEligible": true
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const evaluation = JSON.parse(text);

    return evaluation;
  } catch (error) {
    console.error('Error evaluating exam:', error);
    throw new Error('Failed to evaluate exam');
  }
};

// Generate questionnaire for new students
export const generateCourseQuestionnaire = async (courseId, courseTopics) => {
  try {
    const cacheKey = generateCacheKey('questionnaire', { courseId });
    const cached = getCachedResponse(cacheKey);
    if (cached) return cached;

    const model = genAI.getGenerativeModel({ model: MODELS.QUESTIONNAIRE });

    const prompt = `
Generate an onboarding questionnaire for a new student enrolling in an AI course.
Course Topics: ${courseTopics.join(', ')}

Create 8-10 multiple-choice questions to assess:
1. Current knowledge level (2-3 questions)
2. Learning goals and motivation (2-3 questions)
3. Preferred learning style (2 questions)
4. Time commitment and pace (1-2 questions)
5. Previous experience with related topics (1-2 questions)

Return in JSON format:
{
  "questions": [
    {
      "id": "q1",
      "category": "knowledge|goals|style|commitment|experience",
      "question": "Question text",
      "options": [
        { "value": "option1", "label": "Option 1 text", "weight": 1 },
        { "value": "option2", "label": "Option 2 text", "weight": 2 }
      ],
      "required": true
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questionnaire = JSON.parse(text);

    // Cache the response
    responseCache.set(cacheKey, {
      data: questionnaire,
      timestamp: Date.now(),
    });

    return questionnaire;
  } catch (error) {
    console.error('Error generating questionnaire:', error);
    throw new Error('Failed to generate questionnaire');
  }
};

// Batch processing for optimization
export const batchGenerateQuizzes = async (modules, studentProgress) => {
  try {
    const quizPromises = modules.map((module, index) => {
      // Stagger API calls to avoid rate limiting
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateAdaptiveQuiz(module.id, studentProgress, []));
        }, index * 1000); // 1 second delay between calls
      });
    });

    const quizzes = await Promise.all(quizPromises);
    return quizzes;
  } catch (error) {
    console.error('Error batch generating quizzes:', error);
    throw new Error('Failed to batch generate quizzes');
  }
};

export default {
  generatePersonalizedCurriculum,
  generateAdaptiveQuiz,
  getVirtualBuddyResponse,
  evaluateExam,
  generateCourseQuestionnaire,
  batchGenerateQuizzes,
};
