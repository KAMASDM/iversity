import admin from 'firebase-admin';
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { aiFoundationCourse } from './aiFoundationCourse.js';
import { promptEngineeringCourse } from './promptEngineeringCourse.js';
import { aiApiAppsCourse } from './aiApiAppsCourse.js';
import { ragVectorDbCourse } from './ragVectorDbCourse.js';
import { langchainAgentsCourse } from './langchainAgentsCourse.js';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const courses = [
  aiFoundationCourse,
  promptEngineeringCourse,
  aiApiAppsCourse,
  ragVectorDbCourse,
  langchainAgentsCourse,
];

async function courseExists(title) {
  const snap = await db.collection('courses').where('title', '==', title).get();
  return !snap.empty;
}

async function seedCourses() {
  console.log('🚀 Seeding courses to Firestore via Admin SDK...\n');

  for (const course of courses) {
    const exists = await courseExists(course.title);
    if (exists) {
      console.log(`⏭️  Skipping (already exists): ${course.title}`);
      continue;
    }

    const courseData = {
      ...course,
      createdBy: 'system',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      enrolledStudents: 0,
    };

    const docRef = await db.collection('courses').add(courseData);
    const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
    const totalQuizzes = course.chapters.filter(ch => ch.quiz?.enabled).length;

    console.log(`✅ Added: ${course.title}`);
    console.log(`   ID: ${docRef.id}`);
    console.log(`   Level: ${course.level} | Duration: ${course.duration} weeks | Chapters: ${course.chapters.length} | Lessons: ${totalLessons} | Quizzes: ${totalQuizzes}\n`);
  }

  console.log('🎉 Done!');
  process.exit(0);
}

seedCourses().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
