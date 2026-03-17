import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { aiFoundationCourse } from './aiFoundationCourse.js';
import { promptEngineeringCourse } from './promptEngineeringCourse.js';
import { aiApiAppsCourse } from './aiApiAppsCourse.js';
import { ragVectorDbCourse } from './ragVectorDbCourse.js';
import { langchainAgentsCourse } from './langchainAgentsCourse.js';

const firebaseConfig = {
  apiKey: "AIzaSyB_k938j9YuO0vI12u2zYMCBBcXaWlxgIU",
  authDomain: "iversity-99ee3.firebaseapp.com",
  projectId: "iversity-99ee3",
  storageBucket: "iversity-99ee3.firebasestorage.app",
  messagingSenderId: "142392345895",
  appId: "1:142392345895:web:982ebccd4d6c8381e29502",
  measurementId: "G-ES5ZWDCGCV"
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
