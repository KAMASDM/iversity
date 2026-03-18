import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { aiFoundationCourse } from './aiFoundationCourse.js';
import { promptEngineeringCourse } from './promptEngineeringCourse.js';
import { aiApiAppsCourse } from './aiApiAppsCourse.js';
import { ragVectorDbCourse } from './ragVectorDbCourse.js';
import { langchainAgentsCourse } from './langchainAgentsCourse.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const courses = [
  aiFoundationCourse,
  promptEngineeringCourse,
  aiApiAppsCourse,
  ragVectorDbCourse,
  langchainAgentsCourse,
];

async function courseExists(title) {
  const q = query(collection(db, 'courses'), where('title', '==', title));
  const snap = await getDocs(q);
  return !snap.empty;
}

async function addAllCourses() {
  console.log('🚀 Adding all courses to Firestore...\n');

  for (const course of courses) {
    const exists = await courseExists(course.title);
    if (exists) {
      console.log(`⏭️  Skipping (already exists): ${course.title}`);
      continue;
    }

    const courseData = {
      ...course,
      createdBy: 'system',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrolledStudents: 0,
    };

    const docRef = await addDoc(collection(db, 'courses'), courseData);
    const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
    const totalQuizzes = course.chapters.filter(ch => ch.quiz?.enabled).length;

    console.log(`✅ Added: ${course.title}`);
    console.log(`   ID: ${docRef.id}`);
    console.log(`   Level: ${course.level} | Duration: ${course.duration} weeks`);
    console.log(`   Chapters: ${course.chapters.length} | Lessons: ${totalLessons} | Quizzes: ${totalQuizzes}\n`);
  }

  console.log('🎉 Done! All courses processed.');
  process.exit(0);
}

addAllCourses().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
